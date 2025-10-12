import { Input } from "@/components/ui/input";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconCamera,
  IconEdit,
  IconGripVertical,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Edit, Save } from "lucide-react";
import ProfileForm from "../form/ProfileForm";
import api from "@/models/auth/refresh";
import { data } from "react-router";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/helpers/helper";

type Input = {
  fullName: string;
  devRole: string;
};

function PersonalInfo() {
  const [state, setState] = useState(false);
  const [loadingProfileData, setLoadingProfileData] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [profileData, setProfileData] = useState<any>();

  useEffect(() => {
    if (state === true) {
      (async () => {
        try {
          const result = await api.get("/component/profile/getProfile");
          console.log(JSON.stringify(result.data.data, null, 2));

          setProfileData(result.data.data);
        } catch (error) {
          toast.error("Something went wrong, Please Try Again");
        } finally {
          setLoadingProfileData(false);
        }
      })();
    }
  }, [state]);

  return (
    <>
      <div className="h-max  w-150 rounded-2xl border  shadow-xs flex overflow-hidden">
        <div className="flex flex-col gap-3  w-full px-3 py-3 ">
          <span className="text-xl text-black font-semibold">
            Profile Information
          </span>
          <div className="flex gap-2 ">
            {!state && (
              <Button
                onClick={() => setState(true)}
                className=""
                variant={"outline"}
              >
                <IconEdit /> View / Edit
              </Button>
            )}
            {state && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setState(false)}
                  className=""
                  variant={"outline"}
                >
                  <IconX /> Cancel
                </Button>
                <Button
                  onClick={() => {
                    setOpenForm(true);
                  }}
                >
                  <Edit /> Edit
                </Button>
              </div>
            )}
          </div>
          <AnimatePresence>
            {state && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="h-max border-t py-3 px-2 space-y-3">
                  {loadingProfileData ? (
                    <ProfileDataSkeleton />
                  ) : (
                    <div className="bg-accent px-4 py-2 rounded-xl">
                      <div className="flex items-center space-x-6 border-b pb-2">
                        <div>
                          <Avatar>
                            <AvatarImage src={profileData?.avatarUrl} />
                            <AvatarFallback>
                              {getInitials(profileData?.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* <div
                          className="w-[50px] h-[50px] rounded-full bg-cover bg-top"
                          style={{
                            backgroundImage: `url(${profileData.avatarUrl})`,
                          }}
                          title={profileData.name}
                        /> */}
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col ">
                            <span className="text-black font-semibold">
                              {profileData.name}
                            </span>
                            <span className="text-sm text-neutral-800">
                              {profileData.title}
                            </span>
                          </div>

                          <span className="text-neutral-600 italic text-sm mt-1">
                            " {profileData.bio} "
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 py-2">
                        <Button
                          disabled={!profileData?.instagram}
                          variant={"outline"}
                          size={"icon"}
                        >
                          <IconBrandInstagram className="size-5" />
                        </Button>

                        <Button
                          disabled={!profileData?.github}
                          variant={"outline"}
                          size={"icon"}
                        >
                          <IconBrandGithub className="size-5" />
                        </Button>

                        <Button
                          disabled={!profileData?.twitter}
                          variant={"outline"}
                          size={"icon"}
                        >
                          <IconBrandX className="size-5" />
                        </Button>
                        <Button
                          disabled={!profileData?.linkedin}
                          variant={"outline"}
                          size={"icon"}
                        >
                          <IconBrandLinkedin className="size-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center px-4 h-full">
          {/* <Switch className="border " /> */}
        </div>
        <div className="flex items-center justify-center h-full text-neutral-500 bg-white/40 px-3 cursor-pointer  ">
          <IconGripVertical className="size-5 text-white" />
        </div>
      </div>
      <ProfileForm open={openForm} onOpenChange={setOpenForm} />
    </>
  );
}

export default PersonalInfo;

const ProfileDataSkeleton = () => {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};
