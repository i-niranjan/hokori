import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { BiLogoPostgresql, BiLogoMongodb } from "react-icons/bi";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandNodejs,
  IconBrandReact,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { Terminal } from "lucide-react";
import { motion, useAnimationFrame } from "motion/react";

function PersonalInfoPreview() {
  const blocks = useSelector((state: RootState) => state.profile.blocks);
  const baseVelocity = -60;

  const ref = useRef<HTMLDivElement>(null);

  useAnimationFrame((t) => {
    if (ref.current) {
      const x = (t / 1000) * baseVelocity;
      ref.current.style.transform = `translateX(${
        x % ref.current.scrollWidth
      }px)`;
    }
  });

  const skills = [
    {
      name: "React.js",
      icon: IconBrandReact,
    },
    {
      name: "Node.js",
      icon: IconBrandNodejs,
    },
    {
      name: "PostgreSQL",
      icon: BiLogoPostgresql,
    },
    {
      name: "MongoDB",
      icon: BiLogoMongodb,
    },
  ];

  const repeatedSkills = [
    ...skills,
    ...skills,
    ...skills,
    ...skills,
    ...skills,
  ];

  // Assuming you want the first block's name
  return (
    <>
      <div className="flex h-full w-full flex-col p-1 items-center gap-2">
        <div className="flex flex-col gap-1 items-center w-full border-b pb-2">
          <div className="h-20 w-20 bg-accent rounded-full border overflow-hidden">
            <img
              src="https://github.com/shadcn.png"
              className="h-full w-full"
            />
          </div>
          <div className="font-semibold">
            {blocks[0]?.data.name || "Niranjan Chaudhari"}
          </div>
          <div>Full Stack Developer</div>
          <div className="flex w-full justify-evenly gap-2 mt-1">
            <a className="bg-secondary p-1 rounded-md" href="">
              <IconBrandInstagram />
            </a>
            <a className="bg-secondary p-1 rounded-md" href="">
              <IconBrandGithub />
            </a>
            <a className="bg-secondary p-1 rounded-md" href="">
              <IconBrandTwitter />
            </a>
            <a className="bg-secondary p-1 rounded-md" href="">
              <IconBrandLinkedin />
            </a>
          </div>
        </div>
        {/* About Section */}

        <div
          className={` rounded-2xl px-3 py-4   shadow-2xl border overflow-hidden w-full`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer"></div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Terminal size={16} />
              <span>hokori...</span>
            </div>
          </div>

          <div className="font-mono text-sm space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-black ">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400">~</span>
                &nbsp; Hello I'm a full stack developer. Surviving on coffee
                these days...
              </span>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="relative whitespace-wrap w-full border overflow-hidden">
          <div className="absolute top-0 left-0 z-10 h-full w-16 bg-gradient-to-r from-red to-transparent pointer-events-none" />
          <motion.div
            ref={ref}
            className="mt-3 flex  items-center justify-center"
          >
            {repeatedSkills.map((item, index) => (
              <div
                key={index}
                className="text-white shadow-xl  flex gap-2 border px-2 py-1 rounded-2xl bg-gradient-to-br bg-purple-800 via-purple-500 to-purple-700 items-center"
              >
                <item.icon /> &nbsp; <div>{item.name}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default PersonalInfoPreview;
