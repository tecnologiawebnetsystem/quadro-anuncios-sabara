"use client"

import { useEffect, useState, useRef } from "react"
import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning,
  CloudDrizzle, Wind, Droplets, Eye, Thermometer,
} from "lucide-react"

// Coordenadas de Taubaté SP
const LAT = -23.0265
const LON = -45.5553

interface HoraClima {
  hora: string      // "08:00"
  temp: number      // °C
  sensacao: number  // °C
  chuva: number     // mm
  prob_chuva: number // %
  umidade: number   // %
  vento: number     // km/h
  codigo: number    // WMO weather code
  isDia: boolean
}

interface ResumoClima {
  temp_min: number
  temp_max: number
  codigo: number
  prob_chuva_max: number
  descricao: string
}

// Mapeamento WMO → descrição + ícone
function getCondicao(codigo: number, isDia = true): { label: string; cor: string; bg: string } {
  if (codigo === 0)          return { label: "Sol aberto",     cor: "#fbbf24", bg: "rgba(251,191,36,0.12)" }
  if (codigo <= 2)           return { label: "Poucas nuvens",  cor: "#93c5fd", bg: "rgba(147,197,253,0.12)" }
  if (codigo === 3)          return { label: "Nublado",         cor: "#94a3b8", bg: "rgba(148,163,184,0.10)" }
  if (codigo <= 49)          return { label: "Névoa/neblina",  cor: "#94a3b8", bg: "rgba(148,163,184,0.10)" }
  if (codigo <= 57)          return { label: "Chuvisco",        cor: "#7dd3fc", bg: "rgba(125,211,252,0.12)" }
  if (codigo <= 67)          return { label: "Chuva",           cor: "#38bdf8", bg: "rgba(56,189,248,0.12)" }
  if (codigo <= 77)          return { label: "Neve",            cor: "#e0f2fe", bg: "rgba(224,242,254,0.12)" }
  if (codigo <= 82)          return { label: "Chuva forte",     cor: "#0ea5e9", bg: "rgba(14,165,233,0.12)" }
  if (codigo <= 86)          return { label: "Neve forte",      cor: "#bae6fd", bg: "rgba(186,230,253,0.12)" }
  if (codigo <= 99)          return { label: "Tempestade",      cor: "#c084fc", bg: "rgba(192,132,252,0.12)" }
  return { label: "—", cor: "#94a3b8", bg: "rgba(148,163,184,0.10)" }
}

function WeatherIcon({ codigo, isDia, size = 24 }: { codigo: number; isDia?: boolean; size?: number }) {
  const s = size
  if (codigo === 0)    return <Sun size={s} className="text-yellow-400" />
  if (codigo <= 2)     return <Cloud size={s} className="text-blue-300" />
  if (codigo === 3)    return <Cloud size={s} className="text-slate-400" />
  if (codigo <= 49)    return <Wind size={s} className="text-slate-400" />
  if (codigo <= 57)    return <CloudDrizzle size={s} className="text-sky-400" />
  if (codigo <= 67)    return <CloudRain size={s} className="text-sky-500" />
  if (codigo <= 77)    return <CloudSnow size={s} className="text-blue-200" />
  if (codigo <= 82)    return <CloudRain size={s} className="text-blue-500" />
  if (codigo <= 86)    return <CloudSnow size={s} className="text-blue-300" />
  if (codigo <= 99)    return <CloudLightning size={s} className="text-purple-400" />
  return <Sun size={s} className="text-yellow-400" />
}

