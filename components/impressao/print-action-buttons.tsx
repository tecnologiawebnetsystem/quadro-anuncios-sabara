"use client"

import { useState, useRef } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useReactToPrint } from "react-to-print"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

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

      </div>
    </TooltipProvider>
  )
}
