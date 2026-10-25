import { useContratoStore } from "../store/useContratoStore.js";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EditarContratoPage() {

	const navigate = useNavigate()

	// Id from parameter variable
	const { id } = useParams();
	const contratos = useContratoStore((state) => state.contratos);
	const fornecedores = useContratoStore((state) => state.fornecedores);
	const contrato = contratos.find((contrato) => contrato.id === Number(id));
	const editarContrato = useContratoStore((state) => state.editarContrato);
	const [edited, setEdited] = useState(contrato);

	const handleSubmit = (event) => {
		event.preventDefault();
		editarContrato(Number(id), edited);
		navigate('/contratos')
	};

	return (
		<>
			<section className="detail-page contract-detail">
				<header className="detail-header">
					<div>
						<p className="eyebrow">Edição de contrato</p>
						<h1>Contrato nº {contrato.numero}</h1>
						<p>
							Atualize os dados cadastrais e a vigência deste
							contrato.
						</p>
					</div>
				</header>

				<form className="detail-form" onSubmit={handleSubmit}>
					<label>
						Número
						<input
							type="text"
							value={edited.numero}
							onChange={(e) =>
								setEdited({ ...edited, numero: e.target.value })
							}
						/>
					</label>
					<label>
						Ano
						<input
							type="number"
							value={edited.ano}
							onChange={(e) =>
								setEdited({ ...edited, ano: e.target.value })
							}
						/>
					</label>
					<label className="field-wide">
						Objeto
						<input
							type="text"
							value={edited.objeto}
							onChange={(e) =>
								setEdited({ ...edited, objeto: e.target.value })
							}
						/>
					</label>
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
								<option
									key={fornecedor.id}
									value={fornecedor.id}
								>
									{fornecedor.razao_social} -{" "}
									{fornecedor.cpf_cnpj}
								</option>
							))}
						</select>
					</label>
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
					<label>
						Tipo
						<input
							type="text"
							value={edited.tipo}
							onChange={(e) =>
								setEdited({ ...edited, tipo: e.target.value })
							}
						/>
					</label>
					<label>
						Data da assinatura
						<input
							type="date"
							value={edited.data_de_assinatura}
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
							value={edited.data_de_termino}
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
							<button className="button-secondary">
								Cancelar
							</button>
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
