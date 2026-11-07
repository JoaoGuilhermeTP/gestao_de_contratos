export function  formatDate(value) {
  if (!value) return "Não informado";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}


export function formatCurrency(value) {
  if (value === undefined || value === null || value === "")
    return "Não informado";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}