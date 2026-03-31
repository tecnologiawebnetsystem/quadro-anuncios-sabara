"use client"

import { forwardRef } from "react"

// Tipos
interface Semana {
  id: string
  data_inicio: string
  data_fim: string
  leitura_semanal: string
  cantico_inicial: number | null
  cantico_meio: number | null
  cantico_final: number | null
  sem_reuniao: boolean
  motivo_sem_reuniao: string | null
}

interface Parte {
  id: string
  semana_id: string
  secao: string
  titulo: string
  tempo: string | null
  participante_nome: string | null
  ajudante_nome: string | null
  sala: string
  ordem: number
  leitor_nome?: string | null
  oracao_final_nome?: string | null
}

interface Estudo {
  id: string
  numero_estudo: number
  titulo: string
  data_inicio: string
  data_fim: string
  sem_reuniao: boolean
  dirigente_nome?: string | null
  leitor_nome?: string | null
}

interface EquipeTecnica {
  id: string
  data: string
  dia_semana: string
  indicador1_nome: string | null
  indicador2_nome: string | null
  microvolante1_nome: string | null
  microvolante2_nome: string | null
  som_nome: string | null
}

interface Grupo {
  id: number
  numero: number
}

interface Publicador {
  id: string
  nome: string
  grupo_id: number
  anciao: boolean
  servo_ministerial: boolean
  pioneiro_regular: boolean
  ativo: boolean
}

interface LimpezaSalao {
  id: string
  data: string
  grupo_numero: number
  responsavel_nome: string | null
}

interface ServicoCampo {
  id: string
  data: string
  dirigente_nome: string | null
}

interface ReuniaoPublica {
  id: string
  data: string
  orador_nome: string | null
  tema: string | null
  presidente_nome: string | null
}

