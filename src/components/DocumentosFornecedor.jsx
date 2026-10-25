import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDocumentoStore } from "../store/useDocumentoStore.js";

export default function DocumentosFornecedor({ fornecedorId }) {
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
        <table>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Emissão</th>
              <th>Validade</th>
              <th>Status</th>
              <th>Arquivo</th>
            </tr>
          </thead>
          <tbody>
            {documentos.map((documento) => (
              <tr key={documento.id}>
                <td>{documento.nome_documento}</td>
                <td>{documento.emissao}</td>
                <td>{documento.validade}</td>
                <td>{documento.status}</td>
                <td>{documento.arquivo_url ? <a href={documento.arquivo_url} target="_blank" rel="noreferrer">Abrir</a> : "Não informado"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum documento vinculado.</p>
      )}
    </section>
  );
}
