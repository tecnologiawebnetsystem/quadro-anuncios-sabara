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
  microvolante_palco: 1 | 2 | null
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
    // Filtra semanas com reunião
    const semanasComReuniao = semanas.filter(s => !s.sem_reuniao)
    
    // Função para buscar descrição do cântico pelo número
    const getCanticoDescricao = (numero: number | null) => {
      if (!numero) return ""
      const cantico = canticos.find(c => c.numero === numero)
      return cantico ? cantico.descricao : ""
    }

    return (
      <div ref={ref} className="vm-print-wrapper" style={{ width: "210mm", margin: "0 auto" }}>
        {semanasComReuniao.map((semana, idx) => {
          const partesSemanais = partes.filter(p => p.semana_id === semana.id)
          const tesouros = partesSemanais.filter(p => p.secao === "tesouros").sort((a, b) => a.ordem - b.ordem)
          const ministerio = partesSemanais.filter(p => p.secao === "ministerio").sort((a, b) => a.ordem - b.ordem)
          const vida = partesSemanais.filter(p => p.secao === "vida").sort((a, b) => a.ordem - b.ordem)
          const oracaoFinal = vida.find(p => p.oracao_final_nome)
          const isLastPage = idx === semanasComReuniao.length - 1

          // Calcular datas reais da quinta e do domingo de reunião
          // data_inicio é o domingo anterior à quinta
          const domInicio = new Date(semana.data_inicio + "T12:00:00")
          const quintaDate = new Date(domInicio); quintaDate.setDate(domInicio.getDate() + 4)
          const domingoDate = new Date(domInicio); domingoDate.setDate(domInicio.getDate() + 7)
          const fmtDia = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })

          return (
            <div 
              key={semana.id}
              className="vm-page"
              style={{ 
                backgroundColor: "white", 
                padding: "12mm 15mm", 
                width: "210mm",
                height: "297mm",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Cabeçalho da Congregação */}
              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "3px solid #374151",
                paddingBottom: "12px",
                marginBottom: "15px",
                flexShrink: 0
              }}>
                <div style={{ 
                  fontSize: "16px", 
                  fontWeight: "bold", 
                  color: "#111827"
                }}>
                  Parque Sabará - Taubaté SP
                </div>
                <div style={{ 
                  fontSize: "16px", 
                  fontWeight: "bold", 
                  color: "#111827",
                  textAlign: "right"
                }}>
                  Reunião do meio de semana
                </div>
              </div>

              {/* Data e Leitura da Semana */}
              <div style={{ 
                backgroundColor: "#1f2937", 
                color: "white", 
                padding: "12px 18px",
                marginBottom: "15px",
                borderRadius: "6px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}>
                {/* Período + Livro */}
                <div style={{ fontSize: "15px", fontWeight: "bold", flex: 1 }}>
                  {formatarPeriodoPDF(semana.data_inicio, semana.data_fim)}
                  {semana.livro_biblia && (
                    <span style={{ marginLeft: "10px", color: "#9ca3af", fontSize: "13px", fontWeight: "normal" }}>
                      | {(semana.livro_biblia || "").toUpperCase()}
                    </span>
                  )}
                </div>
                {/* Badges de dia */}
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <span style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                  }}>
                    Qui {fmtDia(quintaDate)}
                  </span>
                  <span style={{
                    backgroundColor: "#16a34a",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                  }}>
                    Dom {fmtDia(domingoDate)}
                  </span>
                </div>
              </div>

              {/* Presidente e Oração */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                fontSize: "14px",
                marginBottom: "12px",
                padding: "10px 14px",
                backgroundColor: "#f3f4f6",
                borderRadius: "6px",
                flexShrink: 0
              }}>
                <div>
                  <span style={{ fontWeight: "700", color: "#374151" }}>Presidente:</span>
                  <span style={{ marginLeft: "8px", color: "#111827", fontWeight: "600" }}>
                    {semana.presidente || "-"}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: "700", color: "#374151" }}>Oração:</span>
                  <span style={{ marginLeft: "8px", color: "#111827", fontWeight: "600" }}>
                    {semana.oracao_inicial || "-"}
                  </span>
                </div>
              </div>

              {/* Cântico Inicial */}
              {semana.cantico_inicial && (
                <div style={{ 
                  textAlign: "left", 
                  padding: "10px 14px", 
                  backgroundColor: "#e0e7ff",
                  color: "#3730a3",
                  fontSize: "14px",
                  fontWeight: "700",
                  marginBottom: "12px",
                  borderRadius: "6px",
                  flexShrink: 0
                }}>
                  Cântico {semana.cantico_inicial}: {getCanticoDescricao(semana.cantico_inicial) || semana.cantico_inicial_nome || ""}
                </div>
              )}

              {/* Comentários Iniciais */}
              <div style={{ 
                fontSize: "14px",
                fontWeight: "700",
                color: "#374151",
                padding: "8px 14px",
                marginBottom: "12px",
                flexShrink: 0
              }}>
                Comentários iniciais
              </div>

              {/* TESOUROS DA PALAVRA DE DEUS */}
              {tesouros.length > 0 && (
                <div style={{ marginBottom: "15px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ 
                    backgroundColor: "#2a6b77",
                    color: "white",
                    padding: "10px 14px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    borderRadius: "6px 6px 0 0",
                    flexShrink: 0
                  }}>
                    TESOUROS DA PALAVRA DE DEUS
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: "0 0 6px 6px", border: "1px solid #d1d5db", borderTop: "none", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                    {tesouros.map((parte, i) => (
                      <div key={parte.id} style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: i < tesouros.length - 1 ? "1px dotted #d1d5db" : "none",
                        fontSize: "14px"
                      }}>
                        <span style={{ color: "#374151" }}>
                          {parte.ordem}. {parte.titulo}
                          {parte.tempo && <span style={{ color: "#6b7280" }}> ({parte.tempo} min)</span>}
                        </span>
                        <span style={{ fontWeight: "700", color: "#111827" }}>
                          {parte.participante_nome || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAÇA SEU MELHOR NO MINISTÉRIO */}
              {ministerio.length > 0 && (
                <div style={{ marginBottom: "15px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ 
                    backgroundColor: "#c69214",
                    color: "white",
                    padding: "10px 14px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    borderRadius: "6px 6px 0 0",
                    flexShrink: 0
                  }}>
                    FAÇA SEU MELHOR NO MINISTÉRIO
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: "0 0 6px 6px", border: "1px solid #d1d5db", borderTop: "none", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                    {ministerio.map((parte, i) => (
                      <div key={parte.id} style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: i < ministerio.length - 1 ? "1px dotted #d1d5db" : "none",
                        fontSize: "14px"
                      }}>
                        <span style={{ color: "#374151" }}>
                          {tesouros.length + i + 1}. {parte.titulo}
                          {parte.tempo && <span style={{ color: "#6b7280" }}> ({parte.tempo} min)</span>}
                        </span>
                        <span style={{ fontWeight: "700", color: "#111827" }}>
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
                  padding: "10px 14px", 
                  backgroundColor: "#e0e7ff",
                  color: "#3730a3",
                  fontSize: "14px",
                  fontWeight: "700",
                  marginBottom: "15px",
                  borderRadius: "6px",
                  flexShrink: 0
                }}>
                  Cântico {semana.cantico_meio}: {getCanticoDescricao(semana.cantico_meio) || semana.cantico_meio_nome || ""}
                </div>
              )}

              {/* NOSSA VIDA CRISTÃ */}
              {vida.length > 0 && (
                <div style={{ marginBottom: "15px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ 
                    backgroundColor: "#8b2332",
                    color: "white",
                    padding: "10px 14px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    borderRadius: "6px 6px 0 0",
                    flexShrink: 0
                  }}>
                    NOSSA VIDA CRISTÃ
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: "0 0 6px 6px", border: "1px solid #d1d5db", borderTop: "none", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                    {vida.map((parte, i) => {
                      const numParte = tesouros.length + ministerio.length + i + 1
                      return (
                        <div key={parte.id} style={{ 
                          display: "flex", 
                          justifyContent: "space-between",
                          padding: "8px 0",
                          borderBottom: i < vida.length - 1 ? "1px dotted #d1d5db" : "none",
                          fontSize: "14px"
                        }}>
                          <span style={{ color: "#374151" }}>
                            {numParte}. {parte.titulo}
                            {parte.tempo && <span style={{ color: "#6b7280" }}> ({parte.tempo} min)</span>}
                          </span>
                          <span style={{ fontWeight: "700", color: "#111827" }}>
                            {parte.participante_nome || "-"}
                            {parte.leitor_nome && <span> / {parte.leitor_nome}</span>}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Comentários Finais */}
              <div style={{ 
                fontSize: "14px",
                fontWeight: "700",
                color: "#374151",
                padding: "8px 14px",
                marginBottom: "12px",
                flexShrink: 0
              }}>
                Comentários finais
              </div>

              {/* Cântico Final e Oração */}
              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 14px",
                backgroundColor: "#e0e7ff",
                borderRadius: "6px",
                fontSize: "14px",
                flexShrink: 0,
                marginTop: "auto"
              }}>
                <div style={{ 
                  color: "#3730a3",
                  fontWeight: "700"
                }}>
                  {semana.cantico_final && `Cântico ${semana.cantico_final}: ${getCanticoDescricao(semana.cantico_final) || semana.cantico_final_nome || ""}`}
                </div>
                <div>
                  <span style={{ fontWeight: "700", color: "#374151" }}>Oração:</span>
                  <span style={{ marginLeft: "8px", color: "#111827", fontWeight: "600" }}>
                    {oracaoFinal?.oracao_final_nome || "-"}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
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
      <div ref={ref} style={{
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        padding: "8mm 10mm",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        color: "black",
        overflow: "hidden"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "5px",
          marginBottom: "8px",
          borderBottom: "2px solid #333",
          flexShrink: 0
        }}>
          <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: 0, color: "#000" }}>Parque Sabará - Taubaté SP</h1>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: 0, color: "#000" }}>Estudo de A Sentinela - {getMesAno(mes, ano)}</h2>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", flex: 1 }}>
          <thead>
            <tr style={{ backgroundColor: "#2a6b77" }}>
              <th style={{ padding: "5px 10px", border: "1px solid #999", color: "white", textAlign: "left", width: "22%" }}>Semana</th>
              <th style={{ padding: "5px 10px", border: "1px solid #999", color: "white", textAlign: "left", width: "43%" }}>Tema</th>
              <th style={{ padding: "5px 10px", border: "1px solid #999", color: "white", textAlign: "left", width: "17%" }}>Dirigente</th>
              <th style={{ padding: "5px 10px", border: "1px solid #999", color: "white", textAlign: "left", width: "18%" }}>Leitor</th>
            </tr>
          </thead>
          <tbody>
            {estudos.map((estudo, i) => (
              <tr key={estudo.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f5f5f5" }}>
                <td style={{ padding: "5px 10px", border: "1px solid #ddd" }}>{formatarPeriodo(estudo.data_inicio, estudo.data_fim)}</td>
                <td style={{ padding: "5px 10px", border: "1px solid #ddd" }}>
                  {estudo.sem_reuniao ? (
                    <em style={{ color: "#666" }}>Sem reunião</em>
                  ) : (
                    estudo.titulo
                  )}
                </td>
                <td style={{ padding: "5px 10px", border: "1px solid #ddd" }}>{estudo.dirigente_nome || "-"}</td>
                <td style={{ padding: "5px 10px", border: "1px solid #ddd" }}>{estudo.leitor_nome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: "center", fontSize: "12px", color: "#666", padding: "5px", marginTop: "auto", borderTop: "1px solid #ccc", flexShrink: 0 }}>
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
      <div ref={ref} style={{
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        padding: "8mm 10mm",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        color: "black",
        overflow: "hidden"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "5px",
          marginBottom: "8px",
          borderBottom: "2px solid #333",
          flexShrink: 0
        }}>
          <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: 0, color: "#000" }}>Parque Sabará - Taubaté SP</h1>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: 0, color: "#000" }}>Reuniões Públicas - {getMesAno(mes, ano)}</h2>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", flex: 1 }}>
          <thead>
            <tr style={{ backgroundColor: "#8b2332" }}>
              <th style={{ padding: "5px 10px", border: "1px solid #999", color: "white", textAlign: "left", width: "15%" }}>Data</th>
              <th style={{ padding: "5px 10px", border: "1px solid #999", color: "white", textAlign: "left", width: "45%" }}>Tema do Discurso</th>
              <th style={{ padding: "5px 10px", border: "1px solid #999", color: "white", textAlign: "left", width: "20%" }}>Orador</th>
              <th style={{ padding: "5px 10px", border: "1px solid #999", color: "white", textAlign: "left", width: "20%" }}>Presidente</th>
            </tr>
          </thead>
          <tbody>
            {reunioes.map((reuniao, i) => (
              <tr key={reuniao.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f5f5f5" }}>
                <td style={{ padding: "5px 10px", border: "1px solid #ddd" }}>{formatarData(reuniao.data)}</td>
                <td style={{ padding: "5px 10px", border: "1px solid #ddd" }}>{reuniao.tema || "-"}</td>
                <td style={{ padding: "5px 10px", border: "1px solid #ddd" }}>{reuniao.orador_nome || "-"}</td>
                <td style={{ padding: "5px 10px", border: "1px solid #ddd" }}>{reuniao.presidente_nome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: "center", fontSize: "12px", color: "#666", padding: "5px", marginTop: "auto", borderTop: "1px solid #ccc", flexShrink: 0 }}>
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
      <div ref={ref} style={{
        backgroundColor: "white",
        color: "black",
        padding: "5mm 8mm",
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        margin: "0 auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "5px",
          marginBottom: "6px",
          borderBottom: "2px solid #333",
          flexShrink: 0
        }}>
          <h1 style={{ fontSize: "13px", fontWeight: "bold", margin: 0, color: "#000" }}>Parque Sabará — Taubaté SP</h1>
          <h2 style={{ fontSize: "13px", fontWeight: "bold", margin: 0, color: "#000" }}>Programação da Congregação</h2>
        </div>

        {/* Banner do mês */}
        <div style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "5px 10px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "11px",
          marginBottom: "6px",
          borderRadius: "3px",
          flexShrink: 0,
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          {mesLabel.toUpperCase()}
        </div>

        {/* Título seção */}
        <div style={{
          backgroundColor: "#2a6b77",
          color: "white",
          padding: "5px 10px",
          fontWeight: "bold",
          fontSize: "10px",
          marginBottom: "1px",
          borderRadius: "3px 3px 0 0",
          flexShrink: 0
        }}>
          DESIGNAÇÕES TÉCNICAS
        </div>

        {/* Tabela */}
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          fontSize: "9px",
          flex: 1
        }}>
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", color: "#374151", textAlign: "center", width: "10%" }}>Data</th>
              <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", color: "#374151", textAlign: "center" }}>Indicadores</th>
              <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", color: "#374151", textAlign: "center" }}>Mic. Volante</th>
              <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", color: "#374151", textAlign: "center" }}>Áudio e Vídeo</th>
              <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", color: "#374151", textAlign: "center" }}>Palco</th>
            </tr>
          </thead>
          <tbody>
            {designacoes.map((d, i) => {
              const diaSemana = new Date(d.data + "T12:00:00").getDay()
              const isQuinta = diaSemana === 4
              const isDomingo = diaSemana === 0
              return (
              <tr key={d.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f9fafb" }}>
                <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", fontWeight: "bold", whiteSpace: "nowrap" }}>
                  <span style={{
                    display: "inline-block",
                    backgroundColor: isQuinta ? "#2563eb" : isDomingo ? "#16a34a" : "#6b7280",
                    color: "white",
                    borderRadius: "3px",
                    padding: "0px 3px",
                    fontSize: "6.5px",
                    fontWeight: "800",
                    marginRight: "4px",
                    verticalAlign: "middle",
                  }}>
                    {isQuinta ? "QUI" : isDomingo ? "DOM" : "—"}
                  </span>
                  {formatarData(d.data)}
                </td>
                <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  {d.indicador1_nome || "-"}{d.indicador2_nome ? ` / ${d.indicador2_nome}` : ""}
                </td>
                <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  {d.microvolante1_nome || "-"}{d.microvolante2_nome ? ` / ${d.microvolante2_nome}` : ""}
                </td>
                <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  {d.som_nome || "-"}
                </td>
                <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  {d.microvolante_palco === 1
                    ? (d.microvolante1_nome || "-")
                    : d.microvolante_palco === 2
                    ? (d.microvolante2_nome || "-")
                    : "-"}
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
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

    // Calcula o número de colunas baseado na quantidade de grupos
    const numGrupos = grupos.length
    const gridCols = numGrupos <= 4 ? 2 : numGrupos <= 6 ? 3 : 3

    return (
      <div ref={ref} style={{
        backgroundColor: "white",
        color: "black",
        padding: "8mm 10mm",
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        margin: "0 auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "5px",
          marginBottom: "8px",
          borderBottom: "2px solid #333",
          flexShrink: 0
        }}>
          <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: 0, color: "#000" }}>
            Parque Sabará - Taubaté SP
          </h1>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: 0, color: "#000" }}>
            Grupos de Estudos
          </h2>
        </div>

        {/* Grid de grupos */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: "6px",
          flex: 1,
          alignContent: "start"
        }}>
          {grupos.map((grupo) => {
            const dirigente = getDirigente(grupo.id)
            const auxiliar = getAuxiliar(grupo.id)
            const membros = getPublicadoresPorGrupo(grupo.id)

            return (
              <div key={grupo.id} style={{
                border: "1px solid #999",
                padding: "0",
                pageBreakInside: "avoid",
                borderRadius: "3px",
                overflow: "hidden"
              }}>
                {/* Header do grupo */}
                <div style={{
                  backgroundColor: "#059669",
                  color: "white",
                  padding: "4px 8px",
                  fontWeight: "bold",
                  fontSize: "11px",
                  textAlign: "center"
                }}>
                  GRUPO {grupo.numero}
                </div>
                
                <div style={{ padding: "5px 8px" }}>
                  {/* Dirigente e Auxiliar */}
                  {dirigente && (
                    <div style={{ fontSize: "10px", marginBottom: "2px", lineHeight: "1.4" }}>
                      <strong>Dir:</strong> {dirigente.nome}
                    </div>
                  )}
                  {auxiliar && (
                    <div style={{ fontSize: "10px", marginBottom: "4px", lineHeight: "1.4" }}>
                      <strong>Aux:</strong> {auxiliar.nome}
                    </div>
                  )}

                  {/* Lista de membros */}
                  <div style={{ borderTop: "1px solid #ddd", paddingTop: "4px" }}>
                    {membros.map((membro, idx) => (
                      <div key={membro.id} style={{
                        padding: "2px 0",
                        borderBottom: idx < membros.length - 1 ? "1px dotted #ddd" : "none",
                        fontSize: "9px",
                        lineHeight: "1.4"
                      }}>
                        {membro.nome}
                        {membro.anciao && <span style={{ color: "#1e40af", fontWeight: "bold" }}> (A)</span>}
                        {membro.servo_ministerial && <span style={{ color: "#92400e", fontWeight: "bold" }}> (SM)</span>}
                        {membro.pioneiro_regular && <span style={{ color: "#065f46", fontWeight: "bold" }}> (PR)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Legenda */}
        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          padding: "6px",
          backgroundColor: "#f3f4f6",
          marginTop: "8px",
          fontSize: "11px",
          flexShrink: 0
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ backgroundColor: "#dbeafe", color: "#1e40af", padding: "1px 4px", borderRadius: "2px", fontWeight: "bold" }}>A</span>
            <span>Ancião</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "1px 4px", borderRadius: "2px", fontWeight: "bold" }}>SM</span>
            <span>Servo Ministerial</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ backgroundColor: "#d1fae5", color: "#065f46", padding: "1px 4px", borderRadius: "2px", fontWeight: "bold" }}>PR</span>
            <span>Pioneiro Regular</span>
          </span>
        </div>

        {/* Rodapé */}
        <div style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#666",
          padding: "5px",
          marginTop: "auto",
          borderTop: "1px solid #ccc",
          flexShrink: 0
        }}>
          Congregação Pq. Sabará - Grupos de Estudos
        </div>
      </div>
    )
  }
)
PrintGruposEstudo.displayName = "PrintGruposEstudo"

