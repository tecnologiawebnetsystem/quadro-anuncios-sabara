"use client"

import { forwardRef } from "react"

// Tipos
interface Semana {
  id: string
  mes_id?: string
  data_inicio: string
  data_fim: string
  leitura_semanal: string
  livro_biblia?: string | null
  cantico_inicial: number | null
  cantico_inicial_nome?: string | null
  cantico_meio: number | null
  cantico_meio_nome?: string | null
  cantico_final: number | null
  cantico_final_nome?: string | null
  presidente?: string | null
  oracao_inicial?: string | null
  sem_reuniao: boolean
  motivo_sem_reuniao?: string | null
}

interface Parte {
  id: string
  semana_id: string
  secao: string
  titulo: string
  tempo: string | null
  participante_id?: string | null
  participante_nome: string | null
  ajudante_id?: string | null
  ajudante_nome: string | null
  sala: string
  ordem: number
  textos?: string[]
  licao?: string | null
  descricao?: string | null
  leitor_id?: string | null
  leitor_nome?: string | null
  oracao_final_id?: string | null
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
interface Cantico {
  id: string
  numero: number
  descricao: string
}

interface VidaMinisterioProps {
  mes: number
  ano: number
  semanas: Semana[]
  partes: Parte[]
  canticos?: Cantico[]
}

// Função para formatar período da semana (ex: "9-15 de abril de 2026")
const formatarPeriodoPDF = (dataInicio: string, dataFim: string) => {
  const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]
  const dInicio = new Date(dataInicio + "T12:00:00")
  const dFim = new Date(dataFim + "T12:00:00")
  
  const diaInicio = dInicio.getDate()
  const diaFim = dFim.getDate()
  const mesInicio = meses[dInicio.getMonth()]
  const mesFim = meses[dFim.getMonth()]
  const ano = dFim.getFullYear()
  
  // Se o mês for o mesmo
  if (dInicio.getMonth() === dFim.getMonth()) {
    return `${diaInicio}-${diaFim} de ${mesFim} de ${ano}`
  }
  // Se os meses forem diferentes
  return `${diaInicio} de ${mesInicio} - ${diaFim} de ${mesFim} de ${ano}`
}

