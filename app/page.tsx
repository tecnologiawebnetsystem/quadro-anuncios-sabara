"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Lock, ChevronRight, Delete, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

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

  const handleConsulta = () => {
    router.push("/consulta")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-4">
      {/* Logo InfoFlow - Preto, Branco e Vermelho */}
      <div className="mb-6">
        <div className="w-28 h-28 rounded-2xl bg-zinc-950 border-2 border-red-600 flex items-center justify-center shadow-xl shadow-red-600/20 relative overflow-hidden">
          {/* Efeito de gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent" />
          <div className="text-center z-10">
            <div className="text-white text-2xl font-black tracking-tight">
              Info<span className="text-red-500">Flow</span>
            </div>
            <div className="w-12 h-0.5 bg-red-500 mx-auto mt-1" />
          </div>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-3xl font-black text-white mb-1">
        Info<span className="text-red-500">Flow</span>
      </h1>
      <p className="text-zinc-500 text-sm tracking-[0.3em] mb-8">CONGREGAÇÃO SABARÀ</p>

      {!mostrarSenha ? (
        // Card com opções
        <Card className="w-full max-w-sm bg-zinc-900/80 border-zinc-800 shadow-2xl">
          <CardContent className="p-0">
            {/* Informações da Congregação */}
            <button
              onClick={handleConsulta}
              className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors border-b border-zinc-800"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold">Informações da Congregação</p>
                <p className="text-zinc-500 text-sm">Consultar designações e grupos</p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600" />
            </button>

            {/* Administrador */}
            <button
              onClick={() => setMostrarSenha(true)}
              className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-zinc-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold">Administrador</p>
                <p className="text-zinc-500 text-sm">Acesso completo ao sistema</p>
              </div>
              <Lock className="w-4 h-4 text-zinc-600 mr-1" />
              <ChevronRight className="w-5 h-5 text-zinc-600" />
            </button>
          </CardContent>
        </Card>
      ) : (
        // Teclado numérico para senha
        <Card className="w-full max-w-sm bg-zinc-900/80 border-zinc-800 shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-zinc-300" />
              </div>
              <p className="text-white font-semibold mb-1">Administrador</p>
              <p className="text-zinc-500 text-sm">Digite a senha de acesso</p>
            </div>
            
            {/* Indicadores de dígitos */}
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    erro 
                      ? "bg-red-500" 
                      : i < senha.length 
                        ? "bg-amber-500" 
                        : "bg-zinc-700"
                  }`}
                />
              ))}
            </div>
            
            {erro && (
              <p className="text-red-500 text-sm text-center mb-4">Senha incorreta</p>
            )}

            {/* Teclado numérico */}
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <Button
                  key={num}
                  onClick={() => handleDigito(num)}
                  variant="outline"
                  className="h-14 text-xl font-bold border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600"
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
                className="h-14 text-xs text-zinc-500 hover:text-white"
              >
                Voltar
              </Button>
              
              <Button
                onClick={() => handleDigito("0")}
                variant="outline"
                className="h-14 text-xl font-bold border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600"
              >
                0
              </Button>
              
              <Button
                onClick={handleApagar}
                variant="ghost"
                className="h-14 text-zinc-500 hover:text-white"
              >
                <Delete className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rodapé com versão */}
      <p className="text-zinc-600 text-xs tracking-[0.2em] mt-8">INFOFLOW v1.0</p>
    </div>
  )
}