// =====================================
// LIMPEZA DO SALÃO (4 MESES)
// =====================================
interface LimpezaSalaoMes {
  mes: number
  ano: number
  escalas: LimpezaSalaoEscala[]
}

interface LimpezaSalaoEscala {
  id: string
  semana: number
  data_inicio: string
  data_fim: string
  grupo_nome: string | null
  grupo_local: string | null
  limpeza_semanal_grupo_nome: string | null
  limpeza_semanal_grupo_local: string | null
}

interface LimpezaSalaoProps {
  mes: number
  ano: number
  escalas: LimpezaSalao[]
  meses?: LimpezaSalaoMes[]
}

// Retorna "Qui DD/MM & Dom DD/MM" com base no domingo de início da semana
const formatarPeriodoSemana = (inicio: string, _fim: string) => {
  const domInicio = new Date(inicio + "T12:00:00")
  const quinta = new Date(domInicio)
  quinta.setDate(domInicio.getDate() + 4)
  const domingo = new Date(domInicio)
  domingo.setDate(domInicio.getDate() + 7)
  const fmt = (d: Date) =>
    `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`
  return `Qui ${fmt(quinta)} / Dom ${fmt(domingo)}`
}

// Paleta de cores por mês — 4 variações distintas
const CORES_MES = [
  { bg: "#1e3a5f", accent: "#2563eb", light: "#eff6ff", border: "#bfdbfe", stripe: "#f8faff", text: "#1e3a5f" },
  { bg: "#14532d", accent: "#16a34a", light: "#f0fdf4", border: "#bbf7d0", stripe: "#f6fef8", text: "#14532d" },
  { bg: "#7c2d12", accent: "#ea580c", light: "#fff7ed", border: "#fed7aa", stripe: "#fffaf6", text: "#7c2d12" },
  { bg: "#4a1d96", accent: "#7c3aed", light: "#f5f3ff", border: "#ddd6fe", stripe: "#faf9ff", text: "#4a1d96" },
]

