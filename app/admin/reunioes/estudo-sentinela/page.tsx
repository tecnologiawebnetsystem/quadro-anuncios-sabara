"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Music, Target, ChevronDown, ChevronUp } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Pergunta {
  paragrafo: string
  pergunta: string
  resposta: string
}

interface Estudo {
  id: number
  semana: string
  dataInicio: string
  dataFim: string
  cantico: number
  titulo: string
  textoTema: string
  objetivo: string
  perguntas: Pergunta[]
}

const estudosMarco: Estudo[] = [
  {
    id: 1,
    semana: "Semana 1",
    dataInicio: "2 de março",
    dataFim: "8 de março",
    cantico: 97,
    titulo: "Continue cuidando da sua 'necessidade espiritual'",
    textoTema: "Felizes os que têm consciência de sua necessidade espiritual. — Mateus 5:3",
    objetivo: "Ver como podemos continuar nos beneficiando de tudo o que Jeová nos dá para ficarmos bem alimentados, vestidos e protegidos em sentido espiritual.",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "Com que necessidades básicas Jeová nos criou? (Mateus 5:3)",
        resposta: "Jeová criou os humanos com necessidades físicas básicas como comida, roupa e abrigo. Além disso, ele nos criou com uma necessidade espiritual. Para sermos felizes de verdade, precisamos ter consciência dessa necessidade e continuar cuidando dela."
      },
      {
        paragrafo: "2",
        pergunta: "Que ilustração nos ajuda a entender o que significa 'ter consciência de nossa necessidade espiritual'?",
        resposta: "A expressão passa a ideia de alguém saber que é pobre, ou mendigo, em sentido espiritual. Podemos imaginar um mendigo vestindo trapos, sentado numa calçada, fraco por não ter o que comer. Da mesma forma, quem tem consciência da sua necessidade espiritual — um mendigo do espírito — precisa de ajuda para melhorar sua situação e quer muito aproveitar tudo o que Jeová dá."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        resposta: "Vamos aprender com uma mulher da Fenícia que implorou pela ajuda de Jesus. Esse relato destaca três qualidades que aqueles que têm consciência de sua necessidade espiritual precisam desenvolver. Depois vamos considerar os exemplos de Pedro, Paulo e Davi, homens que cuidaram de sua necessidade espiritual."
      },
      {
        paragrafo: "4",
        pergunta: "Por que uma mulher fenícia foi até Jesus?",
        resposta: "A filha dela estava 'possuída por um demônio que a atormentava cruelmente'. A mulher se ajoelhou e implorou que Jesus a ajudasse."
      },
      {
        paragrafo: "5",
        pergunta: "Que qualidades a mulher fenícia demonstrou e qual foi a reação de Jesus?",
        resposta: "A mulher fenícia mostrou verdadeira humildade, persistência e fé. Ela não ficou ofendida quando Jesus a comparou a um cachorrinho. Continuou implorando porque tinha fé em Jesus. E Jesus ficou tão impressionado com a fé dela que expulsou o demônio que atormentava a filha dela."
      },
      {
        paragrafo: "6",
        pergunta: "O que aprendemos com o exemplo da mulher fenícia?",
        resposta: "Para cuidarmos de nossa necessidade espiritual, temos que desenvolver humildade, persistência e uma forte fé. Apenas uma pessoa humilde persiste em implorar a ajuda de Deus. Precisamos também ter uma forte fé em Jesus Cristo e confiar naqueles que ele está usando para orientar os seus discípulos."
      },
      {
        paragrafo: "7",
        pergunta: "Que responsabilidade Pedro recebeu, mas o que ele precisava fazer? (Hebreus 5:14–6:1)",
        resposta: "Jesus disse a Pedro: 'Alimente as minhas ovelhinhas.' Pedro cuidou dessa responsabilidade de modo fiel e Jeová até o usou para escrever duas cartas da Bíblia. Mesmo assim, Pedro também precisava se alimentar espiritualmente. Ele estudava as cartas de Paulo, reconhecendo que algumas coisas eram 'difíceis de entender', mas persistiu em estudar com fé."
      },
      {
        paragrafo: "8",
        pergunta: "Como Pedro reagiu a uma nova orientação que recebeu de um anjo?",
        resposta: "Pedro teve uma visão onde um anjo disse para matar e comer animais impuros segundo a Lei mosaica. De início, Pedro resistiu, mas depois entendeu a vontade de Jeová e ajustou seu modo de pensar. Pouco depois, ele aceitou o convite de ir até a casa de Cornélio, um não judeu, e teve a alegria de vê-los aceitar a verdade e ser batizados."
      },
      {
        paragrafo: "9",
        pergunta: "Que dois motivos temos para desenvolver um forte desejo por alimento espiritual sólido?",
        resposta: "Primeiro, vamos aprender coisas sobre Jeová que aumentam nosso amor e respeito por ele. Segundo, vamos ficar mais motivados a falar com outros sobre o nosso maravilhoso Pai celestial. Quando nosso entendimento é ajustado, precisamos ser rápidos para adaptar nosso modo de pensar e agir."
      },
      {
        paragrafo: "10",
        pergunta: "De acordo com Colossenses 3:8-10, o que envolve estar bem vestido em sentido espiritual?",
        resposta: "Devemos nos 'despir da velha personalidade' e nos 'revestir da nova personalidade'. Fazer isso é um processo contínuo, que exige tempo e esforço. Paulo, quando jovem, não tinha conhecimento exato da vontade de Deus e era uma pessoa 'insolente', com várias características ruins de personalidade."
      },
      {
        paragrafo: "11",
        pergunta: "Contra que característica de personalidade Paulo lutava? Explique.",
        resposta: "Paulo ficava irado com facilidade. Antes de se tornar cristão, ele tinha tanta raiva dos discípulos de Jesus que 'respirava ameaça e morte' contra eles. Depois de se tornar cristão, se esforçou para abandonar essa característica. Certa vez ele e Barnabé tiveram 'um forte acesso de ira', mas Paulo não desistiu de lutar contra suas imperfeições."
      },
      {
        paragrafo: "12",
        pergunta: "O que ajudou Paulo a conseguir fazer mudanças na sua personalidade?",
        resposta: "Paulo era humilde e não confiava em si mesmo. Ele confiava 'na força que Deus fornece'. Às vezes ele se sentia um fracasso, mas quando ficava desanimado, pensava nas coisas boas que seu Pai celestial já tinha feito por ele. Isso o deixava mais determinado a persistir em fazer mudanças."
      },
      {
        paragrafo: "13",
        pergunta: "Como podemos imitar Paulo?",
        resposta: "Podemos reconhecer que, não importa há quanto tempo servimos a Jeová, precisamos continuar usando a vestimenta espiritual que ele nos dá. Se voltarmos a mostrar uma característica ruim, não precisamos achar que somos um fracasso. Devemos continuar tentando mudar. Nós é que precisamos nos ajustar à vestimenta espiritual que Jeová nos dá."
      },
      {
        paragrafo: "14-15",
        pergunta: "De que forma Jeová protege seus servos em sentido espiritual? (Salmo 27:5)",
        resposta: "Jeová protege seus servos de qualquer coisa ou pessoa que possa destruir sua fé nele. Ele promete que nenhuma arma fabricada contra nós vai ser bem-sucedida. Mesmo que tirem nossa vida, Jeová é capaz de nos trazer de volta na ressurreição. Ele também nos ajuda a lidar com ansiedades e nos dá irmãos para nos apoiar e anciãos para nos pastorear."
      },
      {
        paragrafo: "16",
        pergunta: "De que maneiras Jeová protegeu Davi?",
        resposta: "Quando Davi seguia os padrões de Jeová, ele era protegido porque Jeová o ajudava a tomar decisões sábias que traziam felicidade. Por outro lado, quando ignorava esses padrões, Davi não era protegido das consequências de suas ações. Quando sofria por causa de outros, ele contava para Jeová suas ansiedades, e Jeová o consolava e acalmava."
      },
      {
        paragrafo: "17",
        pergunta: "Como podemos imitar Davi?",
        resposta: "Podemos buscar as orientações de Jeová antes de tomar decisões. Entendemos que às vezes sofremos não porque Jeová deixou de nos proteger, mas porque nós tomamos decisões ruins. Quando sofremos por causa de outros, abrimos nosso coração para Jeová, confiando que ele vai proteger nossa mente e nosso coração."
      },
      {
        paragrafo: "18",
        pergunta: "O que não devemos permitir, e como podemos continuar cuidando da nossa necessidade espiritual?",
        resposta: "Não devemos permitir que a atitude de pessoas infelizes nos influencie. Podemos continuar cuidando da nossa necessidade espiritual por aproveitar o alimento espiritual que Jeová provê, nos revestir da nova personalidade e buscar a proteção que Jeová nos dá."
      }
    ]
  },
  {
    id: 2,
    semana: "Semana 2",
    dataInicio: "9 de março",
    dataFim: "15 de março",
    cantico: 45,
    titulo: "Você é capaz de lutar contra sentimentos negativos!",
    textoTema: "Homem miserável que eu sou! — Romanos 7:24",
    objetivo: "Aprender a lidar com pensamentos e sentimentos negativos.",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "Como o apóstolo Paulo se sentia às vezes? E por que podemos nos identificar com ele? (Romanos 7:21-24)",
        resposta: "Paulo mostrou que tinha sentimentos que muitos de nós também temos. Mesmo sendo um cristão fiel, Paulo estava numa luta entre sua inclinação para fazer coisas erradas e seu desejo sincero de fazer a vontade de Deus. Às vezes, Paulo também tinha que lidar com sentimentos negativos relacionados a um problema persistente e a erros do passado."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        resposta: "Vamos considerar: Por que às vezes Paulo se sentia 'miserável'? Como ele lidava com sentimentos negativos? E como podemos ser bem-sucedidos na luta contra nossos sentimentos negativos?"
      },
      {
        paragrafo: "4",
        pergunta: "Que erros do passado afetavam Paulo?",
        resposta: "Antes de se tornar cristão, Paulo (Saulo) fez muitas coisas ruins. Por exemplo, ele aprovou o assassinato de um homem fiel chamado Estêvão. Além disso, Saulo liderou uma perseguição cruel contra os cristãos."
      },
      {
        paragrafo: "5",
        pergunta: "Como Paulo se sentia por causa de seus erros do passado?",
        resposta: "Depois que se tornou cristão, Paulo às vezes se sentia culpado pelas coisas que tinha feito. Ao longo dos anos, os erros do passado o deixaram cada vez mais triste. Em 1 Coríntios disse: 'Não sou digno de ser chamado apóstolo, porque perseguia a congregação de Deus.' Uns cinco anos depois, em Efésios, disse que era 'menor que o menor de todos os santos'."
      },
      {
        paragrafo: "6",
        pergunta: "Que problema persistente Paulo tinha?",
        resposta: "Paulo mencionou um 'espinho na carne' que o atormentava. Não sabemos exatamente o que era esse problema, mas pode ter sido uma doença, uma fraqueza física ou oposição persistente de inimigos. Paulo orou três vezes para que Jeová removesse esse problema, mas Jeová escolheu não fazer isso."
      },
      {
        paragrafo: "7",
        pergunta: "Como Jeová ajudou Paulo a lidar com seu problema persistente?",
        resposta: "Jeová disse a Paulo: 'Minha bondade imerecida é tudo o que você precisa, pois o meu poder se torna perfeito na fraqueza.' Paulo aceitou essa resposta com humildade. Em vez de ficar ressentido com Jeová, ele ficou contente com sua fraqueza para que 'o poder do Cristo pudesse continuar sobre ele como uma tenda'."
      },
      {
        paragrafo: "8-9",
        pergunta: "Por que Paulo não desistiu de servir a Jeová?",
        resposta: "Apesar de às vezes ter sentimentos negativos, Paulo nunca desistiu porque: (1) Sabia que Jeová o amava e tinha perdoado seus erros do passado. (2) Confiava nas palavras de Jesus de que a bondade imerecida de Deus seria suficiente para ele. (3) Se concentrava em ajudar outros e não ficava pensando demais em si mesmo."
      },
      {
        paragrafo: "10",
        pergunta: "O que devemos lembrar sobre erros do passado?",
        resposta: "Se já nos arrependemos sinceramente e pedimos perdão a Jeová, podemos ter certeza de que ele nos perdoou. Não devemos continuar nos punindo por erros que Jeová já perdoou. Devemos aceitar o perdão de Jeová assim como Paulo aceitou."
      },
      {
        paragrafo: "11",
        pergunta: "Como podemos lidar com problemas persistentes?",
        resposta: "Podemos orar a Jeová sobre nossos problemas, assim como Paulo fez. Se Jeová escolher não remover o problema, devemos aceitar isso com humildade, confiando que a bondade imerecida dele é suficiente para nós. Devemos nos concentrar em como Jeová pode nos dar força para lidar com o problema."
      },
      {
        paragrafo: "12",
        pergunta: "O que pode nos ajudar quando temos sentimentos negativos?",
        resposta: "Podemos nos concentrar em ajudar outros em vez de ficar pensando demais em nós mesmos. Participar no ministério e ajudar irmãos na congregação pode nos dar alegria e propósito. Também podemos pensar nas coisas boas que Jeová já fez por nós e nas bênçãos futuras que ele prometeu."
      },
      {
        paragrafo: "13-14",
        pergunta: "Que conselho prático Paulo deu para lidar com sentimentos negativos?",
        resposta: "Paulo aconselhou a 'continuar pensando' em coisas verdadeiras, sérias, justas, puras, amáveis e de boa reputação. Também devemos orar a Jeová sobre nossas ansiedades, e 'a paz de Deus, que excede todo entendimento, guardará nossos corações e nossas mentes por meio de Cristo Jesus'."
      },
      {
        paragrafo: "15-16",
        pergunta: "Como podemos ser bem-sucedidos na luta contra sentimentos negativos?",
        resposta: "Podemos: (1) Aceitar o perdão de Jeová por erros do passado. (2) Confiar que a bondade imerecida de Deus é suficiente para problemas persistentes. (3) Concentrar-nos em ajudar outros. (4) Pensar em coisas positivas. (5) Orar regularmente a Jeová."
      }
    ]
  },
  {
    id: 3,
    semana: "Semana 3",
    dataInicio: "16 de março",
    dataFim: "22 de março",
    cantico: 20,
    titulo: "Por que precisamos do resgate?",
    textoTema: "Quem me livrará do corpo que é submetido a essa morte? — Romanos 7:24",
    objetivo: "Ver como o resgate traz perdão, cura e reconciliação.",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "Por que precisamos que alguém nos resgate? (Romanos 7:22-24)",
        resposta: "Por Adão ter desobedecido seu Criador, ele se tornou pecador. Como somos descendentes de Adão, nós também somos pecadores. Por causa disso, todos os humanos ficaram presos debaixo dos escombros do pecado. Não podemos nos livrar das consequências disso sozinhos. Estamos em perigo e precisamos ser resgatados!"
      },
      {
        paragrafo: "3",
        pergunta: "De que formas o resgate nos salva?",
        resposta: "O resgate nos salva porque nos dá (1) o perdão dos nossos pecados, (2) a cura da nossa condição pecaminosa e (3) a reconciliação com nosso Criador. Por meio do resgate, temos esperança de vida eterna."
      },
      {
        paragrafo: "4-5",
        pergunta: "Por que todos nós precisamos do resgate? (Eclesiastes 7:20)",
        resposta: "Todo humano imperfeito comete pecados, seja em palavras ou em ações. Alguns pecados são bem graves, como adultério e assassinato. Mas até algo que falamos pode ser um pecado. Todos nós já dissemos algo que preferíamos não ter dito ou fizemos alguma coisa e depois nos arrependemos."
      },
      {
        paragrafo: "6-7",
        pergunta: "O que torna possível que Jeová perdoe nossos pecados?",
        resposta: "O resgate é o que torna possível que Jeová perdoe nossos pecados. Por causa de sua justiça perfeita, é preciso existir uma base sólida para ele perdoar. Os sacrifícios de animais da Lei mosaica mostravam que os humanos precisavam de um sacrifício muito maior. Foi o sacrifício de Jesus que deu a base para Jeová perdoar nossos pecados."
      },
      {
        paragrafo: "8",
        pergunta: "No que você pode pensar enquanto se prepara para a Celebração deste ano?",
        resposta: "Graças ao resgate, você não precisa ficar carregando o peso da culpa por pecados que cometeu no passado e já se arrependeu. Se achar difícil perdoar a si mesmo, lembre-se de que é Jeová quem perdoa, e ele está 'sempre pronto a perdoar'. Podemos confiar totalmente nisso."
      },
      {
        paragrafo: "9",
        pergunta: "Além de ações erradas, o que o pecado envolve? (Salmo 51:5 e nota)",
        resposta: "Na Bíblia, a palavra 'pecado' se refere não só a uma ação errada, mas também a uma condição que herdamos desde o momento em que fomos concebidos. Por causa dessa condição, além de termos a tendência de fazer coisas erradas, nosso corpo não funciona como Jeová projetou, e ficamos doentes, envelhecemos e morremos."
      },
      {
        paragrafo: "10",
        pergunta: "Como a condição pecaminosa de Adão e Eva os afetou?",
        resposta: "O pecado produziu uma mudança drástica dentro deles. Eles começaram a sentir imediatamente as consequências de desobedecer a lei de Deus. Perceberam que algo no seu íntimo tinha mudado, não para melhor. Pela primeira vez, Adão e Eva tiveram sentimentos de culpa, ansiedade, insegurança, dor e vergonha."
      },
      {
        paragrafo: "11",
        pergunta: "Que efeito nossa condição pecaminosa tem em nós?",
        resposta: "Nossa condição pecaminosa nos faz sentir culpa, vergonha e ansiedade. É por causa da imperfeição que sofremos em sentido físico e emocional. Não importa o quanto tentemos melhorar nossa situação, não conseguimos ter uma vida livre de problemas. Fomos 'sujeitos à futilidade'."
      },
      {
        paragrafo: "12",
        pergunta: "Que esperança o resgate nos dá?",
        resposta: "O resgate nos dá a esperança de que 'a própria criação será libertada da escravidão à decadência'. No novo mundo de Deus, quando nos tornarmos perfeitos, não vamos mais ser atormentados por doenças físicas, mentais e emocionais. Nem teremos mais sentimentos como culpa, ansiedade, insegurança, dor ou vergonha."
      },
      {
        paragrafo: "13",
        pergunta: "Em que você pode pensar enquanto se prepara para a Celebração deste ano?",
        resposta: "Pense em como será sua vida quando você não for mais imperfeito. Imagine acordar todo dia se sentindo bem, e nunca mais se preocupar se você e as pessoas que você ama vão passar fome, ficar doentes ou morrer. Você pode encontrar paz por se 'apegar firmemente à esperança como âncora para a alma'."
      },
      {
        paragrafo: "14",
        pergunta: "De que forma o pecado afeta nossa amizade com o Criador, e por quê?",
        resposta: "Desde que Adão e Eva pecaram, os humanos ficaram separados de seu Criador. A Bíblia diz que há inimizade entre a humanidade e Deus. Os padrões de Jeová são perfeitos, por isso é impossível que ele simplesmente ignore o pecado. O pecado criou um abismo entre Deus e o homem."
      },
      {
        paragrafo: "15",
        pergunta: "De que forma a morte de Jesus permitiu que Jeová recuperasse a amizade com os humanos?",
        resposta: "Jesus é 'um sacrifício propiciatório pelos nossos pecados', um 'meio de pacificação'. O resgate satisfez o padrão de justiça de Jeová. Agora ele tinha uma base para restabelecer a amizade entre ele e a humanidade. Jeová podia até 'creditar' justiça àqueles que o adoraram fielmente antes da morte de Cristo."
      },
      {
        paragrafo: "16",
        pergunta: "Em que outras coisas você pode meditar enquanto se prepara para a Celebração deste ano?",
        resposta: "Pense no que a reconciliação com Deus significa para você. Você pode se referir a Jeová como seu 'Pai' e seu 'Amigo'. Mas devemos fazer isso com reverência e humildade, pois somos imperfeitos e não merecemos isso. É apenas por causa do resgate que podemos ter a alegria de ter uma amizade com Jeová."
      },
      {
        paragrafo: "17",
        pergunta: "Como o resgate prova que Jeová é muito misericordioso? (Efésios 2:4,5)",
        resposta: "O resgate deixa claro que Jeová é 'rico em misericórdia'. Ele 'nos deu vida quando estávamos mortos por causa das nossas falhas'. Os que têm 'a disposição correta para com a vida eterna' sabem que estão presos debaixo dos escombros do pecado e precisam ser libertados. Por isso, eles gritam por ajuda, e Jeová responde."
      },
      {
        paragrafo: "18",
        pergunta: "Ao meditar no resgate, do que precisamos nos lembrar?",
        resposta: "Em vez de ver o resgate como algo apenas para nosso benefício, devemos lembrar que é por meio do resgate que Jeová está respondendo ao desafio que Satanás lançou no Éden. Jeová também usa o resgate para santificar seu nome e limpá-lo de todas as mentiras de Satanás. O resgate é uma maneira de Jeová mostrar que é um Deus de amor."
      }
    ]
  },
  {
    id: 4,
    semana: "Semana 4",
    dataInicio: "23 de março",
    dataFim: "29 de março",
    cantico: 18,
    titulo: "Como você vai mostrar sua gratidão pelo resgate?",
    textoTema: "O amor do Cristo nos impele. — 2 Coríntios 5:14",
    objetivo: "Ver como todos nós podemos mostrar que somos gratos pelo resgate.",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "O que o resgate de Jesus nos impele a fazer, e por quê? (2 Coríntios 5:14,15)",
        resposta: "O resgate é uma prova do amor de Jesus pelas pessoas — um amor que ele já sentia muito tempo antes de vir à Terra. Paulo escreveu que 'o amor do Cristo nos impele'. Isso quer dizer que o amor de Jesus por nós deve nos motivar a agir, a fazer algo para mostrar que somos muito gratos e que nunca vamos esquecer do sacrifício que ele fez por nós."
      },
      {
        paragrafo: "3",
        pergunta: "Por que cada pessoa talvez tenha uma maneira diferente de mostrar gratidão pelo resgate?",
        resposta: "Assim como três pessoas viajando para o mesmo lugar, mas saindo de cidades diferentes, vão percorrer caminhos diferentes, o 'caminho' que você vai percorrer para mostrar gratidão pelo resgate depende de onde você está agora no que diz respeito à sua amizade com Jeová."
      },
      {
        paragrafo: "4",
        pergunta: "No que Jeová presta atenção ao ver os estudantes da Bíblia?",
        resposta: "O fato de a pessoa querer aprender sobre Jeová e a Bíblia indica que Jeová está atraindo ela a ele. 'É Jeová quem examina os corações.' Isso quer dizer que ele presta atenção na pessoa, vê seus esforços de aprender sobre ele e fica muito feliz com seu progresso e as mudanças que ela faz para ser amiga dele."
      },
      {
        paragrafo: "5",
        pergunta: "Como os estudantes da Bíblia podem mostrar gratidão pelo resgate?",
        resposta: "Uma maneira é por seguir o conselho de Paulo aos filipenses: 'Seja qual for o progresso que já fez, continue andando na mesma direção.' Não é preciso esperar até se batizar para começar a mostrar gratidão pelo resgate. Os estudantes podem continuar progredindo espiritualmente e fazer mudanças para agradar a Jeová."
      },
      {
        paragrafo: "6-7",
        pergunta: "Como os cristãos batizados podem mostrar gratidão pelo resgate?",
        resposta: "Os cristãos batizados podem lembrar que foi o resgate que tornou possível a sua dedicação a Jeová. Podem mostrar gratidão por continuar sendo fiéis a essa dedicação. Também podem participar regularmente na pregação das boas novas e ajudar outros a aprender sobre Jeová e o resgate."
      },
      {
        paragrafo: "8-9",
        pergunta: "O que as ovelhas que se afastaram do rebanho podem fazer?",
        resposta: "Se você se afastou da congregação, Jeová ainda ama você e quer que você volte. Ele é como o pastor que deixa as 99 ovelhas para procurar a que se perdeu. Você pode mostrar gratidão pelo resgate por dar passos para voltar a Jeová. Os anciãos estão prontos para ajudá-lo com bondade e compaixão."
      },
      {
        paragrafo: "10-11",
        pergunta: "Por que a Celebração é tão importante?",
        resposta: "Jesus mandou que seus discípulos comemorassem a sua morte. A Celebração é a única comemoração que Jesus mandou seus discípulos observar. É uma ocasião para mostrar gratidão pelo resgate e lembrar do que Jeová e Jesus fizeram por nós. Assistir à Celebração mostra que valorizamos o resgate."
      },
      {
        paragrafo: "12",
        pergunta: "O que você está determinado a fazer?",
        resposta: "Estou determinado a mostrar minha gratidão pelo resgate todos os dias, não apenas na época da Celebração. Quero viver de um modo que honre a Jeová e mostre que valorizo o sacrifício de Jesus. Quero ajudar outros a aprender sobre o resgate para que eles também possam se beneficiar dele."
      }
    ]
  }
]

