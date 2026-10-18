import { create } from "zustand";

export const useContractStore = create((set) => ({
    // 1. Initial State
    contratos: [],
    fornecedores: [],
    loading: false,

    // 2. Actions

    // Buscar contratos
    fetchContratos: async () => {
        set({ loading: true });
        try {
            const res = await fetch("/api/contratos");
            const data = await res.json();
            set({ contratos: data });
        } catch (error) {
            console.error("Erro ao buscar contratos: ", error);
        } finally {
            set({ loading: false });
        }
    },

    // Adicionar contrato
    addContrato: async (novoContrato) => {
        set({ loading: true });
        try {
            const isProrrogavel = novoContrato.prorrogavel === "Sim" ? 1 : 0;
            const response = await fetch("/api/contratos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...novoContrato,
                    prorrogavel: isProrrogavel,
                }),
            });

            if (response.ok) {
                const contratoCriado = await response.json();
                set((state) => ({
                    contratos: [...state.contratos, contratoCriado],
                }));
                return novoContrato;
            }
        } catch (error) {
            console.error("Erro ao adicionar contrato: ", error);
        } finally {
            set({ loading: false });
        }
    },

    editarContrato: async (id, contratoAtualizado) => {
        set({ loading: true })
        try {
            // Send PUT request
            const response = await fetch("/api/contratos", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...contratoAtualizado,
                }),
            });
            // Update state
            if (response.ok) {
                set((state) => ({
                    contratos: state.contratos.map((contrato) => {
                        if (contrato.id === id) {
                            return contratoAtualizado;
                        } else {
                            return contrato;
                        }
                    })
                }))
            }
        } catch (error) {
            console.error("Erro ao editar o contrato: ", error)

        } finally {
            set({loading: false});
        }
    },

  // Deletar contrato
  deletarContrato: async (id) => {
        set({ loading: true });
        try {
            // DELETE request
            const response = await fetch("/api/deletar_contrato", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            // Update state
            if (response.ok) {
                set((state) => ({
                    contratos: state.contratos.filter((contrato) => contrato.id !== id)
                }))
            } else {
                console.error("Falha ao deletar o contrato no banco de dados.");
            }
        } catch (error) {
            console.error("Erro ao deletar contrato: ", error)
        } finally {
            set({ loading: false })
        }
    },

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
