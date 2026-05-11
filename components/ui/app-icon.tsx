interface AppIconProps {
  size?: number
  className?: string
}

export function AppIcon({ size = 40, className }: AppIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Quadro de Anúncios — Parque Sabará"
    >
      {/* Fundo arredondado laranja escuro */}
      <rect width="100" height="100" rx="22" fill="#b84a00" />

      {/* Megafone — corpo */}
      <path
        d="M22 42 C22 39.8 23.8 38 26 38 L46 38 L68 24 L68 76 L46 62 L26 62 C23.8 62 22 60.2 22 58 L22 42Z"
        fill="white"
      />

      {/* Cabo do megafone */}
      <rect x="26" y="62" width="12" height="14" rx="3" fill="white" opacity="0.85" />

      {/* Ondas sonoras */}
      <path
        d="M74 38 C78 42 78 58 74 62"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M80 32 C87 39 87 61 80 68"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}