export default function EstudoSentinelaPage() {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (estudoId: number, perguntaIndex: number) => {
    const key = `${estudoId}-${perguntaIndex}`
    setExpandedRows(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const isRowExpanded = (estudoId: number, perguntaIndex: number) => {
    const key = `${estudoId}-${perguntaIndex}`
    return expandedRows[key] || false
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estudo de A Sentinela</h1>
          <p className="text-muted-foreground">Março de 2026</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <BookOpen className="w-5 h-5 mr-2" />
          4 Estudos
        </Badge>
      </div>

      <Tabs defaultValue="semana1" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          {estudosMarco.map((estudo) => (
            <TabsTrigger 
              key={estudo.id} 
              value={`semana${estudo.id}`}
              className="flex flex-col py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span className="font-semibold">{estudo.semana}</span>
              <span className="text-xs opacity-80">{estudo.dataInicio} - {estudo.dataFim}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {estudosMarco.map((estudo) => (
          <TabsContent key={estudo.id} value={`semana${estudo.id}`} className="mt-6 space-y-6">
            {/* Cabeçalho do Estudo */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-primary text-primary-foreground">
                        <Music className="w-3 h-3 mr-1" />
                        Cântico {estudo.cantico}
                      </Badge>
                      <Badge variant="outline">
                        {estudo.dataInicio} - {estudo.dataFim} de 2026
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{estudo.titulo}</CardTitle>
                    <p className="text-sm text-muted-foreground italic">
                      &ldquo;{estudo.textoTema}&rdquo;
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <Target className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-sm">Objetivo:</span>
                    <p className="text-sm text-muted-foreground">{estudo.objetivo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Perguntas e Respostas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Perguntas e Respostas ({estudo.perguntas.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-20 text-center font-semibold">Par.</TableHead>
                      <TableHead className="font-semibold">Pergunta</TableHead>
                      <TableHead className="w-16 text-center">Ver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estudo.perguntas.map((pergunta, index) => (
                      <>
                        <TableRow 
                          key={`pergunta-${estudo.id}-${index}`}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleRow(estudo.id, index)}
                        >
                          <TableCell className="text-center font-mono font-semibold text-primary">
                            {pergunta.paragrafo}
                          </TableCell>
                          <TableCell className="font-medium">
                            {pergunta.pergunta}
                          </TableCell>
                          <TableCell className="text-center">
                            {isRowExpanded(estudo.id, index) ? (
                              <ChevronUp className="w-5 h-5 mx-auto text-primary" />
                            ) : (
                              <ChevronDown className="w-5 h-5 mx-auto text-muted-foreground" />
                            )}
                          </TableCell>
                        </TableRow>
                        {isRowExpanded(estudo.id, index) && (
                          <TableRow key={`resposta-${estudo.id}-${index}`}>
                            <TableCell colSpan={3} className="bg-green-50 dark:bg-green-950/30 p-0">
                              <div className="p-4 border-l-4 border-green-500">
                                <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                                  Resposta:
                                </p>
                                <p className="text-sm text-foreground leading-relaxed">
                                  {pergunta.resposta}
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
