import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconCirclePlus,
  IconEdit,
} from "@tabler/icons-react";
import { getInitials } from "@/helpers/helper";
import ProfileForm from "../form/ProfileForm";
import api from "@/models/auth/refresh";
import { BorderBeam } from "@/components/ui/border-beam";
import type { ProfileData } from "@hokori/types";

function PersonalInfo() {
  const [profileData, setProfileData] = useState<ProfileData>();
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await api.get("/component/profile/getProfile");
        setProfileData(result.data.data || null);
      } catch (error) {
        toast.error("Something went wrong, Please Try Again");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="h-max w-150 rounded-2xl border shadow-xs flex overflow-hidden">
        <div className="flex flex-col gap-3 w-full px-3 py-3">
          <span className="text-xl text-black font-semibold">
            Profile Information
          </span>

          {loading ? (
            <ProfileDataSkeleton />
          ) : profileData ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-accent px-4 py-2 rounded-xl space-y-3">
                  <div className="flex items-center space-x-6 border-b pb-2">
                    <Avatar>
                      <AvatarImage src={profileData.avatarUrl} />
                      <AvatarFallback>
                        {getInitials(profileData.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full">
                      <span className="text-black font-semibold">
                        {profileData.name}
                      </span>
                      <span className="text-sm text-neutral-800">
                        {profileData.title}
                      </span>
                      <span className="text-neutral-600 italic text-sm mt-1">
                        "{profileData.bio}"
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 py-2">
                    <Button
                      disabled={!profileData.instagram}
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        window.open(
                          `https://instagram.com/${profileData.instagram}`,
                          "_blank"
                        )
                      }
                    >
                      <IconBrandInstagram className="size-5" />
                    </Button>
                    <Button
                      disabled={!profileData.github}
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        window.open(
                          `https://github.com/${profileData.github}`,
                          "_blank"
                        )
                      }
                    >
                      <IconBrandGithub className="size-5" />
                    </Button>
                    <Button
                      disabled={!profileData.twitter}
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        window.open(
                          `https://x.com/${profileData.twitter}`,
                          "_blank"
                        )
                      }
                    >
                      <IconBrandX className="size-5" />
                    </Button>
                    <Button
                      disabled={!profileData.linkedin}
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        window.open(
                          `https://linkedin.com/in/${profileData.linkedin}`,
                          "_blank"
                        )
                      }
                    >
                      <IconBrandLinkedin className="size-5" />
                    </Button>

                    <Button onClick={() => setOpenForm(true)}>
                      <IconEdit /> Edit
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <Button
              className="w-max relative"
              variant={"outline"}
              onClick={() => setOpenForm(true)}
            >
              <IconCirclePlus /> Add Profile
              <BorderBeam duration={8} size={50} borderWidth={1} />
            </Button>
          )}
        </div>
      </div>
      {openForm && (
        <ProfileForm
          open={openForm}
          onOpenChange={setOpenForm}
          initialData={profileData}
          onSaved={setProfileData}
        />
      )}
    </>
  );
}

export default PersonalInfo;

const ProfileDataSkeleton = () => (
  <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);
