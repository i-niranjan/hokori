import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconCirclePlus, IconEdit } from "@tabler/icons-react";
import { getInitials } from "@/helpers/helper";
import { ProfileGlyph } from "./BlockIcons";
import ProfileForm from "../form/ProfileForm";
import api from "@/models/auth/refresh";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/app/store";
import { setProfileData, setSocialLinks } from "../features/profileSlice";
import { getSocialLinks as fetchSocialLinks } from "@/services/socialService";
import { PLATFORM_META } from "@/models/preview/lib";

function PersonalInfo() {
  const dispatch = useAppDispatch();
  const blockData = useAppSelector((state) => {
    const block = state.profile.blocks.find((b) => b.type === "PersonalInfo");
    return block?.type === "PersonalInfo" ? block.data : null;
  });
  const profileData = blockData?.profile ?? null;
  const socialLinks = blockData?.socialLinks ?? [];
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [profileResult, links] = await Promise.all([
          api.get("/component/profile/getProfile"),
          fetchSocialLinks(),
        ]);
        dispatch(setProfileData(profileResult.data.data || null));
        dispatch(setSocialLinks(links));
      } catch {
        toast.error("Something went wrong, Please Try Again");
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  return (
    <>
      <div className="h-max w-full  rounded-md border bg-card flex overflow-hidden">
        <div className="flex flex-col gap-3 w-full px-4 py-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <ProfileGlyph className="size-5 text-foreground" />
              <span className="font-display text-lg font-semibold text-foreground">
                Profile
              </span>
            </div>
          </div>

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
                <div className="space-y-3">
                  <div className="flex items-center gap-5 pb-2">
                    <Avatar className="size-12">
                      <AvatarImage src={profileData.avatarUrl} />
                      <AvatarFallback>
                        {getInitials(profileData.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full min-w-0">
                      <span className="font-semibold text-foreground">
                        {profileData.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {profileData.title}
                      </span>
                      <span className="text-muted-foreground italic text-sm mt-1 truncate">
                        "{profileData.bio}"
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 py-2">
                    {socialLinks.map((link) => {
                      const { label, Icon } = PLATFORM_META[link.platform];
                      return (
                        <Button
                          key={link.id}
                          variant="outline"
                          size="icon"
                          aria-label={label}
                          onClick={() => window.open(link.url, "_blank")}
                        >
                          <Icon className="size-5" />
                        </Button>
                      );
                    })}

                    <Button onClick={() => setOpenForm(true)}>
                      <IconEdit /> Edit
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <Button
              className="w-max"
              variant="outline"
              onClick={() => setOpenForm(true)}
            >
              <IconCirclePlus /> Add Profile
            </Button>
          )}
        </div>
      </div>
      {openForm && (
        <ProfileForm
          open={openForm}
          onOpenChange={setOpenForm}
          initialData={profileData ?? undefined}
          onSaved={(profile) => dispatch(setProfileData(profile))}
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
      <Skeleton className="h-4 w-62.5" />
      <Skeleton className="h-4 w-50" />
    </div>
  </div>
);
