// Bloco de configuração: troque aqui sem mexer no resto.
export const SITE = {
  name: "Silvana Ferri",
  tagline: "Cerimonial e Assessoria",
  whatsapp: "5519994715062",
  defaultMessage: "Olá, Silvana! Vi seu site e gostaria de um orçamento de cerimonial.",
  instagram: "https://www.instagram.com/cerimonialistasilvana.ferri",
  instagramHandle: "@cerimonialistasilvana.ferri",
  address: "Mogi Guaçu e região, SP",
  showFloatingWhatsApp: true,
  url: "https://silvanaferri.com.br", // [CONFIRMAR] domínio final
};

export function waLink(message: string = SITE.defaultMessage) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
