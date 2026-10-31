import { create } from "zustand";

export const useServidorStore = create((set) => ({
  // This list is shared by every component that uses this store.
  servidores: [],
  // Indicates that an API request is currently in progress.
  loading: false,

  // Loads all servidores from the backend.
  fetchServidores: async () => {
    // Show the loading state before starting the request.
    set({ loading: true });
    try {
      const res = await fetch("/api/servidores");
      const data = await res.json();
      // Save the returned servidores so the UI updates automatically.
      set({ servidores: data });
    } catch (error) {
      // Keep the error visible in the console for debugging.
      console.error("Erro ao buscar servidores: ", error);
    } finally {
      // This runs after both success and failure.
      set({ loading: false });
    }
  },

  // Sends a new servidor to the backend and adds it to the local list.
  addServidor: async (novoServidor) => {
    set({ loading: true });
    try {
      const response = await fetch("/api/servidores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoServidor),
      });

      if (response.ok) {
        // The backend returns the servidor with its generated ID.
        const servidorCriado = await response.json();
        set((state) => ({
          servidores: [...state.servidores, servidorCriado],
        }));
        return servidorCriado;
      }
      // Convert an unsuccessful HTTP response into a useful error message.
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Erro ao adicionar servidor.");
    } catch (error) {
      console.error("Erro ao adicionar servidor: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Sends the edited servidor to the backend and replaces the old version locally.
  editarServidor: async (id, servidorAtualizado) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/servidores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(servidorAtualizado),
      });

      if (response.ok) {
        // Use the saved response because it contains the final backend data.
        const servidorSalvo = await response.json();
        set((state) => ({
          // Keep every other servidor and replace only the edited one.
          servidores: state.servidores.map((servidor) =>
            servidor.id === id ? servidorSalvo : servidor,
          ),
        }));
        return servidorSalvo;
      }

      // Report backend validation or not-found errors to the page.
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Erro ao editar servidor.");
    } catch (error) {
      console.error("Erro ao editar servidor: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Deletes a servidor and removes it from the local list.
  deletarServidor: async (id) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/servidores/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao deletar servidor.");
      }

      set((state) => ({
        servidores: state.servidores.filter((servidor) => servidor.id !== id),
      }));
    } catch (error) {
      console.error("Erro ao deletar servidor: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
