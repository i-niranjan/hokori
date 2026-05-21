import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

import { motion } from "motion/react";
import PersonalInfo from "@/models/blocks/components/PersonalInfo";
import PreviewWindow from "../components/PreviewWindow";

const MotionButton = motion(Button);
function Dashboard() {
  return (
    <>
      <div className="h-screen w-full   p-2">
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
              <div className="flex relative flex-col gap-3">
                <PersonalInfo />
              </div>
            </div>
          </div>
          <PreviewWindow />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
