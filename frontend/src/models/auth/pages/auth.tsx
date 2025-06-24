import { GiShintoShrine } from "react-icons/gi";
import { Outlet, useNavigate } from "react-router";

function Auth() {
  const navigate = useNavigate();
  return (
    <div
      className={`h-screen cursor-pointer flex flex-col  bg-cover bg-center`}
    >
      <div
        onClick={() => navigate("/")}
        className="font-bold p-6 flex gap-3 items-center"
      >
        <GiShintoShrine size={40} className="text-primary" />
        <span className="bg-gradient-to-br from-primary text-3xl to-secondary px-2 py-1 text-white rounded-xl">
          Hokori
        </span>
      </div>

      <div className="flex w-full h-full justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;
