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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Upload } from "lucide-react";
import { IconChevronDown, IconLoader2, IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { useForm, type FieldErrors } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
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
import { RephraseButton } from "@/components/ui/rephrase-button";
import { GenerateButton } from "@/components/ui/generate-button";
import { generateBio } from "@/services/aiService";
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

const COUNTRY_CODES = [
  { dial: "+91", country: "India" },
  { dial: "+1", country: "US / Canada" },
  { dial: "+44", country: "UK" },
  { dial: "+971", country: "UAE" },
  { dial: "+61", country: "Australia" },
  { dial: "+49", country: "Germany" },
  { dial: "+33", country: "France" },
  { dial: "+34", country: "Spain" },
  { dial: "+39", country: "Italy" },
  { dial: "+31", country: "Netherlands" },
  { dial: "+81", country: "Japan" },
  { dial: "+82", country: "South Korea" },
  { dial: "+86", country: "China" },
  { dial: "+65", country: "Singapore" },
  { dial: "+60", country: "Malaysia" },
  { dial: "+63", country: "Philippines" },
  { dial: "+62", country: "Indonesia" },
  { dial: "+92", country: "Pakistan" },
  { dial: "+880", country: "Bangladesh" },
  { dial: "+94", country: "Sri Lanka" },
  { dial: "+977", country: "Nepal" },
  { dial: "+966", country: "Saudi Arabia" },
  { dial: "+234", country: "Nigeria" },
  { dial: "+254", country: "Kenya" },
  { dial: "+27", country: "South Africa" },
  { dial: "+55", country: "Brazil" },
  { dial: "+7", country: "Russia" },
];

const FORM_TABS = [
  { value: "profile", label: "Profile" },
  { value: "contact", label: "Contact" },
  { value: "socials", label: "Socials" },
] as const;
type FormTab = (typeof FORM_TABS)[number]["value"];

/** Splits a stored phone ("+91 98765 43210") into dial code + number. */
const splitPhone = (phone: string): { dial: string; number: string } => {
  const sorted = [...COUNTRY_CODES].sort(
    (a, b) => b.dial.length - a.dial.length,
  );
  for (const c of sorted) {
    if (phone.startsWith(c.dial)) {
      return { dial: c.dial, number: phone.slice(c.dial.length).trim() };
    }
  }
  return { dial: "+91", number: phone };
};

const getProfileFormValues = (profile?: ProfileData): EventAddPayload => ({
  profileImageUrl: profile?.avatarUrl || "",
  avatarFileId: profile?.avatarFileId || "",
  fullName: profile?.name || "",
  bio: profile?.bio || "",
  role: profile?.title || "",
  contactEmail: profile?.contactEmail || "",
  phone: profile?.phone || "",
});

const getChangedProfileValues = (
  values: EventAddPayload,
  initialValues: EventAddPayload,
): Partial<EventAddPayload> => {
  return Object.entries(values).reduce<Partial<EventAddPayload>>(
    (changedValues, [key, value]) => {
      const field = key as keyof EventAddPayload;
      if (value !== initialValues[field]) {
        changedValues[field] = value;
      }
      return changedValues;
    },
    {},
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
  const [dialCode, setDialCode] = useState("+91");
  const [tab, setTab] = useState<FormTab>("profile");
  // Content slides in from the side the user came from.
  const slideDir = useRef(1);

  const handleTabChange = (next: string) => {
    const order = FORM_TABS.map((t) => t.value as string);
    slideDir.current = order.indexOf(next) > order.indexOf(tab) ? 1 : -1;
    setTab(next as FormTab);
  };

  useEffect(() => {
    if (!open) return;
    setTab("profile");
    setSocialUrls(
      Object.fromEntries(storeLinks.map((l) => [l.platform, l.url])),
    );
    setDialCode(splitPhone(initialData?.phone || "").dial);
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
          getProfileFormValues(initialData),
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
      const links = SOCIAL_PLATFORMS.filter((p) => socialUrls[p]?.trim()).map(
        (p) => ({ platform: p, url: normalizeUrl(socialUrls[p]!) }),
      );
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
  ) => {
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
      });

      if (!uploadResponse.url || !uploadResponse.fileId) {
        toast.error("Something went wrong while uploading");
        return;
      }

      setPreview({ url: uploadResponse.url, fieldId: uploadResponse.fileId });
      fieldOnChange(uploadResponse.url);
      form.setValue("avatarFileId", uploadResponse.fileId);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while uploading your photo");
    } finally {
      setProfileLoading(false);
    }
  };

  const removeImage = async (fieldOnChange: (val: string) => void) => {
    if (!preview?.fieldId) {
      toast.error(
        "Something went wrong while removing profile image, if you persist this bug please report us",
      );
      return;
    }
    setRemoveLoading(true);
    try {
      const result = await deletImage(preview?.fieldId);
      setPreview(null);
      fieldOnChange("");
      form.setValue("avatarFileId", "");
      if (inputRef.current) inputRef.current.value = "";
      toast.success(result.message);
    } catch {
      toast.error(
        "Something went wrong, if you persist this bug please report us",
      );
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-130">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex min-h-0 flex-col"
          >
            <DialogHeader className="border-b px-6 pb-4 pt-6">
              <DialogTitle className="font-display text-xl">
                {initialData ? "Edit Profile" : "Complete Your Profile"}
              </DialogTitle>
              <DialogDescription>
                This is what visitors see first on your page.
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={tab}
              onValueChange={handleTabChange}
              className="flex h-120 min-h-0 shrink flex-col px-6 py-4"
            >
              <TabsList className="grid w-full shrink-0 grid-cols-3">
                {FORM_TABS.map((t) => (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
                  >
                    {tab === t.value && (
                      <motion.span
                        layoutId="profile-form-tab-pill"
                        className="absolute inset-0 rounded-md border bg-background shadow-xs dark:border-input dark:bg-input/30"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                    <span className="relative z-10">{t.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* ----- PROFILE ----- */}
              <TabsContent value="profile" className="min-h-0 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, x: 16 * slideDir.current }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="flex flex-col gap-5 px-0.5 pb-1 pt-5"
                >
                  <FormField
                    control={form.control}
                    name="profileImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <div className="relative shrink-0">
                              <Label
                                htmlFor="profileImage"
                                className={clsx(
                                  "cursor-pointer",
                                  preview?.url && "cursor-default",
                                )}
                              >
                                <Avatar
                                  key={preview?.url ?? "fallback"}
                                  className="size-16 border"
                                >
                                  {profileLoading ? (
                                    <div className="flex h-full w-full items-center justify-center">
                                      <IconLoader2 className="size-4 animate-spin text-muted-foreground" />
                                    </div>
                                  ) : preview?.url ? (
                                    <AvatarImage src={preview.url} />
                                  ) : (
                                    <AvatarFallback>
                                      <Upload className="size-4" />
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                              </Label>
                              {preview?.fieldId && (
                                <button
                                  type="button"
                                  onClick={() => removeImage(field.onChange)}
                                  aria-label="Remove photo"
                                  className="absolute -right-1 -top-1 rounded-full border bg-background p-0.5 transition-transform hover:scale-110"
                                >
                                  {removeLoading ? (
                                    <IconLoader2 className="size-3.5 animate-spin text-muted-foreground" />
                                  ) : (
                                    <IconX className="size-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-medium">
                                Profile photo
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {preview?.url
                                  ? "Remove the current photo to upload a new one."
                                  : "Click the circle to upload."}
                              </span>
                            </div>
                            <Input
                              ref={inputRef}
                              disabled={!!preview?.url}
                              id="profileImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(file, field.onChange);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full Stack Developer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Bio</FormLabel>
                          <GenerateButton
                            label="Generate"
                            placeholder="A few keywords about you — e.g. full stack dev, 3 yrs, fintech, loves design systems"
                            onGenerate={async (prompt) => {
                              const bio = await generateBio(prompt);
                              if (bio) field.onChange(bio);
                            }}
                          />
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              rows={3}
                              placeholder="I build full stack apps and write about what I learn."
                              className="pr-10"
                              {...field}
                            />
                            <RephraseButton
                              value={field.value}
                              field="bio"
                              onRephrased={field.onChange}
                              className="absolute right-2 top-2"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          A short line about yourself, shown under your name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </TabsContent>

              {/* ----- CONTACT ----- */}
              <TabsContent value="contact" className="min-h-0 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, x: 16 * slideDir.current }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="flex flex-col gap-5 px-0.5 pb-1 pt-5"
                >
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Shown on your page as an "Email me" button.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => {
                      const number = field.value
                        ? splitPhone(field.value).number
                        : "";
                      return (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-24 shrink-0 justify-between font-normal"
                                  >
                                    {dialCode}
                                    <IconChevronDown className="size-4 text-muted-foreground" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="start"
                                  className="max-h-64 overflow-y-auto"
                                >
                                  {COUNTRY_CODES.map((c) => (
                                    <DropdownMenuItem
                                      key={`${c.dial}-${c.country}`}
                                      onSelect={() => {
                                        setDialCode(c.dial);
                                        field.onChange(
                                          number ? `${c.dial} ${number}` : "",
                                        );
                                      }}
                                    >
                                      <span className="w-12 font-medium">
                                        {c.dial}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {c.country}
                                      </span>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Input
                                type="tel"
                                placeholder="98765 43210"
                                value={number}
                                onChange={(e) => {
                                  const next = e.target.value;
                                  field.onChange(
                                    next.trim()
                                      ? `${dialCode} ${next.trim()}`
                                      : "",
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Optional. Tappable on phones via a call link.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </motion.div>
              </TabsContent>

              {/* ----- SOCIALS ----- */}
              <TabsContent value="socials" className="min-h-0 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, x: 16 * slideDir.current }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="flex flex-col gap-3 px-0.5 pb-1 pt-5"
                >
                  <p className="text-xs text-muted-foreground">
                    Paste full links or just the domain, we'll handle the rest.
                    Empty fields stay off your page.
                  </p>
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const { label, Icon } = PLATFORM_META[platform];
                    return (
                      <div key={platform} className="flex items-center gap-3">
                        <div className="flex w-32 shrink-0 items-center gap-2">
                          <Icon className="size-4 text-muted-foreground" />
                          <span className="text-sm">{label}</span>
                        </div>
                        <Input
                          type="text"
                          placeholder={`${label.toLowerCase()}.com/you`}
                          value={socialUrls[platform] ?? ""}
                          onChange={(e) =>
                            setSocialUrls((prev) => ({
                              ...prev,
                              [platform]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    );
                  })}
                </motion.div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="border-t px-6 py-4">
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
