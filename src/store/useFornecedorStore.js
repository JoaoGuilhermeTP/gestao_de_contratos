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
}));
