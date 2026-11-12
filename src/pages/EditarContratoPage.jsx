import { useContratoStore } from "../store/useContratoStore.js";
import { useFornecedorStore } from "../store/useFornecedorStore.js";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { formatDateForInput } from "../helper_functions/helper.js";

export default function EditarContratoPage() {
  const navigate = useNavigate();

  // Id from parameter variable
  const { id } = useParams();
  const contratos = useContratoStore((state) => state.contratos);
  const fornecedores = useFornecedorStore((state) => state.fornecedores);
  const contrato = contratos.find((contrato) => contrato.id === Number(id));
  const editarContrato = useContratoStore((state) => state.editarContrato);
  const [edited, setEdited] = useState(contrato);

  const handleSubmit = (event) => {
    event.preventDefault();
    editarContrato(Number(id), edited);
    navigate(`/contratos/${id}`);
  };

  return (
    <>
      <section className="detail-page contract-detail">
        <header className="detail-header">
          <div>
            <p className="eyebrow">Edição de contrato</p>
            <h1>Contrato nº {contrato.numero}</h1>
            <p>Atualize os dados cadastrais e a vigência deste contrato.</p>
          </div>
        </header>

        <form className="detail-form" onSubmit={handleSubmit}>
          <div className="form-section-heading">
            <strong>Identificação do contrato</strong>
            <span>Dados básicos e vínculo com o fornecedor</span>
          </div>
          {/* Ata de Registro de Preços */}
          <label>
            Ata de Registro de Preços
            <input
              type="number"
              value={edited.ata_id}
              onChange={(e) =>
                setEdited({
                  ...edited,
                  ata_id: Number(e.target.value),
                })
              }
            />
          </label>

          {/* Número do Contrato */}
          <label>
            Número do contrato
            <input type="text" value={edited.numero} onChange={(e) => setEdited({ ...edited, numero: e.target.value })} />
          </label>

          {/* Ano do Contrato */}
          <label>
            Ano
            <input type="number" value={edited.ano} onChange={(e) => setEdited({ ...edited, ano: e.target.value })} />
          </label>

          {/* Objeto do Contrato */}
          <label className="field-wide">
            Objeto
            <input type="text" value={edited.objeto} onChange={(e) => setEdited({ ...edited, objeto: e.target.value })} />
          </label>

          {/* Fornecedor */}
          <label>
            Fornecedor
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
                  {fornecedor.razao_social} - {fornecedor.cpf_cnpj}
                </option>
              ))}
            </select>
          </label>

          {/* Proedimento */}
          <label>
            Procedimento
            <input
              type="text"
              value={edited.procedimento_id}
              onChange={(e) =>
                setEdited({
                  ...edited,
                  procedimento_id: e.target.value,
                })
              }
            />
          </label>

          {/* Status */}
          <label>
            Status
            <input
              type="text"
              value={edited.status}
              onChange={(e) =>
                setEdited({
                  ...edited,
                  status: e.target.value,
                })
              }
            />
          </label>

          {/* Valor global */}
          <label>
            Valor Global
            <CurrencyInput
              id="contract-currency-input"
              name="contract-currency-input"
              placeholder="Informe o valor"
              allowNegativeValue={false}
              prefix="R$"
              decimalsLimit={2}
              value={edited.valor_global}
              onValueChange={(value) =>
                setEdited({
                  ...edited,
                  valor_global: value,
                })
              }
            />
          </label>

          {/* Prorrogável */}
          <label>
            Prorrogável
            <input
              type="text"
              value={edited.prorrogavel}
              onChange={(e) =>
                setEdited({
                  ...edited,
                  prorrogavel: e.target.value,
                })
              }
            />
          </label>

          <div className="form-section-heading form-section-heading-spaced">
            <strong>Vigência</strong>
            <span>Informe o período de validade do contrato</span>
          </div>

          <label>
            Data da assinatura
            <input
              type="date"
              value={formatDateForInput(edited.data_de_assinatura)}
              onChange={(e) =>
                setEdited({
                  ...edited,
                  data_de_assinatura: e.target.value,
                })
              }
            />
          </label>

          <label>
            Data de término
            <input
              type="date"
              value={formatDateForInput(edited.data_de_termino)}
              onChange={(e) =>
                setEdited({
                  ...edited,
                  data_de_termino: e.target.value,
                })
              }
            />
          </label>
          
          <div className="detail-form-actions">
            <Link to={`/contratos/${contrato.id}`}>
              <button className="button-secondary">Cancelar</button>
            </Link>
            <button type="submit" className="button-primary">
              Salvar alterações
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
