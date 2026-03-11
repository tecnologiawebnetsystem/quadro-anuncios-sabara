"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface PublicadorDB {
  id: string
  nome: string
  grupo_id: string | null
  is_lider: boolean
  is_auxiliar: boolean
  ativo: boolean
  anciao: boolean
  servo_ministerial: boolean
  pioneiro_regular: boolean
  pioneiro_auxiliar: boolean
  telefone: string | null
  email: string | null
  endereco: string | null
  data_nascimento: string | null
  data_batismo: string | null
  observacoes: string | null
  criado_em: string
  atualizado_em: string
}

export interface GrupoDB {
  id: string
  numero: number
  nome: string
  local: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export function usePublicadoresSupabase() {
  const [publicadores, setPublicadores] = useState<PublicadorDB[]>([])
  const [grupos, setGrupos] = useState<GrupoDB[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true)
        const supabase = createClient()

        // Carregar publicadores
        const { data: pubData, error: pubError } = await supabase
          .from("publicadores")
          .select("*")
          .order("nome")

        if (pubError) throw pubError

        // Carregar grupos
        const { data: gruposData, error: gruposError } = await supabase
          .from("grupos")
          .select("*")
          .order("numero")

        if (gruposError) throw gruposError

        setPublicadores(pubData || [])
        setGrupos(gruposData || [])
        setErro(null)
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setErro("Erro ao carregar dados do banco")
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  // Funções auxiliares
  const getPublicadoresPorGrupo = (grupoId: string) => {
    return publicadores.filter(p => p.grupo_id === grupoId && p.ativo)
  }

  const getDirigente = (grupoId: string) => {
    return publicadores.find(p => p.grupo_id === grupoId && p.is_lider && p.ativo)
  }

  const getAuxiliar = (grupoId: string) => {
    return publicadores.find(p => p.grupo_id === grupoId && p.is_auxiliar && p.ativo)
  }

  const getAnciaos = () => {
    return publicadores.filter(p => p.anciao && p.ativo)
  }

  const getServosMinisteriais = () => {
    return publicadores.filter(p => p.servo_ministerial && p.ativo)
  }

  const getPioneirosRegulares = () => {
    return publicadores.filter(p => p.pioneiro_regular && p.ativo)
  }

  const getPublicadoresAtivos = () => {
    return publicadores.filter(p => p.ativo)
  }

  return {
    publicadores,
    grupos,
    carregando,
    erro,
    getPublicadoresPorGrupo,
    getDirigente,
    getAuxiliar,
    getAnciaos,
    getServosMinisteriais,
    getPioneirosRegulares,
    getPublicadoresAtivos,
  }
}
