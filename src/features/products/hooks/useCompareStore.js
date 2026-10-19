import { create } from "zustand";

const useCompareStore = create((set) => ({
  selectedProductA: undefined,
  selectedProductB: undefined,
  setProductA: (product) => set({ selectedProductA: product }),
  setProductB: (product) => set({ selectedProductB: product }),
}));

export default useCompareStore;
