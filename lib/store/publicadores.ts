"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Publicador {
  id: string
  nome: string
  congregacaoId?: string
  grupoServicoId?: string
  anciao: boolean
  servoMinisterial: boolean
  pioneiroRegular: boolean
  pioneiroAuxiliar: boolean
  ativo: boolean
  telefone?: string
  email?: string
  observacoes?: string
  criadoEm: Date
  atualizadoEm: Date
}

// Dados iniciais dos publicadores por grupo de servico
const publicadoresIniciais: Omit<Publicador, "criadoEm" | "atualizadoEm">[] = [
  // GRUPO 1 - ANTÔNIO V. (Dirigente)
  { id: "1", nome: "Antônio V.", grupoServicoId: "1", anciao: true, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "2", nome: "Áquila V.", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "3", nome: "Érica V.", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "4", nome: "Eliana V.", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "5", nome: "Ricardo", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "6", nome: "Natália", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "7", nome: "Allan", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "8", nome: "Marcelo", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "9", nome: "Carolina", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "10", nome: "Edna Melo", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "11", nome: "Edson Oliv.", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "12", nome: "Ide Silva", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "13", nome: "Lucia Helena", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "14", nome: "M. Pedra", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "15", nome: "Renan", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "16", nome: "Scarlett", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "17", nome: "Sérgio", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "18", nome: "Tânia", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  
  // GRUPO 2 - CRISTIAN (Dirigente)
  { id: "19", nome: "Cristian", grupoServicoId: "2", anciao: true, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "20", nome: "Cláudio", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "21", nome: "Rafaela", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "22", nome: "Jocilene", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "23", nome: "Roberto", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "24", nome: "Diego", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "25", nome: "Adeyne", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "26", nome: "Irineu", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "27", nome: "Ângela", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "28", nome: "Igor", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "29", nome: "Kennedy", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "30", nome: "Pâmela", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "31", nome: "Kenny", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "32", nome: "Adilson", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "33", nome: "Graça", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "34", nome: "Vanderlei", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "35", nome: "Vera", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "36", nome: "Thiciane", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "37", nome: "Gisleine", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "38", nome: "Heitor", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "39", nome: "Daniela A.", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  
  // GRUPO 3 - GUIDO (Dirigente)
  { id: "40", nome: "Guido", grupoServicoId: "3", anciao: true, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "41", nome: "Wesley", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "42", nome: "Francisca", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "43", nome: "Lucas", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "44", nome: "Paulo", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "45", nome: "Leyene", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "46", nome: "Adriano", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "47", nome: "Conceição", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "48", nome: "Adriele", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "49", nome: "Nicole", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "50", nome: "Mateus", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "51", nome: "Kauan", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "52", nome: "Enzo", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "53", nome: "Victor", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "54", nome: "Rafael", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "55", nome: "Sisteliany", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "56", nome: "Kaylan", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "57", nome: "Jaqueline", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "58", nome: "M. Sebastiana", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "59", nome: "Elisabete S.", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  
  // GRUPO 4 - MARCOS (Dirigente)
  { id: "60", nome: "Marcos", grupoServicoId: "4", anciao: true, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "61", nome: "Alessandro", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "62", nome: "Adriana", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "63", nome: "Renata", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "64", nome: "Vagner", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "65", nome: "Lucia", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "66", nome: "Caique", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "67", nome: "Caroline", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "68", nome: "Geraldo J.", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "69", nome: "Mércia", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "70", nome: "Matheus", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "71", nome: "Clarice", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "72", nome: "Benedita", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "73", nome: "Joana", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "74", nome: "Vera Lucia", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "75", nome: "Claudinei", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "76", nome: "Edwirges", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "77", nome: "Cidinha", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  
  // GRUPO 5 - REINALDO (Dirigente)
  { id: "78", nome: "Reinaldo", grupoServicoId: "5", anciao: true, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "79", nome: "Junior", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "80", nome: "Heluana", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "81", nome: "Gisseli", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "82", nome: "Guilherme", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "83", nome: "Clayton", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "84", nome: "Dione", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "85", nome: "Ana Lucia", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "86", nome: "Daniella", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "87", nome: "Moacir", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "88", nome: "Maria", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "89", nome: "Lucas R.", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "90", nome: "Isabelle", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "91", nome: "Berenice", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "92", nome: "João Felipe", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "93", nome: "Claudete", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "94", nome: "Sueli", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "95", nome: "Kleber", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "96", nome: "Pâmela R.", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  
  // GRUPO 6 - FLÁVIO (Dirigente)
  { id: "97", nome: "Flávio", grupoServicoId: "6", anciao: true, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "98", nome: "Francion Rod.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "99", nome: "Ana Lucia F.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "100", nome: "Vanessa Rod.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "101", nome: "Heraldo", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "102", nome: "Marciana", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "103", nome: "Tarcisio", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "104", nome: "Teresa", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "105", nome: "Juliana", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "106", nome: "Pedro", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "107", nome: "Marina", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "108", nome: "Willian B.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "109", nome: "Suellen B.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "110", nome: "Elizabete M.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "111", nome: "Maria Ap.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
  { id: "112", nome: "Vanilse", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, pioneiroAuxiliar: false, ativo: true },
]

// Converter para formato completo com datas
const publicadoresComDatas: Publicador[] = publicadoresIniciais.map((p) => ({
  ...p,
  criadoEm: new Date(),
  atualizadoEm: new Date(),
}))

interface PublicadoresState {
  publicadores: Publicador[]
  addPublicador: (publicador: Omit<Publicador, "id" | "criadoEm" | "atualizadoEm">) => void
  updatePublicador: (id: string, data: Partial<Publicador>) => void
  deletePublicador: (id: string) => void
  toggleAtivo: (id: string) => void
  getPublicadores: () => Publicador[]
  getAnciaos: () => Publicador[]
  getServosMinisteriais: () => Publicador[]
  getPioneirosRegulares: () => Publicador[]
  getPioneirosAuxiliares: () => Publicador[]
  getAtivos: () => Publicador[]
}

export const usePublicadoresStore = create<PublicadoresState>()(
  persist(
    (set, get) => ({
      publicadores: publicadoresComDatas,

      addPublicador: (data) => {
        const newPublicador: Publicador = {
          ...data,
          id: crypto.randomUUID(),
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        }
        set((state) => ({
          publicadores: [...state.publicadores, newPublicador],
        }))
      },

      updatePublicador: (id, data) => {
        set((state) => ({
          publicadores: state.publicadores.map((p) =>
            p.id === id ? { ...p, ...data, atualizadoEm: new Date() } : p
          ),
        }))
      },

      deletePublicador: (id) => {
        set((state) => ({
          publicadores: state.publicadores.filter((p) => p.id !== id),
        }))
      },

      toggleAtivo: (id) => {
        set((state) => ({
          publicadores: state.publicadores.map((p) =>
            p.id === id ? { ...p, ativo: !p.ativo, atualizadoEm: new Date() } : p
          ),
        }))
      },

      getPublicadores: () => get().publicadores,
      getAnciaos: () => get().publicadores.filter((p) => p.anciao && p.ativo),
      getServosMinisteriais: () => get().publicadores.filter((p) => p.servoMinisterial && p.ativo),
      getPioneirosRegulares: () => get().publicadores.filter((p) => p.pioneiroRegular && p.ativo),
      getPioneirosAuxiliares: () => get().publicadores.filter((p) => p.pioneiroAuxiliar && p.ativo),
      getAtivos: () => get().publicadores.filter((p) => p.ativo),
    }),
    {
      name: "publicadores-storage",
    }
  )
)
