"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Calendar, Gem } from "lucide-react"
import { reunioesMarco2026 } from "@/lib/data/vida-ministerio-marco"

export default function VidaMinisterioConsultaPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400">
            <Gem className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Vida e Ministério
            </h1>
            <p className="text-zinc-400 text-sm">
              Programação das reuniões de meio de semana
            </p>
          </div>
        </div>
      </div>

      {/* Months */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-500" />
            Março 2025
          </h2>
          <div className="space-y-3">
            {reunioesMarco2026.map((reuniao) => (
              <Link 
                key={reuniao.id} 
                href={`/consulta/reunioes/vida-ministerio/${reuniao.id}`}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {reuniao.semana}
                          </h3>
                          <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-700">
                            {reuniao.leituraSemanal}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-500">
                          {reuniao.tesouros.partes.length + reuniao.ministerio.partes.length + reuniao.vidaCrista.partes.length} partes programadas
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
