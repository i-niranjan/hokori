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
import { useState } from "react";
import { Camera, User, Briefcase, Upload } from "lucide-react";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconPin,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
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
import { AddProfile } from "@/services/profileService";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  open: boolean;
  onOpenChange(open: boolean): void;
}

export default function ProfileForm({ open, onOpenChange }: ProfileFormProps) {
  const [hasProfileImage, setHasProfileImage] = useState(false);
  const [preview, setPreview] = useState("");

  const form = useForm<z.infer<typeof eventAddSchema>>({
    resolver: zodResolver(eventAddSchema),
    defaultValues: {
      profileImageUrl: "",
      fullName: "",
      role: "",
      instagramUrl: "",
      githubUrl: "",
      linkedInUrl: "",
      xUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof eventAddSchema>) {
    try {
      const result = await AddProfile(values);
      toast("Profile Added");
    } catch (error) {
      toast("Something went wrong");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent className="sm:max-w-[800px]">
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
                              <Avatar className="w-20 h-20 cursor-pointer">
                                {preview ? (
                                  <AvatarImage src={preview} />
                                ) : (
                                  <AvatarFallback>
                                    <Upload />
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <Input
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setPreview(URL.createObjectURL(file));

                                    field.onChange(e.target.files);
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
              <div className="bg-white/10 backdrop-blur-lg border rounded-2xl p-6 ">
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
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
