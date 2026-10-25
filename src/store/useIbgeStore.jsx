import { create } from "zustand";

export const useIbgeStore = create((set, get) => ({
  estados: [],
  municipiosDoEstado: [],
  municipiosUf: "",
  selectedUf: "",
  selectedMunicipio: "",
  loadingEstados: false,
  loadingMunicipios: false,
  municipiosRequestId: 0,
  error: null,

  setSelectedUf: (uf) => {
    set({
      selectedUf: uf,
      selectedMunicipio: "",
      municipiosDoEstado: [],
      municipiosUf: "",
      municipiosRequestId: get().municipiosRequestId + 1,
      loadingMunicipios: false,
    });
  },

  setSelectedMunicipio: (municipio) => {
    set({ selectedMunicipio: municipio });
  },

  fetchEstados: async () => {
    if (get().estados.length > 0 || get().loadingEstados) {
      return;
    }

    set({ loadingEstados: true, error: null });

    try {
      const response = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      set({
        estados: data,
        loadingEstados: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.message || "Falha ao buscar estados no IBGE.",
        loadingEstados: false,
      });
    }
  },

  fetchMunicipiosDoEstado: async (uf) => {
    if (!uf) {
      set({ error: "Selecione um estado para buscar os municípios." });
      return;
    }

    const {
      municipiosDoEstado,
      municipiosUf,
      loadingMunicipios,
      municipiosRequestId,
    } = get();
    if (
      (loadingMunicipios && municipiosUf === uf) ||
      (municipiosDoEstado.length > 0 && municipiosUf === uf)
    ) {
      return;
    }

    const requestId = municipiosRequestId + 1;
    set({
      loadingMunicipios: true,
      municipiosUf: uf,
      municipiosRequestId: requestId,
      error: null,
    });

    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${encodeURIComponent(uf)}/municipios`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (get().municipiosRequestId !== requestId) {
        return;
      }

      set({
        municipiosDoEstado: data,
        municipiosUf: uf,
        loadingMunicipios: false,
        error: null,
      });
    } catch (error) {
      if (get().municipiosRequestId !== requestId) {
        return;
      }

      set({
        error: error.message || "Falha ao buscar municípios no IBGE.",
        loadingMunicipios: false,
      });
    }
  },
}));
