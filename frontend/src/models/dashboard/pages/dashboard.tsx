import { Button } from "@/components/ui/button";
import {
  IconEdit,
  IconGripVertical,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { Switch } from "@/components/ui/switch";
import PersonalInfoPreview from "@/models/blocks/components/PersonalInfoPreview";
import { useDispatch } from "react-redux";
import { updateBlockField } from "@/models/blocks/features/profileSlice";

const MotionButton = motion(Button);
function Dashboard() {
  const dispatch = useDispatch();
  return (
    <>
      <div className=" w-full   p-2">
        <div className="flex  w-full  p-2 ">
          <div className="md:w-[60%] flex flex-col gap-2  p-2">
            <div className="border-b w-full h-max">
              <h2 className="text-2xl font-semibold ">Think, Build, Create</h2>
            </div>
            <div className="mt-5 gap-4 flex flex-col">
              <div>
                <MotionButton
                  whileTap={{
                    scale: 0.95,
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  Add Component <IconPlus />
                </MotionButton>
              </div>
              <div className="flex flex-col gap-3">
                <div className="h-max w-150 rounded-2xl border bg-gradient-to-tl from-primary via-secondary to-secondary shadow-xs flex overflow-hidden">
                  <div className="flex flex-col gap-3  w-full px-3 py-3 ">
                    <span className="text-xl text-black font-semibold">
                      Profile Information
                    </span>
                    <div className="flex gap-2 ">
                      <Button
                        className="size-8 "
                        variant={"outline"}
                        size={"icon"}
                      >
                        <IconTrash />
                      </Button>
                      <Button
                        className="size-8"
                        variant={"outline"}
                        size={"icon"}
                      >
                        <IconEdit />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-center justify-center px-4 h-full">
                    <Switch className="border " />
                  </div>
                  <div className="flex items-center justify-center h-full text-neutral-500 bg-white/40 px-3 cursor-pointer  ">
                    <IconGripVertical className="size-5 text-white" />
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  dispatch(
                    updateBlockField({
                      id: "abc123",
                      fieldPath: `data.name`, // or data.socials.twitter
                      value: e.target.value,
                    })
                  )
                }
                className="w-100 p-2 rounded-sm border"
                placeholder="name"
              />
            </div>
          </div>
          <div className="md:w-[40%] h-[35rem] px-4 py-2  flex items-center justify-center">
            <div className="h-full w-[20rem] border-black border-3 rounded-4xl flex flex-col items-center p-2">
              <PersonalInfoPreview />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
