import { create } from "zustand";

type columnButtonStore = {
  setShowColumnButton: any;
  showColumnButton: boolean;
}

export const useColumnButtonStore = create<columnButtonStore>((set) => ({
  showColumnButton: false,
  setShowColumnButton: (showColumnButton: boolean) => set({ showColumnButton }),
}))
