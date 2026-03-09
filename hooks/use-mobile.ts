import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Iniciar com false para evitar hydration mismatch
  const [isMobile, setIsMobile] = React.useState(false)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // Retornar false até o componente montar para evitar hydration mismatch
  if (!hasMounted) {
    return false
  }

  return isMobile
}
