"use client"

import { useState, useRef } from "react"
import { Printer, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useReactToPrint } from "react-to-print"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

// Ícone do WhatsApp customizado
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

interface PrintActionButtonsProps {
  printRef: React.RefObject<HTMLDivElement | null>
  documentTitle: string
  colorScheme?: "blue" | "orange" | "emerald"
}

export function PrintActionButtons({ 
  printRef, 
  documentTitle,
  colorScheme = "blue"
}: PrintActionButtonsProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const colorClasses = {
    blue: "border-blue-600/50 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300",
    orange: "border-orange-600/50 text-orange-400 hover:bg-orange-600/10 hover:text-orange-300",
    emerald: "border-emerald-600/50 text-emerald-400 hover:bg-emerald-600/10 hover:text-emerald-300"
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: documentTitle,
  })

  const handleSaveAs = useReactToPrint({
    contentRef: printRef,
    documentTitle: documentTitle,
    print: async (printIframe) => {
      const contentWindow = printIframe.contentWindow
      if (contentWindow) {
        contentWindow.print()
      }
    },
  })

  // Função para aplicar estilos inline com cores RGB no elemento original
  // e retornar uma função para restaurar os estilos originais
  const applyInlineColors = (element: HTMLElement): (() => void) => {
    const originalStyles: { el: HTMLElement; styles: string }[] = []
    const allElements = [element, ...Array.from(element.querySelectorAll('*'))] as HTMLElement[]
    
    allElements.forEach(el => {
      if (!(el instanceof HTMLElement)) return
      
      // Salva o estilo original
      originalStyles.push({ el, styles: el.getAttribute('style') || '' })
      
      const computedStyle = window.getComputedStyle(el)
      
      // Aplica cores computadas (que já estão em RGB pelo navegador)
      const color = computedStyle.color
      const bgColor = computedStyle.backgroundColor
      const borderColor = computedStyle.borderColor
      
      if (color) el.style.setProperty('color', color, 'important')
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
        el.style.setProperty('background-color', bgColor, 'important')
      }
      if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
        el.style.setProperty('border-color', borderColor, 'important')
      }
    })
    
    // Retorna função para restaurar estilos originais
    return () => {
      originalStyles.forEach(({ el, styles }) => {
        if (styles) {
          el.setAttribute('style', styles)
        } else {
          el.removeAttribute('style')
        }
      })
    }
  }

  const handleShareWhatsApp = async () => {
    if (!printRef.current || isGenerating) return

    setIsGenerating(true)
    let restoreStyles: (() => void) | null = null
    
    try {
      console.log('[v0] Iniciando geração de PDF para WhatsApp...')
      const element = printRef.current
      
      // Aplica estilos inline ANTES do html2canvas clonar o elemento
      restoreStyles = applyInlineColors(element)
      
      console.log('[v0] Gerando canvas do elemento...')
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (el) => {
          // Ignora elementos que podem causar problemas
          return el.tagName === 'LINK' && (el as HTMLLinkElement).rel === 'preload'
        }
      })
      
      console.log('[v0] Canvas gerado, dimensões:', canvas.width, 'x', canvas.height)
      const imgData = canvas.toDataURL('image/png')
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      
      // Converte para blob
      const pdfBlob = pdf.output('blob')
      const filename = `${documentTitle.replace(/\s+/g, '_')}.pdf`
      
      console.log('[v0] PDF gerado, tamanho:', pdfBlob.size, 'bytes')
      console.log('[v0] Fazendo upload para o Vercel Blob...')
      
      // Faz upload para o Blob
      const formData = new FormData()
      formData.append('file', pdfBlob, filename)
      formData.append('filename', `impressao/${filename}`)
      
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData
      })
      
      const responseData = await response.json()
      console.log('[v0] Resposta do upload:', response.status, responseData)
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Falha no upload')
      }
      
      const { url } = responseData
      console.log('[v0] Upload concluído, URL:', url)
      
      // Abre o WhatsApp com o link do arquivo
      const texto = `${documentTitle}\n\nBaixar PDF: ${url}`
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(texto)}`
      window.open(whatsappUrl, '_blank')
      
    } catch (error) {
      console.error('[v0] Erro ao gerar PDF:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao gerar o PDF: ${errorMessage}`)
    } finally {
      // Restaura os estilos originais
      if (restoreStyles) {
        restoreStyles()
      }
      setIsGenerating(false)
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => handleSaveAs()} 
              variant="outline"
              size="icon"
              className={`h-9 w-9 transition-colors ${colorClasses[colorScheme]}`}
            >
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-zinc-800 border-zinc-700">
            <p>Salvar como PDF</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => handlePrint()} 
              variant="outline"
              size="icon"
              className={`h-9 w-9 transition-colors ${colorClasses[colorScheme]}`}
            >
              <Printer className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-zinc-800 border-zinc-700">
            <p>Imprimir</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleShareWhatsApp}
              disabled={isGenerating}
              variant="outline"
              size="icon"
              className="h-9 w-9 border-green-600/50 text-green-400 hover:bg-green-600/10 hover:text-green-300 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <WhatsAppIcon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-zinc-800 border-zinc-700">
            <p>{isGenerating ? 'Gerando PDF...' : 'Enviar por WhatsApp'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
