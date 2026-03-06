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
      publicadores: [],

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
