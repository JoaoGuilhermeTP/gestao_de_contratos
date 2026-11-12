import { create } from "zustand";

export const useAtaStore = create((set) => ({
  // This list is shared by every component that uses this store.
  atas: [],
  // Indicates that an API request is currently in progress.
  loading: false,

  // Loads all atas from the backend.
  fetchAtas: async () => {
    // Show the loading state before starting the request.
    set({ loading: true });
    try {
      const res = await fetch("/api/atas");
      const data = await res.json();
      // Save the returned secretarias so the UI updates automatically.
      set({ atas: data });
    } catch (error) {
      // Keep the error visible in the console for debugging.
      console.error("Erro ao buscar atas: ", error);
    } finally {
      // This runs after both success and failure.
      set({ loading: false });
    }
  },
}));