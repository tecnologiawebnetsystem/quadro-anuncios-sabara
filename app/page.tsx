"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ShieldCheck, Delete } from "lucide-react"

const SENHA_ADMIN = "123456"

export default function Home() {
  const router = useRouter()
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState(false)

  const handleDigito = (digito: string) => {
    if (senha.length < 6) {
      const novaSenha = senha + digito
      setSenha(novaSenha)
      setErro(false)
      
      // Verifica automaticamente quando tiver 6 dígitos
      if (novaSenha.length === 6) {
        if (novaSenha === SENHA_ADMIN) {
          router.push("/admin")
        } else {
          setErro(true)
          setTimeout(() => {
            setSenha("")
            setErro(false)
          }, 1000)
        }
      }
    }
  }

  const handleApagar = () => {
    setSenha(senha.slice(0, -1))
    setErro(false)
  }

  const handleCongregacao = () => {
    // Por enquanto não faz nada, será definido depois
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900/80 border-zinc-800 shadow-2xl">
        <CardContent className="p-8">
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Quadro de Anúncios</h1>
            <p className="text-zinc-400">Congregação Sabarå</p>
          </div>

          {!mostrarSenha ? (
            // Botões principais
            <div className="space-y-4">
              <Button
                onClick={handleCongregacao}
                className="w-full h-20 text-xl font-semibold bg-blue-600 hover:bg-blue-700 transition-all"
              >
                <Users className="w-8 h-8 mr-3" />
                Congregação
              </Button>
              
              <Button
                onClick={() => setMostrarSenha(true)}
                variant="outline"
                className="w-full h-20 text-xl font-semibold border-zinc-700 hover:bg-zinc-800 transition-all"
              >
                <ShieldCheck className="w-8 h-8 mr-3" />
                Admin
              </Button>
            </div>
          ) : (
            // Teclado numérico para senha
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-zinc-400 mb-4">Digite a senha de acesso</p>
                
                {/* Indicadores de dígitos */}
                <div className="flex justify-center gap-3 mb-6">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full transition-all ${
                        erro 
                          ? "bg-red-500" 
                          : i < senha.length 
                            ? "bg-blue-500" 
                            : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                
                {erro && (
                  <p className="text-red-500 text-sm mb-4">Senha incorreta</p>
                )}
              </div>

              {/* Teclado numérico */}
              <div className="grid grid-cols-3 gap-3">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <Button
                    key={num}
                    onClick={() => handleDigito(num)}
                    variant="outline"
                    className="h-16 text-2xl font-bold border-zinc-700 hover:bg-zinc-800"
                  >
                    {num}
                  </Button>
                ))}
                
                {/* Linha inferior: Voltar, 0, Apagar */}
                <Button
                  onClick={() => {
                    setMostrarSenha(false)
                    setSenha("")
                    setErro(false)
                  }}
                  variant="ghost"
                  className="h-16 text-sm text-zinc-400 hover:text-white"
                >
                  Voltar
                </Button>
                
                <Button
                  onClick={() => handleDigito("0")}
                  variant="outline"
                  className="h-16 text-2xl font-bold border-zinc-700 hover:bg-zinc-800"
                >
                  0
                </Button>
                
                <Button
                  onClick={handleApagar}
                  variant="ghost"
                  className="h-16 text-zinc-400 hover:text-white"
                >
                  <Delete className="w-6 h-6" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
