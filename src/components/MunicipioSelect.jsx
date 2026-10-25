import { useEffect } from "react";
import { useIbgeStore } from "../store/useIbgeStore.jsx";

export default function MunicipioSelect({ uf, value, onChange, error }) {
  const municipios = useIbgeStore((state) => state.municipiosDoEstado);
  const loading = useIbgeStore((state) => state.loadingMunicipios);
  const fetchMunicipiosDoEstado = useIbgeStore(
    (state) => state.fetchMunicipiosDoEstado,
  );
  const setSelectedUf = useIbgeStore((state) => state.setSelectedUf);

  useEffect(() => {
    setSelectedUf(uf);

    if (uf) {
      fetchMunicipiosDoEstado(uf);
    }
  }, [uf, fetchMunicipiosDoEstado, setSelectedUf]);

  return (
    <label>
      Cidade
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={!uf || loading}
      >
        <option value="" disabled>
          {loading ? "Carregando municípios..." : "Selecione o município"}
        </option>
        {municipios.map((municipio) => (
          <option key={municipio.id} value={municipio.nome}>
            {municipio.nome}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </label>
  );
}
