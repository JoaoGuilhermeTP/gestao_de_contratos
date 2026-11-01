import { useState } from "react";
import { Link } from "react-router-dom";
import { useServidorStore } from "../store/useServidorStore.js";
import { useSecretariaStore } from "../store/useSecretariaStore.js";

export default function TabelaServidores() {

  const servidores = useServidorStore((state) => state.servidores);
  const secretarias = useSecretariaStore((state) => state.secretarias);

  const [filtros, setFiltros] = useState({
    secretaria_id: "",
    nome: "",
    registro_funcional: "",
    cargo: "",
    email: "",
    telefone: "",
  });

  const servidoresFiltrados = servidores.filter((servidor) => {
    const matchSecretariaId = !filtros.secretaria_id || Number(servidor.secretaria_id) === Number(filtros.secretaria_id);
    const matchNome = !filtros.nome || servidor.nome.toLowerCase().includes(filtros.nome.toLowerCase());
    const matchRegistroFuncional = !filtros.registro_funcional || servidor.registro_funcional.toLowerCase().includes(filtros.registro_funcional.toLowerCase());
    const matchCargo = !filtros.cargo || servidor.cargo.toLowerCase().includes(filtros.cargo.toLowerCase());
    const matchEmail = !filtros.email || servidor.email.toLowerCase().includes(filtros.email.toLowerCase());
    const matchTelefone = !filtros.telefone || servidor.telefone.toLowerCase().includes(filtros.telefone.toLowerCase());

    // Only keep the contract if ALL active filters match
    return matchSecretariaId && matchNome && matchRegistroFuncional && matchCargo && matchEmail && matchTelefone;
  });


  return (
    <section className="data-section">
      <h2>Servidores cadastrados</h2>
      {servidores.length > 0 ? (
        <>
          <div className="filter-panel">
            <h3>Filtrar servidores</h3>
            <div className="filter-grid supplier-filter-grid">
              <input type="text" placeholder="Nome do servidor" value={filtros.nome} onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })} />
              <input type="text" placeholder="Registro" value={filtros.registro_funcional} onChange={(e) => setFiltros({ ...filtros, registro_funcional: e.target.value })} />
              <input type="text" placeholder="Cargo" value={filtros.cargo} onChange={(e) => setFiltros({ ...filtros, cargo: e.target.value })} />
              <input type="text" placeholder="E-mail" value={filtros.email} onChange={(e) => setFiltros({ ...filtros, email: e.target.value })} />
              <input type="text" placeholder="telefone" value={filtros.telefone} onChange={(e) => setFiltros({ ...filtros, telefone: e.target.value })} />
            </div>
          </div>

          <div className="table-scroll">
            <table className="supplier-table">
              <thead>
              <tr>
                <th>Secretaria</th>
                <th>Nome</th>
                <th>Registro</th>
                <th>Cargo</th>
                <th>E-mail</th>
                <th>Telefone</th>
              </tr>
              </thead>
              <tbody>
              {servidoresFiltrados.map((servidor) => (
                <tr key={servidor.id}>
                  <td className="supplier-text-cell">{secretarias.find((secretaria) => secretaria.id === servidor.secretaria_id).nome_secretaria}</td>
                  <td className="supplier-text-cell">
                    <Link to={`/servidor/${servidor.id}`}>{servidor.nome}</Link>
                  </td>
                  <td className="supplier-text-cell">{servidor.registro_funcional}</td>
                  <td className="supplier-text-cell">{servidor.cargo}</td>
                  <td className="supplier-text-cell">{servidor.email}</td>
                  <td className="supplier-text-cell">{servidor.telefone}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Nenhum servidor cadastrato</p>
      )}
    </section>
  );
}
