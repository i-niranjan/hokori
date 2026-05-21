import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";

import { Outlet } from "react-router";
function MainLayout() {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="pr-5 w-full">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MainLayout;
