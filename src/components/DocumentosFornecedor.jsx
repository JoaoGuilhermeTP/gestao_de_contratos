import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDocumentoStore } from "../store/useDocumentoStore.js";

// Verifica se documento está dentro da validade
function getDocumentStatus(validade) {
  const hoje = new Date();
  const dataAtual = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0"),
  ].join("-");

  return validade >= dataAtual ? "Válido" : "Vencido";
}


export default function DocumentosFornecedor({ fornecedorId }) {

  // Obter lista de todos os documentos
  const documentosGerais = useDocumentoStore((state) => state.documentos);

  // Obter documentos do fornecedor
  const fetchDocumentosDoFornecedor = useDocumentoStore(
    (state) => state.fetchDocumentosDoFornecedor,
  );
  const [documentos, setDocumentos] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetchDocumentosDoFornecedor(fornecedorId)
      .then(setDocumentos)
      .catch((requestError) => setError(requestError.message));
  }, [fornecedorId, fetchDocumentosDoFornecedor]);

  return (
    <section className="data-section">
      <div className="detail-card-heading">
        <h2>Documentos vinculados</h2>
        <Link to={`/fornecedor/${fornecedorId}/adicionar-documento`}>
          <button className="button-primary">Adicionar documento</button>
        </Link>
      </div>
      {error && <p className="form-error">{error}</p>}
      {documentos.length > 0 ? (
        <div className="table-scroll">
          <table className="supplier-documents-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Esfera</th>
                <th>Categoria</th>
                <th>Emissão</th>
                <th>Validade</th>
                <th>Status</th>
                <th>Arquivo</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((documento) => (
                <tr key={documento.id}>
                  <td className="document-name-cell">{documento.nome_documento}</td>
                  <td>{documentosGerais[documento.documento_id].esfera}</td>
                  <td>{documentosGerais[documento.documento_id].categoria}</td>
                  <td>{documento.emissao}</td>
                  <td>{documento.validade}</td>
                  <td>
                    {(() => {
                      const status = getDocumentStatus(documento.validade);

                      return (
                        <span className={`status-badge ${status === "Vencido" ? "status-badge-expired" : ""}`}>
                          {status}
                        </span>
                      );
                    })()}
                  </td>
                  <td>{documento.arquivo_url ? <a href={documento.arquivo_url} target="_blank" rel="noreferrer">Abrir</a> : "Não informado"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Nenhum documento vinculado.</p>
      )}
    </section>
  );
}
