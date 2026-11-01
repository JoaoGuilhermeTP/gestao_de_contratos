import { create } from "zustand";

export const useSecretariaStore = create((set) => ({
  // This list is shared by every component that uses this store.
  secretarias: [],
  // Indicates that an API request is currently in progress.
  loading: false,

  // Loads all secretarias from the backend.
  fetchSecretarias: async () => {
    // Show the loading state before starting the request.
    set({ loading: true });
    try {
      const res = await fetch("/api/secretarias");
      const data = await res.json();
      // Save the returned secretarias so the UI updates automatically.
      set({ secretarias: data });
    } catch (error) {
      // Keep the error visible in the console for debugging.
      console.error("Erro ao buscar secretarias: ", error);
    } finally {
      // This runs after both success and failure.
      set({ loading: false });
    }
  },
}));
