import { create } from "zustand";

export const useFornecedorStore = create((set) => ({
  // 1. Initial State
  fornecedores: [],
  loading: false,

  // 2. Actions
  // Buscar fornecedores
  fetchFornecedores: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/fornecedores");
      const data = await res.json();
      set({ fornecedores: data });
    } catch (error) {
      console.error("Erro ao buscar fornecedores: ", error);
    } finally {
      set({ loading: false });
    }
  },

  // Adicionar fornecedor
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
        const fornecedorCriado = await response.json();
        set((state) => ({
          fornecedores: [...state.fornecedores, fornecedorCriado],
        }));
        return fornecedorCriado;
      }
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Erro ao adicionar fornecedor.");
    } catch (error) {
      console.error("Erro ao adicionar fornecedor: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
