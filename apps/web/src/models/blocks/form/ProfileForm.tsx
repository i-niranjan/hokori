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
import { IconLoader2, IconPin, IconX } from "@tabler/icons-react";
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
import {
  SOCIAL_PLATFORMS,
  normalizeUrl,
  type ProfileData,
  type SocialPlatform,
} from "@hokori/types";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/app/store";
import { setSocialLinks } from "../features/profileSlice";
import { setSocialLinksApi } from "@/services/socialService";
import { PLATFORM_META } from "@/models/preview/lib";

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
  const dispatch = useAppDispatch();
  const storeLinks = useAppSelector((state) => {
    const block = state.profile.blocks.find((b) => b.type === "PersonalInfo");
    return block?.type === "PersonalInfo"
      ? (block.data?.socialLinks ?? [])
      : [];
  });
  const [socialUrls, setSocialUrls] = useState<
    Partial<Record<SocialPlatform, string>>
  >({});

  useEffect(() => {
    if (!open) return;
    setSocialUrls(
      Object.fromEntries(storeLinks.map((l) => [l.platform, l.url])),
    );
    // Only reseed when the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
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
        if (Object.keys(changedValues).length > 0) {
          const result = await UpdateProfile(changedValues);
          onSaved?.(result.data.data);
        }
      } else {
        const result = await AddProfile(values);
        onSaved?.(result.data.data);
      }

      // Social links live in their own table; saved as a full set.
      const links = SOCIAL_PLATFORMS.filter((p) =>
        socialUrls[p]?.trim(),
      ).map((p) => ({ platform: p, url: normalizeUrl(socialUrls[p]!) }));
      const savedLinks = await setSocialLinksApi({ links });
      dispatch(setSocialLinks(savedLinks));

      toast(initialData ? "Profile Updated" : "Profile Added");
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong while saving your profile");
    }
  }


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
              <DialogTitle className="font-display">
                Complete Your Profile
              </DialogTitle>
              <DialogDescription>
                Let's set up your developer profile and social links
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT SIDE */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="size-6 rounded-md border bg-muted flex items-center justify-center">
                    <User className="size-4 text-muted-foreground" />
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
                                        <IconX className="size-4 text-foreground" />
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
                              <User className="size-4 text-muted-foreground" />
                            </div>
                            <Input
                              type="text"
                              placeholder="Your Name"
                              className="w-full pl-10 pr-4 py-3 shadow-none h-13"
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
                              <Briefcase className="size-4 text-muted-foreground" />
                            </div>
                            <Input
                              type="text"
                              placeholder="Your Developer Role"
                              className="w-full pl-10 pr-4 py-3 shadow-none h-13"
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
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="size-6 rounded-md border bg-muted flex items-center justify-center">
                    <IconPin className="size-4 text-muted-foreground" />
                  </div>
                  Social Links
                </h3>

                <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const { label, Icon } = PLATFORM_META[platform];
                    return (
                      <div key={platform} className="relative group">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                          <div className="size-8 rounded-md border bg-muted flex items-center justify-center">
                            <Icon className="size-4 text-muted-foreground" />
                          </div>
                        </div>
                        <Input
                          type="text"
                          placeholder={`${label.toLowerCase()}.com/you`}
                          className="w-full pl-14 pr-16 py-3 text-sm h-13"
                          value={socialUrls[platform] ?? ""}
                          onChange={(e) =>
                            setSocialUrls((prev) => ({
                              ...prev,
                              [platform]: e.target.value,
                            }))
                          }
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                            {label}
                          </span>
                        </div>
                      </div>
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
                            <Pen className="size-4 text-muted-foreground" />
                          </div>
                          <Textarea
                            placeholder="I build full stack apps and write about what I learn."
                            className="w-full pl-10 pr-4 py-3 shadow-none h-13"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Write a short line about yourself.
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
