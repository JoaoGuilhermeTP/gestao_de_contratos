export const mockContratos = [
  {
    id: 1,
    ata_id: null,
    numero: "045/2026",
    ano: 2026,
    objeto: "Contratação de empresa de engenharia para reforma estrutural e adequação de acessibilidade do paço municipal.",
    fornecedor_id: 1, // Construtora Litoral Sul Ltda
    procedimento_id: 101, 
    status: "Ativo",
    valor_global: 1500000.00,
    prorrogavel: true,
    data_de_assinatura: "2026-03-01T10:00:00Z",
    data_de_termino: "2026-11-01T10:00:00Z",
    criado_em: "2026-03-01T10:30:00Z",
    atualizado_em: "2026-03-01T10:30:00Z"
  },
  {
    id: 2,
    ata_id: 12, // Exemplo de contrato derivado de uma Ata de Registro de Preços
    numero: "089/2026",
    ano: 2026,
    objeto: "Aquisição de materiais de expediente (papel A4, canetas, pastas) para suprir as demandas das secretarias.",
    fornecedor_id: 2, // Papelaria Central
    procedimento_id: 102,
    status: "Concluído",
    valor_global: 45000.50,
    prorrogavel: false,
    data_de_assinatura: "2026-01-15T14:00:00Z",
    data_de_termino: "2026-02-15T14:00:00Z",
    criado_em: "2026-01-15T14:15:00Z",
    atualizado_em: "2026-02-16T09:00:00Z"
  },
  {
    id: 3,
    ata_id: null,
    numero: "012/2026",
    ano: 2026,
    objeto: "Prestação de serviços contínuos de manutenção preventiva e corretiva dos servidores de rede e infraestrutura de TI.",
    fornecedor_id: 3, // TechSoluções Informática SA
    procedimento_id: 103,
    status: "Suspenso", // Suspenso devido à suspensão do fornecedor
    valor_global: 240000.00,
    prorrogavel: true,
    data_de_assinatura: "2026-02-10T09:30:00Z",
    data_de_termino: "2027-02-10T09:30:00Z",
    criado_em: "2026-02-10T10:00:00Z",
    atualizado_em: "2026-08-05T16:50:00Z"
  },
  {
    id: 4,
    ata_id: null,
    numero: "105/2026",
    ano: 2026,
    objeto: "Contratação de consultoria especializada para modelagem e otimização de processos de negócio no âmbito da SEAD.",
    fornecedor_id: 4, // Mariana Oliveira de Almeida
    procedimento_id: 104,
    status: "Ativo",
    valor_global: 85000.00,
    prorrogavel: false,
    data_de_assinatura: "2026-05-20T11:00:00Z",
    data_de_termino: "2026-11-20T11:00:00Z",
    criado_em: "2026-05-20T11:30:00Z",
    atualizado_em: "2026-05-20T11:30:00Z"
  }
];