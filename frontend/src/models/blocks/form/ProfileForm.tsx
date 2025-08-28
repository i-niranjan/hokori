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

interface ProfileFormProps {
  open: boolean;
  onOpenChange(open: boolean): void;
}

const eventAddSchema = z.object({
  profileImageUrl: z.string().optional(),
  fullName: z.string().min(2).max(50),
  role: z.string(),
  instagramUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedInUrl: z.string().url().optional(),
  xUrl: z.string().url().optional(),
});

export default function ProfileForm({ open, onOpenChange }: ProfileFormProps) {
  const [hasProfileImage, setHasProfileImage] = useState(false);

  const form = useForm<z.infer<typeof eventAddSchema>>({
    resolver: zodResolver(eventAddSchema),
    defaultValues: {
      fullName: "",
      role: "",
      instagramUrl: "",
      githubUrl: "",
      linkedInUrl: "",
      xUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof eventAddSchema>) {
    console.log(values);
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
                  <div className="flex justify-center">
                    <div className="relative group">
                      <div
                        className="w-20 h-20 rounded-xl border-2 border-white/30 overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:border-white/50 group-hover:scale-105"
                        onClick={() => setHasProfileImage(!hasProfileImage)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Upload className="text-gray-800 w-5 h-5" />
                        </div>
                        <Camera className="group-hover:opacity-0 text-gray-800/60 w-6 h-6" />
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-xs text-gray-400">
                          Profile Photo
                        </span>
                      </div>
                    </div>
                  </div>

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
