import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
function PersonalInfoPreview() {
  const blocks = useSelector((state: RootState) => state.profile.blocks);
  // Assuming you want the first block's name
  return <div>{blocks[0]?.data.name}</div>;
}

export default PersonalInfoPreview;
