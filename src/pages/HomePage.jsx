import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <header>
        <p>🚧 Projeto em desenvolvimento</p>

        <h1>Gerenciador de Contratos</h1>

        <p>
          Uma plataforma para centralizar contratos administrativos, fornecedores,
          documentos e servidores, apoiando as rotinas de gestão, fiscalização e
          acompanhamento contratual.
        </p>

        <nav>
          <Link to="/contratos">Acessar o sistema</Link>
        </nav>
      </header>

      <section>
        <h2>Sobre o projeto</h2>

        <p>
          O sistema organiza informações essenciais da administração pública em
          um único lugar, facilitando a consulta de contratos, o relacionamento
          com fornecedores e o acompanhamento dos responsáveis pela gestão.
        </p>

        <p>
          A aplicação está em desenvolvimento contínuo, com foco em uma
          experiência simples, dados centralizados e funcionalidades alinhadas
          às necessidades da gestão contratual.
        </p>
      </section>

      <section>
        <h2>Tecnologias</h2>

        <ul>
          <li>React</li>
          <li>JavaScript</li>
          <li>Vite</li>
          <li>React Router</li>
          <li>Zustand</li>
          <li>Node.js e Express</li>
          <li>PostgreSQL</li>
        </ul>
      </section>

      <section>
        <h2>Principais funcionalidades</h2>

        <ul>
          <li>Cadastro, consulta, edição e exclusão de contratos</li>
          <li>Cadastro e gerenciamento de fornecedores</li>
          <li>Cadastro e consulta de documentos contratuais</li>
          <li>Cadastro e gerenciamento de servidores públicos</li>
          <li>Organização de servidores por secretaria</li>
          <li>Filtros para localizar informações com mais rapidez</li>
        </ul>

        <p>
          <Link to="/contratos">Explorar contratos →</Link>
          {" · "}
          <Link to="/fornecedores">Ver fornecedores →</Link>
          {" · "}
          <Link to="/documentos">Consultar documentos →</Link>
          {" · "}
          <Link to="/servidores">Ver servidores →</Link>
        </p>
      </section>

      <section>
        <h2>Sobre o desenvolvedor</h2>

        <p>
          Meu nome é João Guilherme. Sou formado em Análise e Desenvolvimento de
          Sistemas e estou construindo minha transição para a área de tecnologia
          por meio de projetos práticos.
        </p>

        <p>
          Tenho interesse principalmente em desenvolvimento web, backend,
          automação de processos e criação de soluções que resolvam problemas
          reais da administração e de outros contextos.
        </p>

        <p>
          Este projeto faz parte do meu portfólio e está em constante evolução.
        </p>

        <p>
          <a
            href="https://github.com/JoaoGuilhermeTP"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          {" | "}
          <a
            href="https://www.linkedin.com/in/joaoguilherme1/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </section>

      <section>
        <h2>Repositório</h2>

        <p>O código-fonte deste projeto está disponível no GitHub:</p>

        <p>
          <a
            href="https://github.com/JoaoGuilhermeTP/gestao_de_contratos"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/JoaoGuilhermeTP/gestao_de_contratos
          </a>
        </p>
      </section>

      <footer>
        <p>Projeto em desenvolvimento por João Guilherme.</p>
      </footer>
    </main>
  );
}

export default Home;
