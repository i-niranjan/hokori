import { GiShintoShrine } from "react-icons/gi";
import { Outlet, useNavigate } from "react-router";
import { signup, login } from "../features/authSlice";
import type { Login, UserSchema } from "../authTypes";
import { useAppDispatch } from "@/app/store";

export type AuthContextType = {
  handleLogin: (data: Login) => void;
  handleSignup: (data: UserSchema) => void;
};

function Auth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (data: Login) => {
    try {
      await dispatch(login(data)).unwrap();
      console.log("running");

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Failed", error);
    }
  };
  const handleSignup = async (data: UserSchema) => {
    try {
      await dispatch(signup(data)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Failed", error);
    }
  };
  return (
    <div className={`h-screen  flex flex-col  bg-cover bg-center`}>
      <div
        onClick={() => navigate("/")}
        className="font-bold cursor-pointer p-6 flex gap-3 items-center"
      >
        <GiShintoShrine size={40} className="text-primary" />
        <span className="bg-gradient-to-br from-primary text-3xl to-secondary px-2 py-1 text-white rounded-xl">
          Hokori
        </span>
      </div>

      <div className="flex w-full h-full justify-center items-center">
        <Outlet context={{ handleLogin, handleSignup }} />
      </div>
    </div>
  );
}

export default Auth;
