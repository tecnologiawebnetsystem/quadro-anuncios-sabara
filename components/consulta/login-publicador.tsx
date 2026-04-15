"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Loader2, LogIn, User, Lock, Eye, EyeOff, Search } from "lucide-react"
import { buscarPublicadoresParaLogin, loginPublicador } from "@/lib/services/auth-publicador"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"

interface LoginPublicadorProps {
  onLoginSuccess: (publicador: { id: string; nome: string }) => void
}

interface PublicadorOption {
  id: string
  nome: string
  senha_cadastrada: boolean
}

export function LoginPublicador({ onLoginSuccess }: LoginPublicadorProps) {
  const [publicadores, setPublicadores] = useState<PublicadorOption[]>([])
  const [carregando, setCarregando] = useState(true)
  const [publicadorSelecionado, setPublicadorSelecionado] = useState<string>("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [entrando, setEntrando] = useState(false)
  const [erro, setErro] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function carregarPublicadores() {
      try {
        const lista = await buscarPublicadoresParaLogin()
        setPublicadores(lista)
      } catch {
        console.error("Erro ao carregar publicadores")
      } finally {
        setCarregando(false)
      }
    }
    
    carregarPublicadores()
  }, [])

  const publicadorAtual = publicadores.find(p => p.id === publicadorSelecionado)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")

    if (!publicadorSelecionado) {
      setErro("Selecione seu nome na lista.")
      return
    }

    if (!senha) {
      setErro("Digite sua senha.")
      return
    }

    setEntrando(true)
    try {
      const resultado = await loginPublicador(publicadorSelecionado, senha)
      
      if (resultado.sucesso && resultado.publicador) {
        // Salvar no localStorage para manter a sessão
        localStorage.setItem("publicador_logado", JSON.stringify({
          id: resultado.publicador.id,
          nome: resultado.publicador.nome,
          logado_em: new Date().toISOString()
        }))
        onLoginSuccess({ id: resultado.publicador.id, nome: resultado.publicador.nome })
      } else {
        setErro(resultado.mensagem || "Erro ao fazer login.")
      }
    } catch {
      setErro("Erro ao fazer login. Tente novamente.")
    } finally {
      setEntrando(false)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Consulta de Designações</CardTitle>
          <CardDescription>
            Selecione seu nome e digite sua senha para ver suas designações.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <Alert variant="destructive">
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="publicador">Seu Nome</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-10 font-normal"
                  >
                    {publicadorSelecionado
                      ? publicadores.find((p) => p.id === publicadorSelecionado)?.nome
                      : "Selecione ou digite seu nome..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Digite para buscar..." />
                    <CommandList>
                      <CommandEmpty>Nenhum publicador encontrado.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-y-auto">
                        {publicadores.map((publicador) => (
                          <CommandItem
                            key={publicador.id}
                            value={publicador.nome}
                            onSelect={() => {
                              setPublicadorSelecionado(publicador.id)
                              setOpen(false)
                              setErro("")
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                publicadorSelecionado === publicador.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="flex-1">{publicador.nome}</span>
                            {!publicador.senha_cadastrada && (
                              <span className="text-xs text-muted-foreground ml-2">(sem senha)</span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {publicadorAtual && !publicadorAtual.senha_cadastrada && (
              <Alert>
                <AlertDescription className="text-sm">
                  Você ainda não cadastrou sua senha. Solicite o link de cadastro ao ancião ou administrador.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="pr-10"
                  disabled={publicadorAtual && !publicadorAtual.senha_cadastrada}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={entrando || (publicadorAtual && !publicadorAtual.senha_cadastrada)}
            >
              {entrando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground pt-2">
              Não tem senha? Solicite o link de cadastro ao ancião.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
