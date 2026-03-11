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
  ativo: boolean
  sexo: "M" | "F" // M = Masculino, F = Feminino
  telefone?: string
  email?: string
  observacoes?: string
  criadoEm: Date
  atualizadoEm: Date
}

// Dados iniciais dos publicadores por grupo de servico
const publicadoresIniciais: Omit<Publicador, "criadoEm" | "atualizadoEm">[] = [
  // GRUPO 1 - ANTÔNIO V. (Dirigente)
  { id: "1", nome: "Antônio V.", grupoServicoId: "1", anciao: true, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "2", nome: "Áquila V.", grupoServicoId: "1", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "3", nome: "Érica V.", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "4", nome: "Eliana V.", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "5", nome: "Ricardo", grupoServicoId: "1", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "6", nome: "Natália", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "7", nome: "Allan", grupoServicoId: "1", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "8", nome: "Marcelo", grupoServicoId: "1", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "9", nome: "Carolina", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "10", nome: "Edna Melo", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "11", nome: "Edson Oliv.", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "12", nome: "Ide Silva", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "13", nome: "Lucia Helena", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "14", nome: "M. Pedra", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "15", nome: "Renan", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "16", nome: "Scarlett", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "17", nome: "Sérgio", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "18", nome: "Tânia", grupoServicoId: "1", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  
  // GRUPO 2 - CRISTIAN (Dirigente)
  { id: "19", nome: "Cristian", grupoServicoId: "2", anciao: true, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "20", nome: "Cláudio", grupoServicoId: "2", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "21", nome: "Rafaela", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "22", nome: "Jocilene", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "23", nome: "Roberto", grupoServicoId: "2", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "24", nome: "Diego", grupoServicoId: "2", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "25", nome: "Adeyne", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "26", nome: "Irineu", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "27", nome: "Ângela", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "28", nome: "Igor", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "29", nome: "Kennedy", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "30", nome: "Pâmela", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "31", nome: "Kenny", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "32", nome: "Adilson", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "33", nome: "Graça", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "34", nome: "Vanderlei", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "35", nome: "Vera", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "36", nome: "Thiciane", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "37", nome: "Gisleine", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "38", nome: "Heitor", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "39", nome: "Daniela A.", grupoServicoId: "2", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  
  // GRUPO 3 - GUIDO (Dirigente)
  { id: "40", nome: "Guido", grupoServicoId: "3", anciao: true, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "41", nome: "Wesley", grupoServicoId: "3", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "42", nome: "Francisca", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "43", nome: "Lucas", grupoServicoId: "3", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "44", nome: "Paulo", grupoServicoId: "3", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "45", nome: "Leyene", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "46", nome: "Adriano", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "47", nome: "Conceição", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "48", nome: "Adriele", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "49", nome: "Nicole", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "50", nome: "Mateus", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "51", nome: "Kauan", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "52", nome: "Enzo", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "53", nome: "Victor", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "54", nome: "Rafael", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "55", nome: "Sisteliany", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "56", nome: "Kaylan", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "57", nome: "Jaqueline", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "58", nome: "M. Sebastiana", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "59", nome: "Elisabete S.", grupoServicoId: "3", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  
  // GRUPO 4 - MARCOS (Dirigente)
  { id: "60", nome: "Marcos", grupoServicoId: "4", anciao: true, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "61", nome: "Alessandro", grupoServicoId: "4", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "62", nome: "Adriana", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "63", nome: "Renata", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "64", nome: "Vagner", grupoServicoId: "4", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "65", nome: "Lucia", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "66", nome: "Caique", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "67", nome: "Caroline", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "68", nome: "Geraldo J.", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "69", nome: "Mércia", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "70", nome: "Matheus", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "71", nome: "Clarice", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "72", nome: "Benedita", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "73", nome: "Joana", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "74", nome: "Vera Lucia", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "75", nome: "Claudinei", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "76", nome: "Edwirges", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "77", nome: "Cidinha", grupoServicoId: "4", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  
  // GRUPO 5 - REINALDO (Dirigente)
  { id: "78", nome: "Reinaldo", grupoServicoId: "5", anciao: true, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "79", nome: "Junior", grupoServicoId: "5", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "80", nome: "Heluana", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "81", nome: "Gisseli", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "82", nome: "Guilherme", grupoServicoId: "5", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "83", nome: "Clayton", grupoServicoId: "5", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "84", nome: "Dione", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "85", nome: "Ana Lucia", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "86", nome: "Daniella", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "87", nome: "Moacir", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "88", nome: "Maria", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "89", nome: "Lucas R.", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "90", nome: "Isabelle", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "91", nome: "Berenice", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "92", nome: "João Felipe", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "93", nome: "Claudete", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "94", nome: "Sueli", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "95", nome: "Kleber", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "96", nome: "Pâmela R.", grupoServicoId: "5", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  
  // GRUPO 6 - FLÁVIO (Dirigente)
  { id: "97", nome: "Flávio", grupoServicoId: "6", anciao: true, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "98", nome: "Francion Rod.", grupoServicoId: "6", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "99", nome: "Ana Lucia F.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "100", nome: "Vanessa Rod.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "101", nome: "Heraldo", grupoServicoId: "6", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "102", nome: "Marciana", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "103", nome: "Tarcisio", grupoServicoId: "6", anciao: false, servoMinisterial: true, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "104", nome: "Teresa", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "105", nome: "Juliana", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "106", nome: "Pedro", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "107", nome: "Marina", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "108", nome: "Willian B.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "M" },
  { id: "109", nome: "Suellen B.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "110", nome: "Elizabete M.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "111", nome: "Maria Ap.", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
  { id: "112", nome: "Vanilse", grupoServicoId: "6", anciao: false, servoMinisterial: false, pioneiroRegular: false, ativo: true, sexo: "F" },
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
      getAtivos: () => get().publicadores.filter((p) => p.ativo),
    }),
    {
      name: "publicadores-storage",
    }
  )
)
