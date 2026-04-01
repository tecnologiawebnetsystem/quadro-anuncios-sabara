"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

export function NavigationProgress() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (pathname === prevPathname.current) return
    prevPathname.current = pathname

    // Limpar timers anteriores
    if (timerRef.current) clearTimeout(timerRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)

    // Iniciar barra
    setWidth(0)
    setVisible(true)

    // Avançar rapidamente até ~80% e depois desacelerar
    let current = 0
    intervalRef.current = setInterval(() => {
      current += current < 60 ? 8 : current < 80 ? 3 : 0.5
      if (current >= 90) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        return
      }
      setWidth(current)
    }, 80)

    // Completar quando a rota mudar
    timerRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setWidth(100)
      setTimeout(() => {
        setVisible(false)
        setWidth(0)
      }, 300)
    }, 500)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [pathname])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[3px] bg-primary transition-all duration-200 ease-out shadow-[0_0_8px_0px] shadow-primary/60"
      style={{ width: `${width}%` }}
    />
  )
}
