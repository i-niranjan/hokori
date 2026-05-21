import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { User, Briefcase, Upload, Pen } from "lucide-react";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconLoader2,
  IconPin,
  IconX,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { useForm, type FieldErrors } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventAddSchema } from "@/lib/schema";
import { AddProfile, UpdateProfile } from "@/services/profileService";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import type { EventAddPayload } from "@/lib/schema";
import { upload } from "@imagekit/react";
import api from "@/models/auth/refresh";
import { deletImage } from "@/services/imageKitService";
import clsx from "clsx";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileData } from "@hokori/types";
import { useAppSelector } from "@/lib/hooks";

interface ProfileFormProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  initialData?: ProfileData;
  onSaved?(profile: ProfileData): void;
}

const getProfileFormValues = (
  profile?: ProfileData
): EventAddPayload => ({
  profileImageUrl: profile?.avatarUrl || "",
  avatarFileId: profile?.avatarFileId || "",
  fullName: profile?.name || "",
  bio: profile?.bio || "",
  role: profile?.title || "",
  instagramUrl: profile?.instagram || "",
  githubUrl: profile?.github || "",
  linkedInUrl: profile?.linkedin || "",
  xUrl: profile?.twitter || "",
});

const getChangedProfileValues = (
  values: EventAddPayload,
  initialValues: EventAddPayload
): Partial<EventAddPayload> => {
  return Object.entries(values).reduce<Partial<EventAddPayload>>(
    (changedValues, [key, value]) => {
      const field = key as keyof EventAddPayload;
      if (value !== initialValues[field]) {
        changedValues[field] = value;
      }
      return changedValues;
    },
    {}
  );
};

