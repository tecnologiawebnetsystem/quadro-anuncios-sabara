"use client"

import { useState, useRef } from "react"
import { Upload, FileSpreadsheet, Check, AlertCircle, Loader2, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { registrarAtividade } from "@/lib/services/activity-logger"

interface PublicadorCSV {
  nome: string
  grupo?: string
  privilegio?: string
  genero?: string
  telefone?: string
  email?: string
  status: "valido" | "erro" | "duplicado"
  erro?: string
}

interface ImportarCSVProps {
  onImportComplete?: () => void
}

// Template CSV para download
const TEMPLATE_CSV = `nome,grupo,privilegio,genero,telefone,email
"Joao Silva","Grupo 1","Publicador","Masculino","11999999999","joao@email.com"
"Maria Santos","Grupo 2","Pioneiro Regular","Feminino","11988888888","maria@email.com"
"Pedro Oliveira","Grupo 1","Anciao","Masculino","11977777777","pedro@email.com"
"Ana Costa","Grupo 3","Servo Ministerial","Feminino","11966666666","ana@email.com"`

export function ImportarCSV({ onImportComplete }: ImportarCSVProps) {
  const [open, setOpen] = useState(false)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [dados, setDados] = useState<PublicadorCSV[]>([])
  const [importando, setImportando] = useState(false)
  const [progresso, setProgresso] = useState(0)
  const [etapa, setEtapa] = useState<"upload" | "preview" | "resultado">("upload")
  const [resultados, setResultados] = useState({ sucesso: 0, erros: 0 })
  const inputRef = useRef<HTMLInputElement>(null)

  const baixarTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "template-publicadores.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const processarCSV = async (file: File) => {
    const texto = await file.text()
    const linhas = texto.split("\n").filter(l => l.trim())
    
    if (linhas.length < 2) {
      return []
    }

    // Pegar cabeçalho
    const cabecalho = linhas[0].split(",").map(c => c.trim().toLowerCase().replace(/"/g, ""))
    
    // Processar linhas
    const publicadores: PublicadorCSV[] = []
    const nomesExistentes = new Set<string>()

    for (let i = 1; i < linhas.length; i++) {
      const valores = linhas[i].match(/(".*?"|[^,]+)/g) || []
      const publicador: PublicadorCSV = {
        nome: "",
        status: "valido"
      }

      cabecalho.forEach((col, index) => {
        let valor = valores[index]?.trim().replace(/"/g, "") || ""
        
        switch (col) {
          case "nome":
            publicador.nome = valor
            break
          case "grupo":
            publicador.grupo = valor
            break
          case "privilegio":
            publicador.privilegio = valor
            break
          case "genero":
            publicador.genero = valor
            break
          case "telefone":
            publicador.telefone = valor
            break
          case "email":
            publicador.email = valor
            break
        }
      })

      // Validações
      if (!publicador.nome) {
        publicador.status = "erro"
        publicador.erro = "Nome obrigatorio"
      } else if (nomesExistentes.has(publicador.nome.toLowerCase())) {
        publicador.status = "duplicado"
        publicador.erro = "Nome duplicado no arquivo"
      } else {
        nomesExistentes.add(publicador.nome.toLowerCase())
      }

      publicadores.push(publicador)
    }

    return publicadores
  }

  const handleArquivoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      alert("Por favor, selecione um arquivo CSV")
      return
    }

    setArquivo(file)
    const dadosProcessados = await processarCSV(file)
    setDados(dadosProcessados)
    setEtapa("preview")
  }

  const importar = async () => {
    setImportando(true)
    setProgresso(0)
    
    const supabase = createClient()
    const dadosValidos = dados.filter(d => d.status === "valido")
    let sucesso = 0
    let erros = 0

    for (let i = 0; i < dadosValidos.length; i++) {
      const publicador = dadosValidos[i]
      
      try {
        const { error } = await supabase
          .from("publicadores")
          .insert({
            nome: publicador.nome,
            grupo: publicador.grupo || null,
            privilegio: publicador.privilegio || "Publicador",
            genero: publicador.genero || null,
            telefone: publicador.telefone || null,
            email: publicador.email || null,
          })

        if (error) {
          erros++
          publicador.status = "erro"
          publicador.erro = error.message
        } else {
          sucesso++
        }
      } catch {
        erros++
        publicador.status = "erro"
        publicador.erro = "Erro ao inserir"
      }

      setProgresso(((i + 1) / dadosValidos.length) * 100)
    }

    // Registrar atividade
    await registrarAtividade({
      tabela: "publicadores",
      acao: "criar",
      dados_depois: { importados: sucesso, erros },
      perfil: "admin",
    })

    setResultados({ sucesso, erros })
    setImportando(false)
    setEtapa("resultado")
    
    if (onImportComplete) {
      onImportComplete()
    }
  }

  const resetar = () => {
    setArquivo(null)
    setDados([])
    setEtapa("upload")
    setProgresso(0)
    setResultados({ sucesso: 0, erros: 0 })
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const validosCount = dados.filter(d => d.status === "valido").length
  const errosCount = dados.filter(d => d.status !== "valido").length

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetar(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Publicadores via CSV</DialogTitle>
          <DialogDescription>
            Importe varios publicadores de uma vez usando um arquivo CSV.
          </DialogDescription>
        </DialogHeader>

        {etapa === "upload" && (
          <div className="space-y-4">
            {/* Área de upload */}
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium">
                Clique para selecionar ou arraste o arquivo CSV
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Formato aceito: .csv
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleArquivoChange}
              />
            </div>

            {/* Download template */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Template CSV</p>
                <p className="text-xs text-muted-foreground">
                  Baixe o modelo para preencher corretamente
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={baixarTemplate} className="gap-2">
                <Download className="h-4 w-4" />
                Baixar
              </Button>
            </div>

            {/* Instruções */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Colunas aceitas:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><strong>nome</strong> - Obrigatorio</li>
                <li><strong>grupo</strong> - Nome do grupo (ex: Grupo 1)</li>
                <li><strong>privilegio</strong> - Publicador, Pioneiro Regular, etc.</li>
                <li><strong>genero</strong> - Masculino ou Feminino</li>
                <li><strong>telefone</strong> - Numero de telefone</li>
                <li><strong>email</strong> - Email do publicador</li>
              </ul>
            </div>
          </div>
        )}

        {etapa === "preview" && (
          <div className="space-y-4">
            {/* Resumo */}
            <div className="flex gap-4">
              <Badge variant="outline" className="gap-1">
                <Check className="h-3 w-3 text-green-500" />
                {validosCount} validos
              </Badge>
              {errosCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errosCount} com erro
                </Badge>
              )}
            </div>

            {/* Tabela de preview */}
            <div className="border rounded-lg max-h-64 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Privilegio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dados.map((pub, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {pub.status === "valido" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <X className="h-4 w-4 text-destructive" />
                            <span className="text-xs text-destructive">{pub.erro}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{pub.nome || "-"}</TableCell>
                      <TableCell>{pub.grupo || "-"}</TableCell>
                      <TableCell>{pub.privilegio || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Botões */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetar}>
                Cancelar
              </Button>
              <Button 
                onClick={importar} 
                disabled={validosCount === 0 || importando}
                className="flex-1 gap-2"
              >
                {importando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Importar {validosCount} publicadores
                  </>
                )}
              </Button>
            </div>

            {importando && (
              <Progress value={progresso} className="h-2" />
            )}
          </div>
        )}

        {etapa === "resultado" && (
          <div className="space-y-4 text-center">
            <div className="py-6">
              {resultados.erros === 0 ? (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-4">
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
              )}
              
              <h3 className="text-lg font-semibold">Importacao Concluida</h3>
              <p className="text-muted-foreground mt-1">
                {resultados.sucesso} publicadores importados com sucesso
                {resultados.erros > 0 && `, ${resultados.erros} com erro`}
              </p>
            </div>

            <Button onClick={() => { setOpen(false); resetar(); }} className="w-full">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
