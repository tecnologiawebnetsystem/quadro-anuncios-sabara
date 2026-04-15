import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"

export interface BackupData {
  metadata: {
    versao: string
    dataGeracao: string
    tabelas: string[]
  }
  dados: Record<string, unknown[]>
}

const TABELAS_BACKUP = [
  'publicadores',
  'grupos',
  'equipe_tecnica',
  'vida_ministerio_semanas',
  'vida_ministerio_designacoes',
  'sentinela_estudos',
  'discursos_publicos',
  'limpeza_salao',
  'servico_campo_semana',
  'assistencia_reunioes',
  'anuncios',
  'configuracoes',
  'ausencias',
  'permissoes',
]

export async function criarBackup(criadoPor?: string): Promise<{ backup: BackupData; url: string } | null> {
  const supabase = createClient()
  const dados: Record<string, unknown[]> = {}
  
  try {
    // Buscar dados de cada tabela
    for (const tabela of TABELAS_BACKUP) {
      const { data, error } = await supabase.from(tabela).select('*')
      if (error) {
        console.warn(`[Backup] Erro ao buscar ${tabela}:`, error.message)
        dados[tabela] = []
      } else {
        dados[tabela] = data || []
      }
    }
    
    const backup: BackupData = {
      metadata: {
        versao: '1.0',
        dataGeracao: new Date().toISOString(),
        tabelas: Object.keys(dados)
      },
      dados
    }
    
    // Criar arquivo JSON
    const jsonContent = JSON.stringify(backup, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const nomeArquivo = `backup_infoflow_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.json`
    
    // Calcular tamanho
    const tamanhoBytes = new Blob([jsonContent]).size
    
    // Registrar backup no banco
    await supabase.from('backups').insert({
      nome: nomeArquivo,
      tipo: 'manual',
      tamanho_bytes: tamanhoBytes,
      tabelas_incluidas: Object.keys(dados),
      criado_por: criadoPor || 'Sistema'
    })
    
    // Criar URL para download
    const url = URL.createObjectURL(blob)
    
    return { backup, url }
  } catch (error) {
    console.error('[Backup] Erro ao criar backup:', error)
    return null
  }
}

export async function restaurarBackup(backup: BackupData, restauradoPor?: string): Promise<{
  sucesso: boolean
  tabelasRestauradas: string[]
  erros: string[]
}> {
  const supabase = createClient()
  const tabelasRestauradas: string[] = []
  const erros: string[] = []
  
  try {
    // Validar estrutura do backup
    if (!backup.metadata || !backup.dados) {
      return { sucesso: false, tabelasRestauradas: [], erros: ['Estrutura de backup inválida'] }
    }
    
    // Ordem de restauração (considerar dependências de chaves estrangeiras)
    const ordemRestauracao = [
      'grupos',
      'publicadores',
      'configuracoes',
      'permissoes',
      'equipe_tecnica',
      'vida_ministerio_semanas',
      'vida_ministerio_designacoes',
      'sentinela_estudos',
      'discursos_publicos',
      'limpeza_salao',
      'servico_campo_semana',
      'assistencia_reunioes',
      'anuncios',
      'ausencias',
    ]
    
    for (const tabela of ordemRestauracao) {
      const dados = backup.dados[tabela]
      if (!dados || dados.length === 0) continue
      
      try {
        // Limpar tabela existente (cuidado!)
        const { error: deleteError } = await supabase
          .from(tabela)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000') // Truque para deletar tudo
        
        if (deleteError) {
          // Tentar deletar de outra forma
          await supabase.from(tabela).delete().gte('created_at', '1900-01-01')
        }
        
        // Inserir dados do backup
        const { error: insertError } = await supabase.from(tabela).insert(dados as Record<string, unknown>[])
        
        if (insertError) {
          erros.push(`${tabela}: ${insertError.message}`)
        } else {
          tabelasRestauradas.push(tabela)
        }
      } catch (err) {
        erros.push(`${tabela}: Erro desconhecido`)
      }
    }
    
    // Registrar restauração no log
    await supabase.from('activity_logs').insert({
      tabela: 'backups',
      acao: 'outro',
      dados_depois: { 
        tipo: 'restauracao',
        tabelas: tabelasRestauradas,
        erros,
        backup_data: backup.metadata.dataGeracao
      },
      usuario_nome: restauradoPor || 'Sistema',
      perfil: 'admin'
    })
    
    return {
      sucesso: erros.length === 0,
      tabelasRestauradas,
      erros
    }
  } catch (error) {
    console.error('[Backup] Erro ao restaurar backup:', error)
    return { 
      sucesso: false, 
      tabelasRestauradas, 
      erros: [...erros, 'Erro geral na restauração'] 
    }
  }
}

export async function listarBackups(): Promise<{
  id: string
  nome: string
  tipo: string
  tamanho_bytes: number
  tabelas_incluidas: string[]
  criado_por: string
  created_at: string
}[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('backups')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
  
  if (error) {
    console.error('[Backup] Erro ao listar backups:', error)
    return []
  }
  
  return data || []
}

export function validarBackup(arquivo: File): Promise<BackupData | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const conteudo = e.target?.result as string
        const backup = JSON.parse(conteudo) as BackupData
        
        // Validar estrutura básica
        if (!backup.metadata || !backup.dados) {
          resolve(null)
          return
        }
        
        if (!backup.metadata.versao || !backup.metadata.dataGeracao) {
          resolve(null)
          return
        }
        
        resolve(backup)
      } catch {
        resolve(null)
      }
    }
    
    reader.onerror = () => resolve(null)
    reader.readAsText(arquivo)
  })
}

export function formatarTamanho(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