export default function ProfileForm({
  open,
  onOpenChange,
  initialData,
  onSaved,
}: ProfileFormProps) {
  const [profileLoading, setProfileLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const [preview, setPreview] = useState<{
    url?: string;
    fieldId?: string;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const form = useForm<EventAddPayload>({
    resolver: zodResolver(eventAddSchema),
    defaultValues: getProfileFormValues(initialData),
  });

  useEffect(() => {
    if (initialData?.avatarUrl) {
      setPreview({
        url: initialData.avatarUrl,
        fieldId: initialData.avatarFileId,
      });
    } else {
      setPreview(null);
    }
    form.reset(getProfileFormValues(initialData));
  }, [form, initialData]);

  const onError = (errors: FieldErrors<z.infer<typeof eventAddSchema>>) => {
    console.log("Form validation failed:", errors);
  };

  async function onSubmit(values: z.infer<typeof eventAddSchema>) {
    try {
      if (initialData) {
        const changedValues = getChangedProfileValues(
          values,
          getProfileFormValues(initialData)
        );

        if (Object.keys(changedValues).length === 0) {
          toast("No profile changes to save");
          onOpenChange(false);
          return;
        }

        const result = await UpdateProfile(changedValues);
        onSaved?.(result.data.data);
        toast("Profile Updated");
        onOpenChange(false);
        return;
      }

      const result = await AddProfile(values);
      onSaved?.(result.data.data);
      toast("Profile Added");
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong while saving your profile");
    }
  }

  const socialPlatforms = [
    {
      key: "instagramUrl",
      icon: IconBrandInstagram,
      placeholder: "@username",
      color: "from-pink-500 to-purple-600",
      label: "Instagram",
    },
    {
      key: "githubUrl",
      icon: IconBrandGithub,
      placeholder: "username",
      color: "from-gray-700 to-gray-900",
      label: "GitHub",
    },
    {
      key: "xUrl",
      icon: IconBrandX,
      placeholder: "@username",
      color: "from-blue-400 to-blue-600",
      label: "Twitter",
    },
    {
      key: "linkedInUrl",
      icon: IconBrandLinkedin,
      placeholder: "profile-url",
      color: "from-blue-600 to-blue-800",
      label: "LinkedIn",
    },
  ] as const;

  const handleUpload = async (
    file: File,
    fieldOnChange: (val: string) => void,
    setPreview: (val: { url?: string; fieldId?: string }) => void
  ) => {
    console.log("handleUpload get called");

    try {
      setProfileLoading(true);
      const res = await api.get("/image-kit/auth");
      const { expire, token, signature } = res.data;
      const uploadResponse = await upload({
        file,
        fileName: file.name,
        expire,
        token,
        signature,
        folder: `/user/${userId}/profile`,
        publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
        onProgress: (evt) => {
          console.log("progress", (evt.loaded / evt.total) * 100);
        },
      });

      console.log("Upload response:", uploadResponse);
      if (!uploadResponse.url || !uploadResponse.fileId || !uploadResponse) {
        return toast.error("Something went wrong while uploading");
      }

      setPreview({ url: uploadResponse.url, fieldId: uploadResponse.fileId });
      fieldOnChange(uploadResponse.url);
      form.setValue("avatarFileId", uploadResponse.fileId);
    } catch (error) {
      console.log(error);
      toast("Something went wrong while deleting a profile image");
    } finally {
      setProfileLoading(false);
    }
  };

  const removeImage = async (fieldOnChange: (val: string) => void) => {
    if (!preview?.fieldId) {
      toast.error(
        "Something went wrong while removing profile image, if you persist this bug please report us"
      );
      return;
    }
    setRemoveLoading(true);
    try {
      console.log("Preview ID ", preview.fieldId);

      const result = await deletImage(preview?.fieldId);
      setPreview(null);
      fieldOnChange("");
      form.setValue("avatarFileId", "");
      if (inputRef.current) inputRef.current.value = "";
      toast.success(result.message);
    } catch {
      toast.error(
        "Something went wrong, if you persist this bug please report us"
      );
    } finally {
      setRemoveLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log("Form values changed:", values);
  // }, [values]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <DialogHeader className="border-b pb-3 mb-2">
              <DialogTitle> Complete Your Profile</DialogTitle>
              <DialogDescription>
                Let's set up your developer profile and social links
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT SIDE */}
              <div className="bg-white/10 backdrop-blur-lg border rounded-2xl p-6 ">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  Personal Info
                </h3>

                <div className="space-y-4">
                  {/* Profile image box */}
                  <FormField
                    control={form.control}
                    name="profileImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex justify-center gap-4">
                            <div>
                              <Label
                                htmlFor="profileImage"
                                className={clsx(
                                  "cursor-pointer",
                                  preview?.url && "cursor-none"
                                )}
                              >
                                <div className="relative">
                                  <Avatar
                                    key={preview?.url ?? "fallback"}
                                    className="w-20 h-20  cursor-pointer border"
                                  >
                                    {profileLoading ? (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <IconLoader2 className="h-4 w-4 text-gray-500 animate-spin" />
                                      </div>
                                    ) : preview?.url ? (
                                      <AvatarImage src={preview.url} />
                                    ) : (
                                      <AvatarFallback>
                                        <Upload />
                                      </AvatarFallback>
                                    )}
                                  </Avatar>
                                  {preview?.fieldId && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeImage(field.onChange)
                                      }
                                      className="absolute z-50 -right-2 p-1  backdrop-blur-2xl cursor-pointer hover:scale-120 duration-150 transition-all  -top-1 rounded-full border"
                                    >
                                      {removeLoading ? (
                                        <IconLoader2 className="h-4 w-4 text-gray-500 animate-spin" />
                                      ) : (
                                        <IconX className="size-4 text-purple-700" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </Label>

                              <Input
                                ref={inputRef}
                                disabled={!!preview?.url}
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                className={clsx(
                                  "hidden",
                                  preview?.url && "pointer-events-none"
                                )}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleUpload(
                                      file,
                                      field.onChange,
                                      setPreview
                                    );
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="text-center">
                          Profile Image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Full name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                              <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <Input
                              type="text"
                              placeholder="Your Name"
                              className="w-full pl-10 pr-4 py-3 shadow-none h-13 focus:border-blue-500"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Role */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                              <Briefcase className="w-4 h-4 text-gray-400" />
                            </div>
                            <Input
                              type="text"
                              placeholder="Your Developer Role"
                              className="w-full pl-10 pr-4 py-3 shadow-none h-13 focus:border-purple-500"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="bg-white/10 backdrop-blur-lg border  rounded-2xl p-6 ">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center">
                    <IconPin className={`w-4 h-4 text-white`} />
                  </div>
                  Social Links
                </h3>

                <div className="space-y-3">
                  {socialPlatforms.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <FormField
                        key={platform.key}
                        control={form.control}
                        name={platform.key}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative group">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                  <div
                                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
                                  >
                                    <IconComponent className="w-4 h-4 text-gray-200" />
                                  </div>
                                </div>
                                <Input
                                  type="text"
                                  placeholder={platform.placeholder}
                                  className="w-full pl-14 pr-16 py-3 text-sm h-13"
                                  {...field}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <span className="text-xs text-gray-600 font-medium hidden sm:inline">
                                    {platform.label}
                                  </span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="col-span-2 ">
                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                            <Pen className="w-4 h-4 text-gray-400" />
                          </div>
                          <Textarea
                            placeholder="I am a pull stack dev.."
                            className="w-full pl-10 pr-4 py-3 shadow-none h-13 focus:border-blue-500"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Write somethn abt you're self
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
