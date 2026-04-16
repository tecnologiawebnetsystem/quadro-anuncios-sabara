"use client"

import { useState, useRef } from "react"
import { Download, Upload, HardDrive, AlertTriangle, Check, Loader2, FileJson, Clock, Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { 
  criarBackup, 
  restaurarBackup, 
  validarBackup, 
  formatarTamanho,
  type BackupData 
} from "@/lib/services/backup-service"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

interface BackupManagerProps {
  className?: string
}

export function BackupManager({ className }: BackupManagerProps) {
  const [criando, setCriando] = useState(false)
  const [restaurando, setRestaurando] = useState(false)
  const [backupParaRestaurar, setBackupParaRestaurar] = useState<BackupData | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleCriarBackup = async () => {
    setCriando(true)
    try {
      const resultado = await criarBackup('Administrador')
      
      if (resultado) {
        // Criar link para download
        const a = document.createElement('a')
        a.href = resultado.url
        a.download = `backup_infoflow_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(resultado.url)
        
        toast.success('Backup criado com sucesso!', {
          description: `${Object.keys(resultado.backup.dados).length} tabelas exportadas`
        })
      } else {
        toast.error('Erro ao criar backup', {
          description: 'Tente novamente mais tarde'
        })
      }
    } catch (error) {
      toast.error('Erro ao criar backup')
    } finally {
      setCriando(false)
    }
  }
  
  const handleSelecionarArquivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    
    // Validar arquivo
    const backup = await validarBackup(arquivo)
    
    if (!backup) {
      toast.error('Arquivo inválido', {
        description: 'O arquivo selecionado não é um backup válido do InfoFlow'
      })
      return
    }
    
    setBackupParaRestaurar(backup)
    setDialogAberto(true)
    
    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  const handleRestaurar = async () => {
    if (!backupParaRestaurar) return
    
    setDialogAberto(false)
    setRestaurando(true)
    
    try {
      const resultado = await restaurarBackup(backupParaRestaurar, 'Administrador')
      
      if (resultado.sucesso) {
        toast.success('Backup restaurado com sucesso!', {
          description: `${resultado.tabelasRestauradas.length} tabelas restauradas`
        })
      } else {
        toast.error('Restauração parcial', {
          description: `${resultado.tabelasRestauradas.length} tabelas OK, ${resultado.erros.length} erros`
        })
      }
    } catch (error) {
      toast.error('Erro ao restaurar backup')
    } finally {
      setRestaurando(false)
      setBackupParaRestaurar(null)
    }
  }
  
  return (
    <>
      <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Backup e Restauracao
          </CardTitle>
          <CardDescription>
            Exporte ou importe todos os dados do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Criar Backup */}
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-800/30">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-green-600/20">
                <Download className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">Criar Backup</h4>
                <p className="text-sm text-zinc-400 mt-1">
                  Exporta todas as tabelas para um arquivo JSON
                </p>
                <Button 
                  onClick={handleCriarBackup} 
                  disabled={criando}
                  className="mt-3"
                  size="sm"
                >
                  {criando ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Backup
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Restaurar Backup */}
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-800/30">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-amber-600/20">
                <Upload className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">Restaurar Backup</h4>
                <p className="text-sm text-zinc-400 mt-1">
                  Importa dados de um arquivo de backup anterior
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  <p className="text-xs text-amber-400">
                    Isso substituira todos os dados atuais!
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleSelecionarArquivo}
                  className="hidden"
                  id="backup-file"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={restaurando}
                  variant="outline"
                  className="mt-3 border-amber-600/50 text-amber-400 hover:bg-amber-600/10"
                  size="sm"
                >
                  {restaurando ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Restaurando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Informacoes */}
          <div className="text-xs text-zinc-500 space-y-1">
            <p>O backup inclui: publicadores, grupos, designacoes, escalas e configuracoes.</p>
            <p>Recomendamos fazer backups regulares, especialmente antes de atualizacoes.</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog de confirmacao */}
      <AlertDialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirmar Restauracao
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Voce esta prestes a restaurar um backup. Esta acao ira:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {backupParaRestaurar && (
            <div className="space-y-3 my-4">
              <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  <FileJson className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Detalhes do Backup</span>
                </div>
                <div className="space-y-1 text-xs text-zinc-400">
                  <p className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Criado em: {format(new Date(backupParaRestaurar.metadata.dataGeracao), "dd/MM/yyyy 'as' HH:mm", { locale: ptBR })}
                  </p>
                  <p className="flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    Tabelas: {backupParaRestaurar.metadata.tabelas.length}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-red-400 font-medium">Atencao:</p>
                <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                  <li>Substituir TODOS os dados atuais</li>
                  <li>Esta acao NAO pode ser desfeita</li>
                  <li>Faca um backup atual antes de continuar</li>
                </ul>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRestaurar}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              Sim, Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
