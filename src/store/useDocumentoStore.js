import { create } from "zustand";

export const useDocumentoStore = create((set) => ({
  documentos: [],
  loading: false,

  fetchDocumentos: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/documentos");
      if (!response.ok) {
        throw new Error("Não foi possível buscar os documentos.");
      }

      const data = await response.json();
      set({ documentos: data });
    } catch (error) {
      console.error("Erro ao buscar documentos: ", error);
    } finally {
      set({ loading: false });
    }
  },

  addDocumento: async (novoDocumento) => {
    set({ loading: true });
    try {
      const response = await fetch("/api/documentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoDocumento),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao adicionar documento.");
      }

      const documentoCriado = await response.json();
      set((state) => ({
        documentos: [...state.documentos, documentoCriado],
      }));
      return documentoCriado;
    } catch (error) {
      console.error("Erro ao adicionar documento: ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
