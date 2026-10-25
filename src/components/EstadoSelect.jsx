import { useIbgeStore } from "../store/useIbgeStore.jsx";

export default function EstadoSelect({ value, onChange, error }) {
  const estados = useIbgeStore((state) => state.estados);

  return (
    <label>
      Estado
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="" disabled>Selecione o estado</option>
        {estados.map((estado) => (
          <option key={estado.id} value={estado.sigla}>
            {estado.nome} ({estado.sigla})
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </label>
  );
}
