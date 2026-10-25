import { create } from "zustand";

export const useIbgeStore = create((set, get) => ({
  // Lists filled with data returned by the IBGE API.
  estados: [],
  municipiosDoEstado: [],
  // UF used to load the current municipality list.
  municipiosUf: "",
  // Values currently selected in the form fields.
  selectedUf: "",
  selectedMunicipio: "",
  // Separate loading flags let the UI know which request is running.
  loadingEstados: false,
  loadingMunicipios: false,
  // Identifies the latest municipality request.
  municipiosRequestId: 0,
  // Stores the last API error so components can display it if needed.
  error: null,

  // Changes the selected state and resets data that depends on it.
  setSelectedUf: (uf) => {
    set({
      selectedUf: uf,
      selectedMunicipio: "",
      municipiosDoEstado: [],
      municipiosUf: "",
      // Invalidate any request that was started for the previous state.
      municipiosRequestId: get().municipiosRequestId + 1,
      loadingMunicipios: false,
    });
  },

  // Saves the municipality selected by the user.
  setSelectedMunicipio: (municipio) => {
    set({ selectedMunicipio: municipio });
  },

  // Loads the list of Brazilian states only once.
  fetchEstados: async () => {
    // Do not make another request if data is already loaded or being fetched.
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
      // Store the states so every component can reuse the same list.
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

  // Loads the municipalities that belong to the selected state.
  fetchMunicipiosDoEstado: async (uf) => {
    // The API cannot search municipalities without a state UF.
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
    // Reuse the current list when it already belongs to this state.
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
      // This request becomes the most recent valid request.
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
      // Ignore a slower response from an older state selection.
      if (get().municipiosRequestId !== requestId) {
        return;
      }

      // Save the municipalities only if this is still the latest request.
      set({
        municipiosDoEstado: data,
        municipiosUf: uf,
        loadingMunicipios: false,
        error: null,
      });
    } catch (error) {
      // An old request must not replace the error from a newer request.
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
