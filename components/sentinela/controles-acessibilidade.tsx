"use client"

import { useState, useEffect } from "react"
import { 
  Minus, 
  Plus, 
  Maximize2, 
  Minimize2, 
  Star, 
  StarOff,
  Share2,
  CheckCircle2,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ControlesAcessibilidadeProps {
  onFontSizeChange: (size: number) => void
  onPresentationMode: (active: boolean) => void
  onToggleFavorito: () => void
  onShare: () => void
  onExportPdf: () => void
  onMarkComplete: () => void
  isFavorito: boolean
  isComplete: boolean
  fontSize: number
  isPresentationMode: boolean
}

export function ControlesAcessibilidade({
  onFontSizeChange,
  onPresentationMode,
  onToggleFavorito,
  onShare,
  onExportPdf,
  onMarkComplete,
  isFavorito,
  isComplete,
  fontSize,
  isPresentationMode
}: ControlesAcessibilidadeProps) {
  const minFontSize = 14
  const maxFontSize = 24

  const decreaseFontSize = () => {
    if (fontSize > minFontSize) {
      onFontSizeChange(fontSize - 2)
    }
  }

  const increaseFontSize = () => {
    if (fontSize < maxFontSize) {
      onFontSizeChange(fontSize + 2)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
        {/* Controle de fonte */}
        <div className="flex items-center bg-zinc-800 rounded-lg p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={decreaseFontSize}
                disabled={fontSize <= minFontSize}
                className="h-8 w-8 p-0 text-zinc-300 hover:text-white hover:bg-zinc-700"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Diminuir fonte</TooltipContent>
          </Tooltip>
          
          <span className="text-xs text-zinc-400 px-2 min-w-[40px] text-center">
            {fontSize}px
          </span>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={increaseFontSize}
                disabled={fontSize >= maxFontSize}
                className="h-8 w-8 p-0 text-zinc-300 hover:text-white hover:bg-zinc-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Aumentar fonte</TooltipContent>
          </Tooltip>
        </div>

        {/* Modo apresentação */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPresentationMode(!isPresentationMode)}
              className={`h-8 w-8 p-0 ${
                isPresentationMode 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "text-zinc-300 hover:text-white hover:bg-zinc-700"
              }`}
            >
              {isPresentationMode ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isPresentationMode ? "Sair do modo apresentação" : "Modo apresentação"}
          </TooltipContent>
        </Tooltip>

        {/* Favorito */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorito}
              className={`h-8 w-8 p-0 ${
                isFavorito 
                  ? "text-yellow-400 hover:text-yellow-300 hover:bg-zinc-700" 
                  : "text-zinc-300 hover:text-white hover:bg-zinc-700"
              }`}
            >
              {isFavorito ? (
                <Star className="h-4 w-4 fill-current" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          </TooltipContent>
        </Tooltip>

        {/* Marcar como concluído */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkComplete}
              className={`h-8 w-8 p-0 ${
                isComplete 
                  ? "text-green-400 hover:text-green-300 hover:bg-zinc-700" 
                  : "text-zinc-300 hover:text-white hover:bg-zinc-700"
              }`}
            >
              <CheckCircle2 className={`h-4 w-4 ${isComplete ? "fill-green-400/20" : ""}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isComplete ? "Marcar como não lido" : "Marcar como lido"}
          </TooltipContent>
        </Tooltip>

        {/* Compartilhar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="h-8 w-8 p-0 text-zinc-300 hover:text-white hover:bg-zinc-700"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Compartilhar</TooltipContent>
        </Tooltip>

        {/* Exportar PDF */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportPdf}
              className="h-8 w-8 p-0 text-zinc-300 hover:text-white hover:bg-zinc-700"
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Exportar PDF</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