export function WeatherWidget({ data }: { data: string }) {
  const [horas, setHoras] = useState<HoraClima[]>([])
  const [resumo, setResumo] = useState<ResumoClima | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    setErro(false)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=temperature_2m,apparent_temperature,precipitation,precipitation_probability,relative_humidity_2m,wind_speed_10m,weather_code,is_day&daily=temperature_2m_min,temperature_2m_max,weather_code,precipitation_probability_max&timezone=America%2FSao_Paulo&start_date=${data}&end_date=${data}&wind_speed_unit=kmh`

    fetch(url)
      .then(r => r.json())
      .then(json => {
        const h = json.hourly
        const d = json.daily
        const horasData: HoraClima[] = h.time.map((t: string, i: number) => ({
          hora: t.slice(11, 16),
          temp: Math.round(h.temperature_2m[i]),
          sensacao: Math.round(h.apparent_temperature[i]),
          chuva: h.precipitation[i] ?? 0,
          prob_chuva: h.precipitation_probability[i] ?? 0,
          umidade: h.relative_humidity_2m[i] ?? 0,
          vento: Math.round(h.wind_speed_10m[i] ?? 0),
          codigo: h.weather_code[i] ?? 0,
          isDia: h.is_day[i] === 1,
        }))
        // Exibe somente o período da reunião: 08h45 até 11h00
        // A API retorna horas cheias, então mostramos 08h, 09h, 10h e 11h
        const horasFiltradas = horasData.filter(h => {
          const hora = parseInt(h.hora.split(":")[0])
          return hora >= 8 && hora <= 11
        })
        setHoras(horasFiltradas)
        setResumo({
          temp_min: Math.round(d.temperature_2m_min[0]),
          temp_max: Math.round(d.temperature_2m_max[0]),
          codigo: d.weather_code[0],
          prob_chuva_max: d.precipitation_probability_max[0] ?? 0,
          descricao: getCondicao(d.weather_code[0]).label,
        })


      })
      .catch(() => setErro(true))
      .finally(() => setLoading(false))
  }, [data])

  const horaAtual = new Date().getHours()
  const isHoje = data === new Date().toISOString().slice(0, 10)

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 mb-3"><div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-28 rounded bg-white/10 animate-pulse" />
            <div className="h-2.5 w-20 rounded bg-white/10 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2 px-4 pb-3 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-14 h-20 rounded-xl bg-white/10 animate-pulse" />
          ))}
        </div>
      </div></div>
    )
  }

  if (erro || !resumo) return null

  const condicao = getCondicao(resumo.codigo)

  return (
    <div className="max-w-lg mx-auto px-4 mb-3">
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Cabeçalho resumo do dia */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
          style={{ background: condicao.bg }}
        >
          <WeatherIcon codigo={resumo.codigo} isDia size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-white font-black text-[18px] leading-none">
              {resumo.temp_max}°
            </span>
            <span className="text-white/40 text-[13px]">
              / {resumo.temp_min}°
            </span>
            <span className="text-[11px] font-medium ml-1" style={{ color: condicao.cor }}>
              {resumo.descricao}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-white/40 text-[10px]">Taubaté SP</span>
            {resumo.prob_chuva_max > 20 && (
              <span className="flex items-center gap-0.5 text-[10px] text-sky-400">
                <Droplets size={9} />
                {resumo.prob_chuva_max}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Scroll hora a hora */}
      <div
        ref={scrollRef}
        className="flex gap-2 px-4 pb-3 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {horas.map((h, i) => {
          const isAgora = isHoje && h.hora.startsWith(String(horaAtual).padStart(2, "0"))
          const cond = getCondicao(h.codigo, h.isDia)
          return (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center gap-1 rounded-xl px-2.5 py-2 transition-all"
              style={{
                background: isAgora ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                border: isAgora ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
                minWidth: "52px",
              }}
            >
              <span
                className="text-[9px] font-bold uppercase tracking-wide"
                style={{ color: isAgora ? "#ffffff" : "rgba(255,255,255,0.45)" }}
              >
                {isAgora ? "Agora" : h.hora}
              </span>
              <WeatherIcon codigo={h.codigo} isDia={h.isDia} size={16} />
              <span className="text-white font-black text-[14px] leading-none">
                {h.temp}°
              </span>
              {h.prob_chuva > 15 && (
                <span className="text-[9px] text-sky-400 flex items-center gap-0.5">
                  <Droplets size={8} />
                  {h.prob_chuva}%
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
    </div>
  )
}
