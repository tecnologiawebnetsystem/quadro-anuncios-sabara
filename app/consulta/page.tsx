import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Calendar, 
  Users, 
  BookOpen, 
  ChevronRight,
  BookMarked,
  Gem,
  Wrench,
  Sparkles
} from "lucide-react"

const quickLinks = [
  {
    title: "Vida e Ministério",
    description: "Programação semanal das partes",
    href: "/consulta/reunioes/vida-ministerio",
    icon: Gem,
    color: "from-blue-600/20 to-blue-800/10",
    iconColor: "text-blue-400",
    borderColor: "border-blue-700/30",
  },
  {
    title: "Estudo Sentinela",
    description: "Dirigentes e leitores",
    href: "/consulta/reunioes/sentinela",
    icon: BookMarked,
    color: "from-purple-600/20 to-purple-800/10",
    iconColor: "text-purple-400",
    borderColor: "border-purple-700/30",
  },
  {
    title: "Equipe Técnica",
    description: "Indicadores, microfone e som",
    href: "/consulta/equipe-tecnica",
    icon: Wrench,
    color: "from-orange-600/20 to-orange-800/10",
    iconColor: "text-orange-400",
    borderColor: "border-orange-700/30",
  },
  {
    title: "Limpeza do Salão",
    description: "Escala semanal de limpeza",
    href: "/consulta/limpeza-salao",
    icon: Sparkles,
    color: "from-cyan-600/20 to-cyan-800/10",
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-700/30",
  },
  {
    title: "Grupos de Estudo",
    description: "Membros de cada grupo",
    href: "/consulta/grupos",
    icon: Users,
    color: "from-emerald-600/20 to-emerald-800/10",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-700/30",
  },
  {
    title: "Publicadores",
    description: "Lista completa de publicadores",
    href: "/consulta/publicadores",
    icon: BookOpen,
    color: "from-amber-600/20 to-amber-800/10",
    iconColor: "text-amber-400",
    borderColor: "border-amber-700/30",
  },
]

export default function ConsultaPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Bem-vindo à Consulta
        </h1>
        <p className="text-zinc-400">
          Visualize as informações da congregação de forma rápida e fácil.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className={`bg-gradient-to-br ${link.color} border ${link.borderColor} hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-zinc-900/50 ${link.iconColor}`}>
                    <link.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {link.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Info Card */}
      <Card className="mt-8 bg-zinc-900/30 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-600/10 text-blue-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">
                Modo Somente Leitura
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Esta área permite apenas visualização dos dados cadastrados. 
                Para fazer alterações, acesse a área de Administrador na página inicial.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
