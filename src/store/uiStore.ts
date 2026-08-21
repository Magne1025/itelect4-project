import { create } from "zustand";
import { ItemStatus } from "../types/index";

export interface UiState {
  itemsSearchTerm: string;
  itemsStatusFilter: "all" | ItemStatus;
  setItemsSearchTerm: (term: string) => void;
  setItemsStatusFilter: (status: "all" | ItemStatus) => void;
}

export const useUiStore = create<UiState>((set) => ({
  itemsSearchTerm: "",
  itemsStatusFilter: "all",
  setItemsSearchTerm: (term) => set({ itemsSearchTerm: term }),
  setItemsStatusFilter: (status) => set({ itemsStatusFilter: status }),
}));