// Utilitários
const formatarData = (data: string) => {
  const d = new Date(data + "T12:00:00")
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

const formatarPeriodo = (inicio: string, fim: string) => {
  const dataInicio = new Date(inicio + "T12:00:00")
  const dataFim = new Date(fim + "T12:00:00")
  return `${dataInicio.getDate()}-${dataFim.getDate()} de ${dataInicio.toLocaleDateString("pt-BR", { month: "long" })}`
}

const getMesAno = (mes: number, ano: number) => {
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  return `${meses[mes - 1]} ${ano}`
}

// =====================================
// VIDA E MINISTÉRIO
// =====================================
interface VidaMinisterioProps {
  mes: number
  ano: number
  semanas: Semana[]
  partes: Parte[]
}

export const PrintVidaMinisterio = forwardRef<HTMLDivElement, VidaMinisterioProps>(
  ({ mes, ano, semanas, partes }, ref) => {
    const TESOUROS_ORDEM = { DISCURSO: 1, JOIAS: 2, LEITURA: 3 }

    return (
      <div ref={ref} className="print-preview">
        <div className="print-header">
          <h1>VIDA E MINISTÉRIO CRISTÃO</h1>
          <h2>{getMesAno(mes, ano)}</h2>
        </div>

        {semanas.map((semana, idx) => {
          if (semana.sem_reuniao) return null
          const partesSemanais = partes.filter(p => p.semana_id === semana.id)
          const tesouros = partesSemanais.filter(p => p.secao === "tesouros").sort((a, b) => a.ordem - b.ordem)
          const ministerio = partesSemanais.filter(p => p.secao === "ministerio").sort((a, b) => a.ordem - b.ordem)
          const vida = partesSemanais.filter(p => p.secao === "vida").sort((a, b) => a.ordem - b.ordem)

          return (
            <div key={semana.id} className="print-week-card avoid-break">
              <div className="print-week-header">
                {formatarPeriodo(semana.data_inicio, semana.data_fim)}
                {semana.leitura_semanal && ` | Leitura: ${semana.leitura_semanal}`}
                {semana.cantico_inicial && ` | Cântico ${semana.cantico_inicial}`}
              </div>
              <div className="print-week-content">
                {/* Tesouros */}
                {tesouros.length > 0 && (
                  <div className="print-section">
                    <div className="print-section-header print-section-tesouros">
                      TESOUROS DA PALAVRA DE DEUS
                    </div>
                    {tesouros.map((parte, i) => (
                      <div key={parte.id} className="print-part">
                        <span className="print-part-title">
                          {parte.ordem === TESOUROS_ORDEM.DISCURSO && "1. Discurso"}
                          {parte.ordem === TESOUROS_ORDEM.JOIAS && "2. Joias Espirituais"}
                          {parte.ordem === TESOUROS_ORDEM.LEITURA && "3. Leitura da Bíblia"}
                          {parte.titulo && `: ${parte.titulo}`}
                          {parte.tempo && ` (${parte.tempo} min)`}
                        </span>
                        <span className="print-part-name">{parte.participante_nome || "-"}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cântico do Meio */}
                {semana.cantico_meio && (
                  <div style={{ textAlign: "center", padding: "5px", backgroundColor: "#f3f4f6", margin: "5px 0", fontSize: "10px" }}>
                    Cântico {semana.cantico_meio}
                  </div>
                )}

                {/* Ministério */}
                {ministerio.length > 0 && (
                  <div className="print-section">
                    <div className="print-section-header print-section-ministerio">
                      FAÇA SEU MELHOR NO MINISTÉRIO
                    </div>
                    {ministerio.map((parte, i) => (
                      <div key={parte.id} className="print-part">
                        <span className="print-part-title">
                          {i + 4}. {parte.titulo}
                          {parte.tempo && ` (${parte.tempo} min)`}
                        </span>
                        <span className="print-part-name">
                          {parte.participante_nome || "-"}
                          {parte.ajudante_nome && ` / ${parte.ajudante_nome}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Nossa Vida Cristã */}
                {vida.length > 0 && (
                  <div className="print-section">
                    <div className="print-section-header print-section-vida">
                      NOSSA VIDA CRISTÃ
                    </div>
                    {vida.map((parte, i) => {
                      const numParte = tesouros.length + ministerio.length + i + 1
                      return (
                        <div key={parte.id}>
                          <div className="print-part">
                            <span className="print-part-title">
                              {numParte}. {parte.titulo}
                              {parte.tempo && ` (${parte.tempo} min)`}
                            </span>
                            <span className="print-part-name">{parte.participante_nome || "-"}</span>
                          </div>
                          {parte.titulo?.toLowerCase().includes("estudo bíblico") && (
                            <div style={{ paddingLeft: "20px", fontSize: "10px", color: "#666" }}>
                              {parte.leitor_nome && <div>Leitor: {parte.leitor_nome}</div>}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Cântico Final e Oração */}
                <div style={{ textAlign: "center", padding: "5px", backgroundColor: "#f3f4f6", marginTop: "5px", fontSize: "10px" }}>
                  {semana.cantico_final && `Cântico ${semana.cantico_final}`}
                  {vida.find(p => p.oracao_final_nome) && ` | Oração: ${vida.find(p => p.oracao_final_nome)?.oracao_final_nome}`}
                </div>
              </div>
            </div>
          )
        })}

        <div className="print-footer">
          Congregação Pq. Sabará - {getMesAno(mes, ano)}
        </div>
      </div>
    )
  }
)
PrintVidaMinisterio.displayName = "PrintVidaMinisterio"

// =====================================
// ESTUDO SENTINELA
// =====================================
interface SentinelaProps {
  mes: number
  ano: number
  estudos: Estudo[]
}

export const PrintSentinela = forwardRef<HTMLDivElement, SentinelaProps>(
  ({ mes, ano, estudos }, ref) => {
    return (
      <div ref={ref} className="print-preview">
        <div className="print-header">
          <h1>ESTUDO DE A SENTINELA</h1>
          <h2>{getMesAno(mes, ano)}</h2>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Semana</th>
              <th style={{ width: "40%" }}>Tema</th>
              <th style={{ width: "17%" }}>Dirigente</th>
              <th style={{ width: "18%" }}>Leitor</th>
            </tr>
          </thead>
          <tbody>
            {estudos.map((estudo) => (
              <tr key={estudo.id}>
                <td>{formatarPeriodo(estudo.data_inicio, estudo.data_fim)}</td>
                <td>
                  {estudo.sem_reuniao ? (
                    <em style={{ color: "#666" }}>Sem reunião</em>
                  ) : (
                    estudo.titulo
                  )}
                </td>
                <td>{estudo.dirigente_nome || "-"}</td>
                <td>{estudo.leitor_nome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-footer">
          Congregação Pq. Sabará - {getMesAno(mes, ano)}
        </div>
      </div>
    )
  }
)
PrintSentinela.displayName = "PrintSentinela"

// =====================================
// REUNIÕES PÚBLICAS
// =====================================
interface ReunioesPublicasProps {
  mes: number
  ano: number
  reunioes: ReuniaoPublica[]
}

export const PrintReunioesPublicas = forwardRef<HTMLDivElement, ReunioesPublicasProps>(
  ({ mes, ano, reunioes }, ref) => {
    return (
      <div ref={ref} className="print-preview">
        <div className="print-header">
          <h1>REUNIÕES PÚBLICAS</h1>
          <h2>{getMesAno(mes, ano)}</h2>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>Data</th>
              <th style={{ width: "45%" }}>Tema do Discurso</th>
              <th style={{ width: "20%" }}>Orador</th>
              <th style={{ width: "20%" }}>Presidente</th>
            </tr>
          </thead>
          <tbody>
            {reunioes.map((reuniao) => (
              <tr key={reuniao.id}>
                <td>{formatarData(reuniao.data)}</td>
                <td>{reuniao.tema || "-"}</td>
                <td>{reuniao.orador_nome || "-"}</td>
                <td>{reuniao.presidente_nome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-footer">
          Congregação Pq. Sabará - {getMesAno(mes, ano)}
        </div>
      </div>
    )
  }
)
PrintReunioesPublicas.displayName = "PrintReunioesPublicas"

// =====================================
// EQUIPE TÉCNICA
// =====================================
interface EquipeTecnicaProps {
  mes: string
  mesLabel: string
  designacoes: EquipeTecnica[]
}

export const PrintEquipeTecnica = forwardRef<HTMLDivElement, EquipeTecnicaProps>(
  ({ mes, mesLabel, designacoes }, ref) => {
    return (
      <div ref={ref} className="print-preview">
        <div className="print-header">
          <h1>EQUIPE TÉCNICA</h1>
          <h2>{mesLabel}</h2>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "12%" }}>Data</th>
              <th style={{ width: "12%" }}>Dia</th>
              <th style={{ width: "19%" }}>Indicador 1</th>
              <th style={{ width: "19%" }}>Indicador 2</th>
              <th style={{ width: "19%" }}>Microfone 1</th>
              <th style={{ width: "19%" }}>Microfone 2</th>
              <th style={{ width: "12%" }}>Som</th>
            </tr>
          </thead>
          <tbody>
            {designacoes.map((d) => (
              <tr key={d.id}>
                <td>{formatarData(d.data)}</td>
                <td>{d.dia_semana === "quinta" ? "Qui" : "Dom"}</td>
                <td>{d.indicador1_nome || "-"}</td>
                <td>{d.indicador2_nome || "-"}</td>
                <td>{d.microvolante1_nome || "-"}</td>
                <td>{d.microvolante2_nome || "-"}</td>
                <td>{d.som_nome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-footer">
          Congregação Pq. Sabará - {mesLabel}
        </div>
      </div>
    )
  }
)
PrintEquipeTecnica.displayName = "PrintEquipeTecnica"

// =====================================
// GRUPOS DE ESTUDO
// =====================================
interface GruposEstudoProps {
  grupos: Grupo[]
  publicadores: Publicador[]
  getDirigente: (grupoId: number) => Publicador | undefined
  getAuxiliar: (grupoId: number) => Publicador | undefined
}

export const PrintGruposEstudo = forwardRef<HTMLDivElement, GruposEstudoProps>(
  ({ grupos, publicadores, getDirigente, getAuxiliar }, ref) => {
    const getPublicadoresPorGrupo = (grupoId: number) => {
      return publicadores.filter(p => p.grupo_id === grupoId && p.ativo)
    }

    return (
      <div ref={ref} className="print-preview">
        <div className="print-header">
          <h1>GRUPOS DE ESTUDO</h1>
          <h2>Congregação Pq. Sabará</h2>
        </div>

        <div className="print-groups-grid">
          {grupos.map((grupo) => {
            const dirigente = getDirigente(grupo.id)
            const auxiliar = getAuxiliar(grupo.id)
            const membros = getPublicadoresPorGrupo(grupo.id)

            return (
              <div key={grupo.id} className="print-group-card avoid-break">
                <div className="print-group-header">
                  GRUPO {grupo.numero}
                </div>
                
                {dirigente && (
                  <div style={{ fontSize: "10px", marginBottom: "5px" }}>
                    <strong>Dirigente:</strong> {dirigente.nome}
                  </div>
                )}
                {auxiliar && (
                  <div style={{ fontSize: "10px", marginBottom: "8px" }}>
                    <strong>Auxiliar:</strong> {auxiliar.nome}
                  </div>
                )}

                <div style={{ borderTop: "1px solid #ddd", paddingTop: "5px" }}>
                  {membros.map((membro) => (
                    <div key={membro.id} className="print-group-member">
                      {membro.nome}
                      {membro.anciao && " (A)"}
                      {membro.servo_ministerial && " (SM)"}
                      {membro.pioneiro_regular && " (PR)"}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="print-legend">
          <span className="print-legend-item">
            <span className="print-legend-badge" style={{ backgroundColor: "#dbeafe", color: "#1e40af" }}>A</span>
            <span>Ancião</span>
          </span>
          <span className="print-legend-item">
            <span className="print-legend-badge" style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>SM</span>
            <span>Servo Ministerial</span>
          </span>
          <span className="print-legend-item">
            <span className="print-legend-badge" style={{ backgroundColor: "#d1fae5", color: "#065f46" }}>PR</span>
            <span>Pioneiro Regular</span>
          </span>
        </div>

        <div className="print-footer">
          Congregação Pq. Sabará
        </div>
      </div>
    )
  }
)
PrintGruposEstudo.displayName = "PrintGruposEstudo"

// =====================================
// LIMPEZA DO SALÃO
// =====================================
interface LimpezaSalaoProps {
  mes: number
  ano: number
  escalas: LimpezaSalao[]
}

export const PrintLimpezaSalao = forwardRef<HTMLDivElement, LimpezaSalaoProps>(
  ({ mes, ano, escalas }, ref) => {
    return (
      <div ref={ref} className="print-preview">
        <div className="print-header">
          <h1>ESCALA DE LIMPEZA DO SALÃO</h1>
          <h2>{getMesAno(mes, ano)}</h2>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>Data</th>
              <th style={{ width: "30%" }}>Grupo</th>
              <th style={{ width: "50%" }}>Responsável</th>
            </tr>
          </thead>
          <tbody>
            {escalas.map((escala) => (
              <tr key={escala.id}>
                <td>{formatarData(escala.data)}</td>
                <td>Grupo {escala.grupo_numero}</td>
                <td>{escala.responsavel_nome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-footer">
          Congregação Pq. Sabará - {getMesAno(mes, ano)}
        </div>
      </div>
    )
  }
)
PrintLimpezaSalao.displayName = "PrintLimpezaSalao"

// =====================================
// SERVIÇO DE CAMPO
// =====================================
interface ServicoCampoProps {
  mes: number
  ano: number
  escalas: ServicoCampo[]
}

export const PrintServicoCampo = forwardRef<HTMLDivElement, ServicoCampoProps>(
  ({ mes, ano, escalas }, ref) => {
    return (
      <div ref={ref} className="print-preview">
        <div className="print-header">
          <h1>DIRIGENTES DE SERVIÇO DE CAMPO</h1>
          <h2>{getMesAno(mes, ano)}</h2>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Data</th>
              <th style={{ width: "70%" }}>Dirigente</th>
            </tr>
          </thead>
          <tbody>
            {escalas.map((escala) => (
              <tr key={escala.id}>
                <td>{formatarData(escala.data)}</td>
                <td>{escala.dirigente_nome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-footer">
          Congregação Pq. Sabará - {getMesAno(mes, ano)}
        </div>
      </div>
    )
  }
)
PrintServicoCampo.displayName = "PrintServicoCampo"
