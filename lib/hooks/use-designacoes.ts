"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useSync } from "@/lib/contexts/sync-context"

export interface Designacao {
  id?: string
  reuniao_id: string
  tipo_parte: string
  publicador_id: string
  publicador_nome: string
  ajudante_id?: string | null
  ajudante_nome?: string | null
  created_at?: string
  updated_at?: string
}

export function useDesignacoes(reuniaoId: string) {
  const [designacoes, setDesignacoes] = useState<Designacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Hook de sincronização - pode ser undefined se usado fora do SyncProvider
  let syncTrigger = 0
  try {
    const sync = useSync()
    syncTrigger = sync.syncTrigger
  } catch {
    // Usado fora do SyncProvider, não faz nada
  }

  const supabase = createClient()

  // Buscar designações da reunião
  const fetchDesignacoes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from("designacoes_reuniao")
        .select("*")
        .eq("reuniao_id", reuniaoId)

      if (fetchError) throw fetchError

      setDesignacoes(data || [])
    } catch (err) {
      console.error("Erro ao buscar designações:", err)
      setError("Erro ao carregar designações")
    } finally {
      setLoading(false)
    }
  }, [reuniaoId, supabase])

  // Salvar ou atualizar uma designação
  const salvarDesignacao = useCallback(
    async (tipoParte: string, publicadorId: string, publicadorNome: string, ajudanteId?: string | null, ajudanteNome?: string | null) => {
      try {
        const designacaoExistente = designacoes.find(
          (d) => d.tipo_parte === tipoParte
        )

        if (designacaoExistente) {
          // Atualizar designação existente
          const { error: updateError } = await supabase
            .from("designacoes_reuniao")
            .update({
              publicador_id: publicadorId,
              publicador_nome: publicadorNome,
              ajudante_id: ajudanteId,
              ajudante_nome: ajudanteNome,
            })
            .eq("id", designacaoExistente.id)

          if (updateError) throw updateError
        } else {
          // Criar nova designação
          const { error: insertError } = await supabase
            .from("designacoes_reuniao")
            .insert({
              reuniao_id: reuniaoId,
              tipo_parte: tipoParte,
              publicador_id: publicadorId,
              publicador_nome: publicadorNome,
              ajudante_id: ajudanteId,
              ajudante_nome: ajudanteNome,
            })

          if (insertError) throw insertError
        }

        // Recarregar designações
        await fetchDesignacoes()
        return { success: true }
      } catch (err) {
        console.error("Erro ao salvar designação:", err)
        return { success: false, error: "Erro ao salvar designação" }
      }
    },
    [designacoes, reuniaoId, supabase, fetchDesignacoes]
  )

  // Remover uma designação
  const removerDesignacao = useCallback(
    async (tipoParte: string) => {
      try {
        const { error: deleteError } = await supabase
          .from("designacoes_reuniao")
          .delete()
          .eq("reuniao_id", reuniaoId)
          .eq("tipo_parte", tipoParte)

        if (deleteError) throw deleteError

        await fetchDesignacoes()
        return { success: true }
      } catch (err) {
        console.error("Erro ao remover designação:", err)
        return { success: false, error: "Erro ao remover designação" }
      }
    },
    [reuniaoId, supabase, fetchDesignacoes]
  )

  // Obter designação por tipo de parte
  const getDesignacao = useCallback(
    (tipoParte: string): Designacao | undefined => {
      return designacoes.find((d) => d.tipo_parte === tipoParte)
    },
    [designacoes]
  )

  useEffect(() => {
    fetchDesignacoes()
  }, [fetchDesignacoes, syncTrigger])

  return {
    designacoes,
    loading,
    error,
    salvarDesignacao,
    removerDesignacao,
    getDesignacao,
    refetch: fetchDesignacoes,
  }
}