// Formata o local: se houver local cadastrado mostra ele, senão mostra "Salão do Reino"
const formatarLocal = (local: string | null) =>
  local && local.trim() ? local.trim() : "Salão do Reino"

export const PrintLimpezaSalao = forwardRef<HTMLDivElement, LimpezaSalaoProps>(
  ({ mes, ano, escalas, meses }, ref) => {
    const mesesParaImprimir = meses && meses.length > 0 ? meses : []

    const nomeMesInicio = mesesParaImprimir.length > 0
      ? getMesAno(mesesParaImprimir[0].mes, mesesParaImprimir[0].ano)
      : getMesAno(mes, ano)
    const nomeMesFim = mesesParaImprimir.length > 1
      ? getMesAno(mesesParaImprimir[mesesParaImprimir.length - 1].mes, mesesParaImprimir[mesesParaImprimir.length - 1].ano)
      : nomeMesInicio

    return (
      <div ref={ref} style={{
        backgroundColor: "#ffffff",
        color: "#111827",
        padding: "12mm 14mm 10mm 14mm",
        width: "210mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        margin: "0 auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
      }}>

        {/* ── Cabeçalho ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "8px",
          marginBottom: "10px",
          borderBottom: "3px solid #111827",
          flexShrink: 0,
        }}>
          {/* Lado esquerdo — identidade */}
          <div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#111827", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
              Congregação Parque Sabará
            </div>
            <div style={{ fontSize: "10.5px", color: "#6b7280", marginTop: "2px", letterSpacing: "0.2px" }}>
              Testemunhas de Jeová — Taubaté, SP
            </div>
          </div>
          {/* Lado direito — título do documento */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: "13px", fontWeight: "800", color: "#111827",
              textTransform: "uppercase", letterSpacing: "0.8px",
            }}>
              Escala de Limpeza
            </div>
            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
              {nomeMesInicio}{nomeMesFim !== nomeMesInicio ? ` — ${nomeMesFim}` : ""}
            </div>
          </div>
        </div>

        {/* ── Legenda de colunas ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "22% 39% 39%",
          gap: "0",
          marginBottom: "8px",
          padding: "4px 8px",
          backgroundColor: "#f3f4f6",
          borderRadius: "4px",
          flexShrink: 0,
        }}>
          {["Período", "Limpeza do Salão do Reino", "Limpeza Semanal"].map((col) => (
            <div key={col} style={{
              fontSize: "9px", fontWeight: "700", color: "#374151",
              textTransform: "uppercase", letterSpacing: "0.6px",
            }}>{col}</div>
          ))}
        </div>

        {/* ── Blocos de meses ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, overflow: "hidden" }}>
          {mesesParaImprimir.map((mesData, idx) => {
            const cor = CORES_MES[idx % CORES_MES.length]
            return (
              <div key={`${mesData.ano}-${mesData.mes}`} style={{
                flexShrink: 0,
                borderRadius: "6px",
                overflow: "hidden",
                border: `1.5px solid ${cor.border}`,
              }}>

                {/* Cabeçalho do mês */}
                <div style={{
                  backgroundColor: cor.bg,
                  color: "white",
                  padding: "5px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <span style={{
                    fontWeight: "800", fontSize: "11px",
                    letterSpacing: "1px", textTransform: "uppercase",
                  }}>
                    {getMesAno(mesData.mes, mesData.ano)}
                  </span>
                  <span style={{
                    fontSize: "9px", fontWeight: "500",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "1px 7px", borderRadius: "8px",
                  }}>
                    {mesData.escalas.length} {mesData.escalas.length === 1 ? "semana" : "semanas"}
                  </span>
                </div>

                {mesData.escalas.length === 0 ? (
                  <div style={{
                    padding: "7px 10px", fontSize: "10.5px",
                    color: "#9ca3af", textAlign: "center",
                    fontStyle: "italic", backgroundColor: "#fafafa",
                  }}>
                    Nenhuma designação cadastrada.
                  </div>
                ) : (
                  <div>
                    {mesData.escalas.map((escala, i) => {
                      const isLast = i === mesData.escalas.length - 1
                      const bgRow = i % 2 === 0 ? "white" : cor.stripe
                      const borderRow = isLast ? "none" : `1px solid ${cor.border}`
                      return (
                        <div key={escala.id} style={{
                          display: "grid",
                          gridTemplateColumns: "22% 39% 39%",
                          backgroundColor: bgRow,
                          borderBottom: borderRow,
                        }}>
                          {/* Período */}
                          <div style={{
                            padding: "6px 10px",
                            borderRight: `1px solid ${cor.border}`,
                          }}>
                            <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#111827", lineHeight: 1.3 }}>
                              {formatarPeriodoSemana(escala.data_inicio, escala.data_fim)}
                            </div>
                          </div>

                          {/* Limpeza do Salão */}
                          <div style={{
                            padding: "6px 10px",
                            borderRight: `1px solid ${cor.border}`,
                          }}>
                            {escala.grupo_nome ? (
                              <>
                                <div style={{ fontSize: "11px", fontWeight: "700", color: "#111827", lineHeight: 1.3 }}>
                                  {escala.grupo_nome}
                                </div>
                                <div style={{
                                  fontSize: "9.5px", color: cor.accent,
                                  fontWeight: "600", marginTop: "1px",
                                  letterSpacing: "0.1px",
                                }}>
                                  {formatarLocal(escala.grupo_local)}
                                </div>
                              </>
                            ) : (
                              <div style={{ fontSize: "10.5px", color: "#9ca3af", fontStyle: "italic" }}>—</div>
                            )}
                          </div>

                          {/* Limpeza Semanal */}
                          <div style={{ padding: "6px 10px" }}>
                            {escala.limpeza_semanal_grupo_nome ? (
                              <>
                                <div style={{ fontSize: "11px", fontWeight: "700", color: "#111827", lineHeight: 1.3 }}>
                                  {escala.limpeza_semanal_grupo_nome}
                                </div>
                                <div style={{
                                  fontSize: "9.5px", color: cor.accent,
                                  fontWeight: "600", marginTop: "1px",
                                  letterSpacing: "0.1px",
                                }}>
                                  {formatarLocal(escala.limpeza_semanal_grupo_local ?? null)}
                                </div>
                              </>
                            ) : (
                              <div style={{ fontSize: "10.5px", color: "#9ca3af", fontStyle: "italic" }}>—</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Rodapé ── */}
        <div style={{
          marginTop: "auto",
          paddingTop: "7px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "8.5px", color: "#9ca3af" }}>
            Congregação Pq. Sabará — Escala de Limpeza do Salão
          </span>
          <span style={{ fontSize: "8.5px", color: "#9ca3af" }}>
            Impresso em {new Date().toLocaleDateString("pt-BR")}
          </span>
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
      <div ref={ref} style={{
        backgroundColor: "white",
        color: "black",
        padding: "8mm 10mm",
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        margin: "0 auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "5px",
          marginBottom: "8px",
          borderBottom: "2px solid #333",
          flexShrink: 0
        }}>
          <h1 style={{ fontSize: "13px", fontWeight: "bold", margin: 0, color: "#000" }}>Parque Sabará - Taubaté SP</h1>
          <h2 style={{ fontSize: "13px", fontWeight: "bold", margin: 0, color: "#000" }}>Dirigentes de Campo - {getMesAno(mes, ano)}</h2>
        </div>

        {/* Tabela */}
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          fontSize: "9px",
          flex: 1
        }}>
          <thead>
            <tr style={{ backgroundColor: "#059669" }}>
              <th style={{ padding: "5px 8px", border: "1px solid #999", color: "white", textAlign: "left", width: "25%" }}>Data</th>
              <th style={{ padding: "5px 8px", border: "1px solid #999", color: "white", textAlign: "left", width: "75%" }}>Dirigente</th>
            </tr>
          </thead>
          <tbody>
            {escalas.map((escala, i) => (
              <tr key={escala.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f5f5f5" }}>
                <td style={{ padding: "5px 8px", border: "1px solid #ddd", fontWeight: "500" }}>{formatarData(escala.data)}</td>
                <td style={{ padding: "5px 8px", border: "1px solid #ddd" }}>{escala.dirigente_nome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Rodapé */}
        <div style={{
          textAlign: "center",
          fontSize: "8px",
          color: "#666",
          padding: "5px",
          marginTop: "auto",
          borderTop: "1px solid #ccc",
          flexShrink: 0
        }}>
          Congregação Pq. Sabará - {getMesAno(mes, ano)}
        </div>
      </div>
    )
  }
)
PrintServicoCampo.displayName = "PrintServicoCampo"

// =====================================
// PROGRAMAÇÃO DA CONGREGAÇÃO (EQUIPE TÉCNICA)
// =====================================
interface DesignacaoTecnica {
  id: string
  data: string
  dia_semana: string
  indicador1: string | null
  indicador2: string | null
  mic_volante1: string | null
  mic_volante2: string | null
  audio_video: string | null
  palco: string | null
}

interface ReuniaoPublicaDesig {
  id: string
  data: string
  presidente: string | null
  leitor_sentinela: string | null
}

interface ArranjoDiscurso {
  id: string
  data: string
  tema: string | null
  orador: string | null
  congregacao: string | null
  salao: string | null
}

interface AssistenciaReuniao {
  id: string
  data: string
  dia_semana: string
  presencial: number
  zoom: number
}

interface ProgramacaoCongregacaoProps {
  mes: number
  ano: number
  designacoesTecnicas: DesignacaoTecnica[]
  reunioesPublicas: ReuniaoPublicaDesig[]
  discursos: ArranjoDiscurso[]
  assistencias: AssistenciaReuniao[]
}

// Função para formatar data curta (ex: "02/04")
const formatarDataCurta = (data: string) => {
  const d = new Date(data + "T12:00:00")
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
}

// Função para formatar dia da semana
const formatarDiaSemana = (data: string) => {
  const d = new Date(data + "T12:00:00")
  const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
  return dias[d.getDay()]
}

export const PrintProgramacaoCongregacao = forwardRef<HTMLDivElement, ProgramacaoCongregacaoProps>(
  ({ mes, ano, designacoesTecnicas, reunioesPublicas, discursos, assistencias }, ref) => {
    
    // Agrupar por semanas (quinta + domingo)
    const semanas: { quinta?: DesignacaoTecnica; domingo?: DesignacaoTecnica; reuniaoPublica?: ReuniaoPublicaDesig; discurso?: ArranjoDiscurso }[] = []
    
    // Ordenar por data
    const todasDatas = [...designacoesTecnicas].sort((a, b) => a.data.localeCompare(b.data))
    
    // Agrupar quinta com seu domingo seguinte
    let semanaAtual: typeof semanas[0] = {}
    todasDatas.forEach(d => {
      if (d.dia_semana === 'QUINTA') {
        if (semanaAtual.quinta) {
          semanas.push(semanaAtual)
          semanaAtual = {}
        }
        semanaAtual.quinta = d
      } else if (d.dia_semana === 'DOMINGO') {
        semanaAtual.domingo = d
        // Buscar reunião pública e discurso para este domingo
        semanaAtual.reuniaoPublica = reunioesPublicas.find(r => r.data === d.data)
        semanaAtual.discurso = discursos.find(disc => disc.data === d.data)
        semanas.push(semanaAtual)
        semanaAtual = {}
      }
    })
    if (semanaAtual.quinta || semanaAtual.domingo) {
      semanas.push(semanaAtual)
    }

    return (
      <div ref={ref} className="programacao-print" style={{ 
        backgroundColor: "white", 
        padding: "5mm 8mm", 
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        margin: "0 auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Cabeçalho */}
        <div style={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #374151",
          paddingBottom: "5px",
          marginBottom: "8px",
          flexShrink: 0
        }}>
          <div style={{ fontSize: "13px", fontWeight: "bold", color: "#111827" }}>
            Parque Sabará — Taubaté SP
          </div>
          <div style={{ fontSize: "13px", fontWeight: "bold", color: "#111827" }}>
            Programação da Congregação
          </div>
        </div>

        {/* Banner do mês */}
        <div style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "6px 10px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "11px",
          marginBottom: "8px",
          borderRadius: "3px",
          flexShrink: 0,
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          {getMesAno(mes, ano).toUpperCase()}
        </div>

        {/* Tabela de Equipe Técnica */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ 
            backgroundColor: "#2a6b77",
            color: "white",
            padding: "5px 10px",
            fontWeight: "bold",
            fontSize: "10px",
            marginBottom: "1px",
            borderRadius: "3px 3px 0 0"
          }}>
            DESIGNAÇÕES TÉCNICAS
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", width: "10%" }}>Data</th>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>Indicadores</th>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>Mic. Volante</th>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>Áudio e Vídeo</th>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>Palco</th>
              </tr>
            </thead>
            <tbody>
              {designacoesTecnicas.map((d, i) => {
                const diaSemana = new Date(d.data + "T12:00:00").getDay()
                const isQuinta = diaSemana === 4
                const isDomingo = diaSemana === 0
                return (
                <tr key={d.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f9fafb" }}>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", fontWeight: "bold" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                      <span style={{
                        display: "inline-block",
                        backgroundColor: isQuinta ? "#2563eb" : isDomingo ? "#16a34a" : "#6b7280",
                        color: "white",
                        borderRadius: "4px",
                        padding: "0px 4px",
                        fontSize: "7px",
                        fontWeight: "800",
                        letterSpacing: "0.3px",
                      }}>
                        {isQuinta ? "QUI" : isDomingo ? "DOM" : "—"}
                      </span>
                      {formatarDataCurta(d.data)}
                    </div>
                  </td>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                    {d.indicador1}{d.indicador2 ? ` / ${d.indicador2}` : ""}
                  </td>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                    {d.mic_volante1}{d.mic_volante2 ? ` / ${d.mic_volante2}` : ""}
                  </td>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>{d.audio_video || "-"}</td>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>{d.palco || "-"}</td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Reunião Pública */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ 
            backgroundColor: "#c69214",
            color: "white",
            padding: "5px 10px",
            fontWeight: "bold",
            fontSize: "10px",
            marginBottom: "1px",
            borderRadius: "3px 3px 0 0"
          }}>
            REUNIÃO PÚBLICA — PRESIDENTE E LEITOR
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", width: "18%" }}>Data</th>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", width: "41%" }}>Presidente de Conferência</th>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", width: "41%" }}>Leitor de A Sentinela</th>
              </tr>
            </thead>
            <tbody>
              {reunioesPublicas.map((r, i) => (
                <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f9fafb" }}>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", fontWeight: "bold" }}>
                    {formatarDataCurta(r.data)}
                  </td>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>{r.presidente || "-"}</td>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>{r.leitor_sentinela || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Arranjo de Discursos */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ 
            backgroundColor: "#8b2332",
            color: "white",
            padding: "5px 10px",
            fontWeight: "bold",
            fontSize: "10px",
            marginBottom: "1px",
            borderRadius: "3px 3px 0 0"
          }}>
            ARRANJO DE DISCURSOS
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", width: "12%" }}>Data</th>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", width: "40%" }}>Tema</th>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", width: "24%" }}>Orador</th>
                <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", width: "24%" }}>Salão</th>
              </tr>
            </thead>
            <tbody>
              {discursos.map((d, i) => (
                <tr key={d.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f9fafb" }}>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", fontWeight: "bold" }}>
                    {formatarDataCurta(d.data)}
                  </td>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb" }}>{d.tema || "-"}</td>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                    {d.orador || "-"}
                    {d.congregacao && (
                      <div style={{ fontSize: "7px", color: "#6b7280", marginTop: "1px" }}>{d.congregacao}</div>
                    )}
                  </td>
                  <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", color: d.salao ? "#1e3a5f" : "#9ca3af", fontStyle: d.salao ? "normal" : "italic" }}>
                    {d.salao || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Assistência às Reuniões */}
        {assistencias.length > 0 && (
          <div style={{ marginBottom: "8px", flex: 1 }}>
            <div style={{ 
              backgroundColor: "#374151",
              color: "white",
              padding: "5px 10px",
              fontWeight: "bold",
              fontSize: "10px",
              marginBottom: "1px",
              borderRadius: "3px 3px 0 0"
            }}>
              ASSISTÊNCIA ÀS REUNIÕES
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>Data</th>
                  <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>Dia</th>
                  <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>Presencial</th>
                  <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>Zoom</th>
                  <th style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {assistencias.map((a, i) => (
                  <tr key={a.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>{formatarDataCurta(a.data)}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>{a.dia_semana}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>{a.presencial}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center" }}>{a.zoom}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid #e5e7eb", textAlign: "center", fontWeight: "bold" }}>{a.presencial + a.zoom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }
)
PrintProgramacaoCongregacao.displayName = "PrintProgramacaoCongregacao"
