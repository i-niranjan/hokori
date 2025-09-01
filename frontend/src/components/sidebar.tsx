import { GiShintoShrine } from "react-icons/gi";
import bgimage from "../assets/marcel-bg.jpg";
import { TbCategory, TbGraph, TbSettings, TbTemplate } from "react-icons/tb";

function Sidebar() {
  const menu = [
    {
      name: "Dashboard",
      icon: TbCategory,
      url: "/dashboard",
    },
    {
      name: "Templates",
      icon: TbTemplate,
      url: "/template",
    },
    {
      name: "Insights",
      icon: TbGraph,
      url: "/insights",
    },
    {
      name: "Settings",
      icon: TbSettings,
      url: "/settings",
    },
  ];
  return (
    <div className="md:w-[20%] p-4 h-screen">
      <div className="h-full w-full rounded-2xl bg-gradient-to-b from-neutral-300 to-neutral-100 flex flex-col justify-between py-6">
        {/* Logo Section */}
        <div className="font-bold px-6 flex gap-3 items-center">
          {" "}
          <GiShintoShrine size={40} className="text-primary" />
          <span className="bg-gradient-to-br from-primary text-3xl to-secondary px-2 py-1 text-white rounded-xl">
            Hokori
          </span>
        </div>
        <div className="flex flex-col gap-5 px-4">
          <p className=" px-2 text-white bg-gradient-to-br from-primary to-secondary w-max rounded-md">
            Menu
          </p>
          <div className="flex flex-col gap-1">
            {menu.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 items-center text-primary px-2  active:text-primary hover:text-primary hover:bg-accent py-2  rounded-xl cursor-pointer"
              >
                {<item.icon size={24} className="" />}
                <a className="text-base font-semibold" href={item.url}>
                  {item.name}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div
          className="h-[10rem] mx-3 backdrop-blur-2xl  rounded-xl bg-cover bg-center flex "
          style={{ backgroundImage: `url(${bgimage})` }}
        >
          <div className="flex flex-col justify-end bg-gradient-to-b from-black/40 to-black/70 backdrop-blur-sm px-4 py-2  h-full w-full rounded-xl text-white text-sm sm:text-base font-medium">
            {/* © Hokori, a project by <br />
            <span className="text-primary font-semibold">
              Niranjan Chaudhari
            </span>
            <Button
              className="bg-transparent border border-white/50"
              size={"sm"}
            >
              <IoIosMail /> Contact Me
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
