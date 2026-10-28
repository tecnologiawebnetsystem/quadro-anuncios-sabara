import { VisitasSupServicoManager } from "@/components/admin/visitas-sup-servico-manager"

export const metadata = {
  title: "Vista do Sup. Serviço",
  description: "Cadastro de visitas do supervisor de serviço aos grupos de campo.",
}

export default function VisitasSupServicoPage() {
  return <VisitasSupServicoManager />
}
