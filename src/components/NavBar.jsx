import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/contratos">Contratos</Link>
      <Link to="/fornecedores">Fornecedores</Link>
    </nav>
  );
}