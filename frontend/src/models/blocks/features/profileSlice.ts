import { createSlice } from "@reduxjs/toolkit";
import { set } from "lodash";

const initialState = {
  blocks: [
    {
      id: "abc123",
      type: "PersonalInfo",
      visible: true,
      data: {
        name: "You're Name",
        avatarUrl: "",
        coreField: "",
        socials: {
          github: "",
          twitter: "",
          linkedin: "",
          instagram: "",
        },
      },
    },
  ],
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateBlockField: (state, action) => {
      const { id, fieldPath, value } = action.payload;
      const block = state.blocks.find((b) => b.id === id);
      if (block) {
        set(block, fieldPath, value);
      }
    },
  },
});

export const { updateBlockField } = profileSlice.actions;
export default profileSlice.reducer;
