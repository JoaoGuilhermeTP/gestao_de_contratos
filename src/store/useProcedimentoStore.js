import { create } from "zustand";

export const useProcedimentoStore = create((set) => ({
  // This list is shared by every component that uses this store.
  procedimentos: [],
  // Indicates that an API request is currently in progress.
  loading: false,

  // Loads all procedimentos from the backend.
  fetchProcedimentos: async () => {
    // Show the loading state before starting the request.
    set({ loading: true });
    try {
      const res = await fetch("/api/procedimentos");
      const data = await res.json();
      // Save the returned procedimentos so the UI updates automatically.
      set({ procedimentos: data });
    } catch (error) {
      // Keep the error visible in the console for debugging.
      console.error("Erro ao buscar procedimentos: ", error);
    } finally {
      // This runs after both success and failure.
      set({ loading: false });
    }
  },
}));