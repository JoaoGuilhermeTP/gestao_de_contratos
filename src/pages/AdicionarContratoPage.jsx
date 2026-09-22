import AddContratoForm from "../components/AddContratoForm";

export default function AdicionarContratoPage({
	contratos,
	setContratos,
	fornecedores,
}) {
	return (
		<AddContratoForm
			contratos={contratos}
			setContratos={setContratos}
			fornecedores={fornecedores}
		/>
	);
}
