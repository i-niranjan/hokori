import { useRef } from "react";
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
import { useAnimationFrame } from "motion/react";
import { Marquee } from "@/components/magicui/marquee";
import { useAppSelector } from "@/lib/hooks";

function PersonalInfoPreview() {
  const blocks = useAppSelector((state) => state.profile.blocks);
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

  // Assuming you want the first block's name
  return (
    <>
      <div className=" flex-1 h-full w-full flex-col p-1 items-center gap-2 ">
        <div className="flex flex-col gap-1 items-center w-full pb-2">
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
          className={` rounded-2xl px-3 py-4    border overflow-hidden w-full`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer"></div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Terminal size={16} />
              <span>About Me...</span>
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
        <div className="py-1 flex flex-col w-full overflow-hidden">
          {/* <h3 className="text-sm font-semibold text-right">Skills</h3> */}
          <Marquee className="[--duration:20s] ">
            {skills.map((item, index) => (
              <div
                key={index}
                className="text-black   flex gap-1 border px-2 py-1 rounded-2xl  items-center"
              >
                <item.icon /> &nbsp; <div>{item.name}</div>
              </div>
            ))}
          </Marquee>

          <Marquee reverse className="[--duration:20s] ">
            {skills.map((item, index) => (
              <div
                key={index}
                className="text-black   flex gap-1 border px-2 py-1 rounded-2xl  items-center"
              >
                <item.icon /> &nbsp; <div>{item.name}</div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* USE- https://api.github.com/users/i-niranjan/repos */}
        {/* GithubRepo */}

        <div className="h-max mt-5 w-full flex flex-col gap-2">
          <h2 className="font-semibold text-sm">Recent Projects</h2>
          <div className="flex gap-2">
            <div className="flex flex-col justify-between px-2 py-2 border relative  h-25 w-1/2 rounded-2xl overflow-hidden ">
              <h3>Invoice Generator</h3>
              <span>View More ...</span>
            </div>
            <div className="flex flex-col justify-between px-2 py-2 border relative  h-25 w-1/2 rounded-2xl overflow-hidden ">
              <h3>Invoice Generator</h3>
              <span>View More ...</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PersonalInfoPreview;
