import type { NavigateFunction } from "react-router-dom";

let navigator: NavigateFunction | null = null;

export const setNavigator = (nav: NavigateFunction) => {
  navigator = nav;
};

export const navigate = (path: string, options?: { replace?: boolean }) => {
  if (!navigator) {
    console.warn("Navigator not initialized!");
    return;
  }
  navigator(path, options);
};
