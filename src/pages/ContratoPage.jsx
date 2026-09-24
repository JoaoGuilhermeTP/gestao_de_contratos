import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ContratoPage({ contratos, setContratos, fornecedores }) {
  // Id from parameter variable
  const { id } = useParams();

  // Get this contract and it's supplier from props
  const contrato = contratos.find((contrato) => contrato.id === Number(id));
  const fornecedor = fornecedores.find((fornecedor) => fornecedor.id === Number(contrato.fornecedor_id));

  // State variables
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(contrato);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newContratos = contratos.map((contrato) => (contrato.id === Number(id) ? edited : contrato));
    setContratos(newContratos);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <>
        <input type="number" placeholder="Número" value={edited.numero} onChange={(e) => setEdited({ ...edited, numero: e.target.value })} />
        <input type="number" placeholder="Ano" value={edited.ano} onChange={(e) => setEdited({ ...edited, ano: e.target.value })} />
        <input type="text" placeholder="Objeto" value={edited.objeto} onChange={(e) => setEdited({ ...edited, objeto: e.target.value })} />
        <select
          value={edited.fornecedor_id}
          onChange={(e) =>
            setEdited({
              ...edited,
              fornecedor_id: Number(e.target.value),
            })
          }
        >
          <option value="" disabled>
            Selecione um fornecedor
          </option>
          {fornecedores.map((fornecedor) => (
            <option key={fornecedor.id} value={fornecedor.id}>
              {fornecedor.nome} - {fornecedor.cnpj}
            </option>
          ))}
        </select>

        <input type="text" placeholder="procedimento" value={edited.procedimento} onChange={(e) => setEdited({ ...edited, procedimento: e.target.value })} />
        <input type="text" placeholder="tipo" value={edited.tipo} onChange={(e) => setEdited({ ...edited, tipo: e.target.value })} />
        <input
          type="date"
          value={edited.dataDaAssinatura}
          onChange={(e) =>
            setEdited({
              ...edited,
              dataDaAssinatura: e.target.value,
            })
          }
        />
        <input type="date" value={edited.dataDeTermino} onChange={(e) => setEdited({ ...edited, dataDeTermino: e.target.value })} />
        <button onClick={handleSubmit}>Salvar</button>
        <button className="button-danger" onClick={() => setIsEditing(false)}>Cancelar edição</button>
      </>
    );
  } else {
    return (
      <>
        <h1>
          Contrato nº. {contrato.numero}
        </h1>
        <ul>
          <li>Objeto: {contrato.objeto}</li>
          <li>
            <Link to={`/fornecedor/${fornecedor.id}`}>Fornecedor: {fornecedor.razao_social}</Link>
          </li>
          <li>Procedimento: {contrato.procedimento_id}</li>
          <li>Data de Assinatura: {contrato.data_de_assinatura}</li>
          <li>dataDeTermino: {contrato.data_de_termino}</li>
        </ul>
        <button onClick={() => setIsEditing(true)}>Editar contrato</button>
      </>
    );
  }
}
