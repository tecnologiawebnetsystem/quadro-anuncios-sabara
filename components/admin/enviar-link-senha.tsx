"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Link2, Copy, Check, MessageCircle, RotateCcw } from "lucide-react"
import { gerarTokenCadastro, resetarSenhaPublicador } from "@/lib/services/auth-publicador"
import { toast } from "sonner"

interface EnviarLinkSenhaProps {
  publicador: {
    id: string
    nome: string
    senha_cadastrada?: boolean
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnviarLinkSenha({ publicador, open, onOpenChange }: EnviarLinkSenhaProps) {
  const [gerando, setGerando] = useState(false)
  const [linkGerado, setLinkGerado] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [resetando, setResetando] = useState(false)

  async function handleGerarLink() {
    setGerando(true)
    try {
      const resultado = await gerarTokenCadastro(publicador.id)
      
      if (resultado) {
        // Construir URL completa
        const baseUrl = window.location.origin
        const urlCompleta = `${baseUrl}${resultado.url}`
        setLinkGerado(urlCompleta)
      } else {
        toast.error("Erro ao gerar link")
      }
    } catch {
      toast.error("Erro ao gerar link")
    } finally {
      setGerando(false)
    }
  }

  async function handleResetarSenha() {
    setResetando(true)
    try {
      const resultado = await resetarSenhaPublicador(publicador.id)
      
      if (resultado.sucesso) {
        toast.success(resultado.mensagem)
        setLinkGerado(null)
      } else {
        toast.error(resultado.mensagem)
      }
    } catch {
      toast.error("Erro ao resetar senha")
    } finally {
      setResetando(false)
    }
  }

  function handleCopiar() {
    if (linkGerado) {
      navigator.clipboard.writeText(linkGerado)
      setCopiado(true)
      toast.success("Link copiado!")
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  function handleEnviarWhatsApp() {
    if (linkGerado) {
      const mensagem = encodeURIComponent(
        `Olá ${publicador.nome}! 👋\n\n` +
        `Use o link abaixo para cadastrar sua senha e acessar suas designações:\n\n` +
        `${linkGerado}\n\n` +
        `Este link é válido por 48 horas.`
      )
      window.open(`https://wa.me/?text=${mensagem}`, "_blank")
    }
  }

  function handleFechar() {
    setLinkGerado(null)
    setCopiado(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleFechar}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Link de Senha</DialogTitle>
          <DialogDescription>
            Gere um link para <span className="font-semibold">{publicador.nome}</span> cadastrar sua senha de acesso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {publicador.senha_cadastrada && (
            <Alert>
              <AlertDescription className="text-sm">
                Este publicador já possui senha cadastrada. Você pode resetar a senha se necessário.
              </AlertDescription>
            </Alert>
          )}

          {!linkGerado ? (
            <div className="flex flex-col gap-3">
              <Button onClick={handleGerarLink} disabled={gerando} className="w-full">
                {gerando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando link...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Gerar Link de Cadastro
                  </>
                )}
              </Button>

              {publicador.senha_cadastrada && (
                <Button 
                  variant="outline" 
                  onClick={handleResetarSenha} 
                  disabled={resetando}
                  className="w-full"
                >
                  {resetando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetando...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Resetar Senha Atual
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Link Gerado</Label>
                <div className="flex gap-2">
                  <Input 
                    value={linkGerado} 
                    readOnly 
                    className="text-xs"
                  />
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={handleCopiar}
                    className="shrink-0"
                  >
                    {copiado ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Este link é válido por 48 horas.
                </p>
              </div>

              <Button 
                onClick={handleEnviarWhatsApp} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Enviar pelo WhatsApp
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleFechar}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
