import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import HokoriLogo from "./hokori-logo";

import { Button } from "../components/ui/button";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { isTokenExpired } from "@/helpers/helper";
import type { RootState } from "@/app/store";

export default function HomeNavbar() {
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = token && !isTokenExpired(token);
  const navigate = useNavigate();
  return (
    <nav className="w-full h-24 p-3 ">
      <div className="w-full h-full justify-between flex items-center p-2 px-4 bg-accent rounded-md">
        <Link to="/">
          <HokoriLogo />
        </Link>

        {isLoggedIn ? (
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => {
                navigate("/dashboard");
              }}
              className="rounded-none hover:scale-110"
            >
              Launchpad
            </Button>

            <Avatar className="size-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium">Niranjan Chaudhari</p>
              <p className="text-neutral-500 text-xs">
                niranjanchaudhari2004@gmail.com
              </p>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => navigate("/auth/signup")}
            className="rounded-none cursor-pointer"
          >
            Get Started
          </Button>
        )}
      </div>
    </nav>
  );
}
