import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <header>
        <p>🚧 Projeto em desenvolvimento</p>

        <h1>Gerenciador de Contratos</h1>

        <p>
          Uma aplicação web para auxiliar no gerenciamento e acompanhamento de
          contratos administrativos, centralizando informações importantes para
          sua gestão e fiscalização.
        </p>

        <nav>
          <Link to="/contratos">Acessar o sistema</Link>
        </nav>
      </header>

      <section>
        <h2>Sobre o projeto</h2>

        <p>
          Este projeto está sendo desenvolvido como uma aplicação prática para
          aplicar conhecimentos de desenvolvimento web, arquitetura de
          aplicações e gerenciamento de dados em um problema do mundo real.
        </p>

        <p>
          A ideia é evoluir o sistema progressivamente, adicionando novas
          funcionalidades e aprimorando sua usabilidade, organização e qualidade
          técnica.
        </p>
      </section>

      <section>
        <h2>Tecnologias</h2>

        <ul>
          <li>React</li>
          <li>JavaScript</li>
          <li>Vite</li>
          <li>React Router</li>
          <li>Git e GitHub</li>
        </ul>
      </section>

      <section>
        <h2>Principais funcionalidades</h2>

        <ul>
          <li>Cadastro e consulta de contratos</li>
          <li>Gerenciamento de fornecedores</li>
          <li>Relacionamento entre contratos e fornecedores</li>
          <li>Organização das informações para acompanhamento dos contratos</li>
        </ul>

        <p>
          <Link to="/contratos">Explorar contratos →</Link>
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
          reais.
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
