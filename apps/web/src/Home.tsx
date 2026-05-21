import { Button } from "./components/ui/button";
import { IconArrowUpRight } from "@tabler/icons-react";
import HomeNavbar from "./components/homeNavbar";
function Home() {
  return (
    <>
      <div className="relative h-screen  p-5">
        <div className="absolute inset-0  bg-gradient-to-bl from-primary to-secondary " />

        {/* Content wrapper to control layering */}
        <div className="relative z-10">
          <HomeNavbar />
          <div className="grid grid-cols-8 p-3">
            <div className="col-span-4 flex flex-col justify-center gap-10 items-start h-[30rem]">
              <h1 className="text-6xl font-bold text-white ">
                Hey devs! Wanna create a cool, awesome Hokori of your own?
              </h1>
              <Button className="rounded-none">
                Get Started Today <IconArrowUpRight />
              </Button>
            </div>
            <div className="col-span-4 h-[30rem] flex items-center">
              COOL MOCKUP IMAGE
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