export const PrintVidaMinisterio = forwardRef<HTMLDivElement, VidaMinisterioProps>(
  ({ mes, ano, semanas, partes, canticos = [] }, ref) => {
    const TESOUROS_ORDEM = { DISCURSO: 1, JOIAS: 2, LEITURA: 3 }
    
    // Função para buscar descrição do cântico pelo número
    const getCanticoDescricao = (numero: number | null) => {
      if (!numero) return ""
      const cantico = canticos.find(c => c.numero === numero)
      return cantico ? cantico.descricao : ""
    }

    return (
      <div ref={ref} className="vida-ministerio-print">
        {semanas.map((semana, idx) => {
          if (semana.sem_reuniao) return null
          const partesSemanais = partes.filter(p => p.semana_id === semana.id)
          const tesouros = partesSemanais.filter(p => p.secao === "tesouros").sort((a, b) => a.ordem - b.ordem)
          const ministerio = partesSemanais.filter(p => p.secao === "ministerio").sort((a, b) => a.ordem - b.ordem)
          const vida = partesSemanais.filter(p => p.secao === "vida").sort((a, b) => a.ordem - b.ordem)
          const oracaoFinal = vida.find(p => p.oracao_final_nome)

          return (
            <div key={semana.id} className="vm-semana avoid-break" style={{ 
              backgroundColor: "white", 
              padding: "16px", 
              marginBottom: idx < semanas.length - 1 ? "20px" : 0,
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              pageBreakInside: "avoid"
            }}>
              {/* Cabeçalho da Congregação */}
              <div style={{ 
                borderBottom: "2px solid #374151",
                paddingBottom: "8px",
                marginBottom: "12px"
              }}>
                <div style={{ 
                  fontSize: "11px", 
                  color: "#6b7280", 
                  marginBottom: "2px",
                  fontWeight: "500"
                }}>
                  Reunião do meio de semana
                </div>
                <div style={{ 
                  fontSize: "14px", 
                  fontWeight: "bold", 
                  color: "#111827"
                }}>
                  Parque Sabará - Taubaté SP
                </div>
              </div>

              {/* Data e Leitura da Semana */}
              <div style={{ 
                backgroundColor: "#1f2937", 
                color: "white", 
                padding: "10px 14px",
                marginBottom: "12px",
                borderRadius: "4px"
              }}>
                <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                  {formatarPeriodoPDF(semana.data_inicio, semana.data_fim)} | {semana.leitura_semanal?.toUpperCase() || ""}
                </div>
              </div>

              {/* Presidente e Oração */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                fontSize: "11px",
                marginBottom: "8px",
                padding: "6px 10px",
                backgroundColor: "#f9fafb",
                borderRadius: "4px"
              }}>
                <div>
                  <span style={{ fontWeight: "600", color: "#374151" }}>Presidente:</span>
                  <span style={{ marginLeft: "6px", color: "#111827", fontWeight: "500" }}>
                    {semana.presidente || "-"}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: "600", color: "#374151" }}>Oração:</span>
                  <span style={{ marginLeft: "6px", color: "#111827", fontWeight: "500" }}>
                    {semana.oracao_inicial || "-"}
                  </span>
                </div>
              </div>

              {/* Cântico Inicial */}
              {semana.cantico_inicial && (
                <div style={{ 
                  textAlign: "left", 
                  padding: "6px 10px", 
                  backgroundColor: "#e0e7ff",
                  color: "#3730a3",
                  fontSize: "10px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  borderRadius: "4px"
                }}>
                  Cântico {semana.cantico_inicial}: {getCanticoDescricao(semana.cantico_inicial) || semana.cantico_inicial_nome || ""}
                </div>
              )}

              {/* Comentários Iniciais */}
              <div style={{ 
                fontSize: "10px",
                fontWeight: "600",
                color: "#374151",
                padding: "6px 10px",
                marginBottom: "12px",
                backgroundColor: "#f9fafb",
                borderRadius: "4px"
              }}>
                Comentários iniciais
              </div>

              {/* TESOUROS DA PALAVRA DE DEUS */}
              {tesouros.length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ 
                    backgroundColor: "#b8860b",
                    color: "white",
                    padding: "8px 12px",
                    fontWeight: "bold",
                    fontSize: "11px",
                    marginBottom: "1px",
                    borderRadius: "4px 4px 0 0"
                  }}>
                    TESOUROS DA PALAVRA DE DEUS
                  </div>
                  <div style={{ padding: "8px 12px", borderRadius: "0 0 4px 4px", border: "1px solid #e5e7eb", borderTop: "none" }}>
                    {tesouros.map((parte, i) => (
                      <div key={parte.id} style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        padding: "5px 0",
                        borderBottom: i < tesouros.length - 1 ? "1px dotted #d1d5db" : "none",
                        fontSize: "10px"
                      }}>
                        <span style={{ color: "#374151" }}>
                          {parte.ordem}. {parte.titulo}
                          {parte.tempo && <span style={{ color: "#6b7280" }}> ({parte.tempo} min)</span>}
                        </span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>
                          {parte.participante_nome || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAÇA SEU MELHOR NO MINISTÉRIO */}
              {ministerio.length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ 
                    backgroundColor: "#ca8a04",
                    color: "white",
                    padding: "8px 12px",
                    fontWeight: "bold",
                    fontSize: "11px",
                    marginBottom: "1px",
                    borderRadius: "4px 4px 0 0"
                  }}>
                    FAÇA SEU MELHOR NO MINISTÉRIO
                  </div>
                  <div style={{ padding: "8px 12px", borderRadius: "0 0 4px 4px", border: "1px solid #e5e7eb", borderTop: "none" }}>
                    {ministerio.map((parte, i) => (
                      <div key={parte.id} style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        padding: "5px 0",
                        borderBottom: i < ministerio.length - 1 ? "1px dotted #d1d5db" : "none",
                        fontSize: "10px"
                      }}>
                        <span style={{ color: "#374151" }}>
                          {tesouros.length + i + 1}. {parte.titulo}
                          {parte.tempo && <span style={{ color: "#6b7280" }}> ({parte.tempo} min)</span>}
                        </span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>
                          {parte.participante_nome || "-"}
                          {parte.ajudante_nome && <span> / {parte.ajudante_nome}</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cântico do Meio */}
              {semana.cantico_meio && (
                <div style={{ 
                  textAlign: "left", 
                  padding: "6px 10px", 
                  backgroundColor: "#e0e7ff",
                  color: "#3730a3",
                  fontSize: "10px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  borderRadius: "4px"
                }}>
                  Cântico {semana.cantico_meio}: {getCanticoDescricao(semana.cantico_meio) || semana.cantico_meio_nome || ""}
                </div>
              )}

              {/* NOSSA VIDA CRISTÃ */}
              {vida.length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ 
                    backgroundColor: "#b91c1c",
                    color: "white",
                    padding: "8px 12px",
                    fontWeight: "bold",
                    fontSize: "11px",
                    marginBottom: "1px",
                    borderRadius: "4px 4px 0 0"
                  }}>
                    NOSSA VIDA CRISTÃ
                  </div>
                  <div style={{ padding: "8px 12px", borderRadius: "0 0 4px 4px", border: "1px solid #e5e7eb", borderTop: "none" }}>
                    {vida.map((parte, i) => {
                      const numParte = tesouros.length + ministerio.length + i + 1
                      const isEstudoBiblico = parte.titulo?.toLowerCase().includes("estudo bíblico")
                      return (
                        <div key={parte.id}>
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between",
                            padding: "5px 0",
                            borderBottom: i < vida.length - 1 && !isEstudoBiblico ? "1px dotted #d1d5db" : "none",
                            fontSize: "10px"
                          }}>
                            <span style={{ color: "#374151" }}>
                              {numParte}. {parte.titulo}
                              {parte.tempo && <span style={{ color: "#6b7280" }}> ({parte.tempo} min)</span>}
                            </span>
                            <span style={{ fontWeight: "600", color: "#111827" }}>
                              {parte.participante_nome || "-"}
                              {parte.leitor_nome && <span> / {parte.leitor_nome}</span>}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Comentários Finais */}
              <div style={{ 
                fontSize: "10px",
                fontWeight: "600",
                color: "#374151",
                padding: "6px 10px",
                marginBottom: "8px",
                backgroundColor: "#f9fafb",
                borderRadius: "4px"
              }}>
                Comentários finais
              </div>

              {/* Cântico Final e Oração */}
              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                backgroundColor: "#e0e7ff",
                borderRadius: "4px",
                fontSize: "10px"
              }}>
                <div style={{ 
                  color: "#3730a3",
                  fontWeight: "600"
                }}>
                  {semana.cantico_final && `Cântico ${semana.cantico_final}: ${getCanticoDescricao(semana.cantico_final) || semana.cantico_final_nome || ""}`}
                </div>
                <div>
                  <span style={{ fontWeight: "600", color: "#374151" }}>Oração:</span>
                  <span style={{ marginLeft: "6px", color: "#111827", fontWeight: "500" }}>
                    {oracaoFinal?.oracao_final_nome || "-"}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        <div style={{ 
          textAlign: "center", 
          fontSize: "9px", 
          color: "#6b7280",
          marginTop: "16px",
          paddingTop: "8px",
          borderTop: "1px solid #e5e7eb"
        }}>
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
