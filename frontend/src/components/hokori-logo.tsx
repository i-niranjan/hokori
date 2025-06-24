import React from "react";
import { GiShintoShrine } from "react-icons/gi";

export default function HokoriLogo({ className = "" }) {
  return (
    <div className={`font-bold  flex gap-3 items-center ${className}`}>
      <GiShintoShrine size={40} className="text-primary" />
      <span className="bg-gradient-to-br from-primary text-3xl to-secondary px-2 py-1 text-white rounded-xl">
        Hokori
      </span>
    </div>
  );
}
