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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Edit, Save } from "lucide-react";
import ProfileForm from "../form/ProfileForm";

type Input = {
  fullName: string;
  devRole: string;
};
function PersonalInfo() {
  const [state, setState] = useState(false);
  const [openForm, setOpenForm] = useState(false);

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
                  <div className="bg-white/70 p-2 rounded-2xl"></div>
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
