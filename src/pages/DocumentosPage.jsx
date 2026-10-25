import { useState } from "react";
import { Link } from "react-router-dom";
import { useDocumentoStore } from "../store/useDocumentoStore.js";

export default function DocumentosPage() {
  const documentos = useDocumentoStore((state) => state.documentos);
  const [filtros, setFiltros] = useState({
    nome: "",
    categoria: "",
    esfera: "",
    cidade: "",
    estado: "",
  });

  const categorias = [...new Set(documentos.map((documento) => documento.categoria).filter(Boolean))].sort();
  const esferas = [...new Set(documentos.map((documento) => documento.esfera).filter(Boolean))].sort();

  const documentosFiltrados = documentos.filter((documento) => {
    const nomeDocumento = documento.nome_documento?.toLowerCase() || "";
    const cidade = documento.cidade?.toLowerCase() || "";
    const estado = documento.estado?.toLowerCase() || "";

    return (
      (!filtros.nome || nomeDocumento.includes(filtros.nome.toLowerCase())) &&
      (!filtros.categoria || documento.categoria === filtros.categoria) &&
      (!filtros.esfera || documento.esfera === filtros.esfera) &&
      (!filtros.cidade || cidade.includes(filtros.cidade.toLowerCase())) &&
      (!filtros.estado || estado === filtros.estado.toLowerCase())
    );
  });

  return (
    <section className="listing-page">
      <header className="listing-header">
        <div>
          <p className="eyebrow">Catálogo documental</p>
          <div className="listing-title-row">
            <h1>Documentos</h1>
            <span className="record-count">{documentosFiltrados.length} registros</span>
          </div>
          <p>Cadastre e consulte documentos exigidos para a gestão contratual.</p>
        </div>
        <Link className="button-primary listing-action" to="/adicionar_documento">
          Adicionar documento
        </Link>
      </header>

      {documentos.length > 0 ? (
        <>
          <div className="filter-panel">
            <h3>Filtrar documentos</h3>
            <div className="filter-grid supplier-filter-grid">
              <input
                type="text"
                placeholder="Nome do documento"
                value={filtros.nome}
                onChange={(event) => setFiltros({ ...filtros, nome: event.target.value })}
              />
              <select
                value={filtros.categoria}
                onChange={(event) => setFiltros({ ...filtros, categoria: event.target.value })}
              >
                <option value="">Todas as categorias</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
              <select
                value={filtros.esfera}
                onChange={(event) => setFiltros({ ...filtros, esfera: event.target.value })}
              >
                <option value="">Todas as esferas</option>
                {esferas.map((esfera) => (
                  <option key={esfera} value={esfera}>{esfera}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Cidade"
                value={filtros.cidade}
                onChange={(event) => setFiltros({ ...filtros, cidade: event.target.value })}
              />
              <input
                type="text"
                maxLength="2"
                placeholder="Estado (UF)"
                value={filtros.estado}
                onChange={(event) => setFiltros({ ...filtros, estado: event.target.value.toUpperCase() })}
              />
            </div>
          </div>

          {documentosFiltrados.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Categoria</th>
                  <th>Esfera</th>
                  <th>Localidade</th>
                  <th>Fonte</th>
                </tr>
              </thead>
              <tbody>
                {documentosFiltrados.map((documento) => (
                  <tr key={documento.id}>
                    <td>{documento.nome_documento}</td>
                    <td>{documento.categoria}</td>
                    <td>{documento.esfera}</td>
                    <td>
                      {[documento.cidade, documento.estado].filter(Boolean).join("/") || "Nacional"}
                    </td>
                    <td>
                      {documento.fonte_website ? (
                        <a href={documento.fonte_website} target="_blank" rel="noreferrer">
                          Acessar fonte
                        </a>
                      ) : (
                        "Não informado"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhum documento corresponde aos filtros selecionados.</p>
          )}
        </>
      ) : (
        <p>Nenhum documento cadastrado.</p>
      )}
    </section>
  );
}