"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react"
import { validarToken, cadastrarSenhaPublicador } from "@/lib/services/auth-publicador"

export default function CadastrarSenhaPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [validando, setValidando] = useState(true)
  const [tokenValido, setTokenValido] = useState(false)
  const [publicador, setPublicador] = useState<{ id: string; nome: string } | null>(null)
  
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    async function validar() {
      try {
        const resultado = await validarToken(token)
        setTokenValido(resultado.valido)
        if (resultado.publicador) {
          setPublicador(resultado.publicador)
        }
      } catch {
        setTokenValido(false)
      } finally {
        setValidando(false)
      }
    }
    
    validar()
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")

    if (senha.length < 4) {
      setErro("A senha deve ter pelo menos 4 caracteres.")
      return
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.")
      return
    }

    setSalvando(true)
    try {
      const resultado = await cadastrarSenhaPublicador(token, senha)
      
      if (resultado.sucesso) {
        setSucesso(true)
        // Redirecionar para consulta após 3 segundos
        setTimeout(() => {
          router.push("/consulta")
        }, 3000)
      } else {
        setErro(resultado.mensagem)
      }
    } catch {
      setErro("Erro ao cadastrar senha. Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  // Loading
  if (validando) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Validando link...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Token inválido
  if (!tokenValido) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Link Inválido ou Expirado</CardTitle>
            <CardDescription>
              Este link para cadastro de senha não é válido ou já expirou.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Solicite um novo link ao ancião ou administrador da sua congregação.
            </p>
            <Button variant="outline" onClick={() => router.push("/")}>
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Sucesso
  if (sucesso) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <CardTitle>Senha Cadastrada!</CardTitle>
            <CardDescription>
              Sua senha foi cadastrada com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Agora você pode acessar suas designações na página de consulta usando seu nome e senha.
            </p>
            <p className="text-xs text-muted-foreground">
              Redirecionando em 3 segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Formulário de cadastro
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Cadastrar Senha</CardTitle>
          <CardDescription>
            Olá, <span className="font-semibold text-foreground">{publicador?.nome}</span>! 
            Cadastre sua senha para acessar suas designações.
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
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="pr-10"
                  minLength={4}
                  required
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
              <p className="text-xs text-muted-foreground">Mínimo de 4 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <Input
                id="confirmarSenha"
                type={mostrarSenha ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirme sua senha"
                minLength={4}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={salvando}>
              {salvando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Cadastrar Senha
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
