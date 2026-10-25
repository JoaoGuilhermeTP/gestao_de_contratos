import { create } from "zustand";

export const useFornecedorStore = create((set) => ({
  // This list is shared by every component that uses this store.
  fornecedores: [],
  // Indicates that an API request is currently in progress.
  loading: false,

  // Loads all suppliers from the backend.
  fetchFornecedores: async () => {
    // Show the loading state before starting the request.
    set({ loading: true });
    try {
      const res = await fetch("/api/fornecedores");
      const data = await res.json();
      // Save the returned suppliers so the UI updates automatically.
      set({ fornecedores: data });
    } catch (error) {
      // Keep the error visible in the console for debugging.
      console.error("Erro ao buscar fornecedores: ", error);
    } finally {
      // This runs after both success and failure.
      set({ loading: false });
    }
  },

  // Sends a new supplier to the backend and adds it to the local list.
  addFornecedor: async (novoFornecedor) => {
    set({ loading: true });
    try {
      const response = await fetch("/api/fornecedores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoFornecedor),
      });

      if (response.ok) {
        // The backend returns the supplier with its generated ID.
        const fornecedorCriado = await response.json();
        set((state) => ({
          fornecedores: [...state.fornecedores, fornecedorCriado],
        }));
        return fornecedorCriado;
      }
      // Convert an unsuccessful HTTP response into a useful error message.
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Erro ao adicionar fornecedor.");
    } catch (error) {
      console.error("Erro ao adicionar fornecedor: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Sends the edited supplier to the backend and replaces the old version locally.
  editarFornecedor: async (id, fornecedorAtualizado) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/fornecedores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fornecedorAtualizado),
      });

      if (response.ok) {
        // Use the saved response because it contains the final backend data.
        const fornecedorSalvo = await response.json();
        set((state) => ({
          // Keep every other supplier and replace only the edited one.
          fornecedores: state.fornecedores.map((fornecedor) =>
            fornecedor.id === id ? fornecedorSalvo : fornecedor,
          ),
        }));
        return fornecedorSalvo;
      }

      // Report backend validation or not-found errors to the page.
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Erro ao editar fornecedor.");
    } catch (error) {
      console.error("Erro ao editar fornecedor: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
