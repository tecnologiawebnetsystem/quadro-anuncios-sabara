"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Music, Target, ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
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

interface PerguntaRecapitulacao {
  pergunta: string
  resposta: string
}

interface Estudo {
  id: number
  semana: string
  dataInicio: string
  dataFim: string
  canticoInicial: number
  canticoFinal: number
  titulo: string
  textoTema: string
  objetivo: string
  perguntas: Pergunta[]
  recapitulacao: PerguntaRecapitulacao[]
}

const estudosMarco: Estudo[] = [
  {
    id: 1,
    semana: "Semana 1",
    dataInicio: "2 de março",
    dataFim: "8 de março",
    canticoInicial: 97,
    canticoFinal: 162,
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
    ],
    recapitulacao: [
      {
        pergunta: "O que podemos fazer para aproveitar bem o ALIMENTO ESPIRITUAL que Jeová nos dá?",
        resposta: "Devemos nos alimentar regularmente das verdades básicas da Palavra de Deus. Também devemos desenvolver o desejo por alimento espiritual sólido, reservando tempo e nos esforçando para entender mais a fundo a Palavra de Deus. Quando nosso entendimento de uma verdade bíblica é ajustado, precisamos ser rápidos para adaptar nosso modo de pensar e de agir."
      },
      {
        pergunta: "O que podemos fazer para aproveitar bem a VESTIMENTA ESPIRITUAL que Jeová nos dá?",
        resposta: "Devemos nos despir da velha personalidade e nos revestir da nova personalidade. Se voltarmos a mostrar uma característica ruim, não devemos achar que somos um fracasso. Devemos continuar tentando mudar nosso modo de pensar e agir. Precisamos nos ajustar à vestimenta espiritual que Jeová nos dá, não o contrário."
      },
      {
        pergunta: "O que podemos fazer para aproveitar bem a PROTEÇÃO ESPIRITUAL que Jeová nos dá?",
        resposta: "Devemos buscar as orientações de Jeová antes de tomar decisões. Quando sofremos por causa de nossas próprias decisões ruins, não devemos achar que Jeová deixou de nos proteger. Quando sofremos por causa das ações de outros, devemos abrir nosso coração para Jeová, confiando que ele vai proteger nossa mente e nosso coração."
      }
    ]
  },
  {
    id: 2,
    semana: "Semana 2",
    dataInicio: "9 de março",
    dataFim: "15 de março",
    canticoInicial: 45,
    canticoFinal: 34,
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
        resposta: "Vamos considerar as perguntas: Por que às vezes Paulo se sentia 'miserável'? Como ele lidava com sentimentos negativos? E como podemos ser bem-sucedidos na luta contra nossos sentimentos negativos?"
      },
      {
        paragrafo: "4",
        pergunta: "Por que Paulo teve sentimentos negativos?",
        resposta: "Antes de se tornar cristão, Paulo (Saulo) fez muitas coisas ruins. Ele aprovou o assassinato de um homem fiel chamado Estêvão e liderou uma perseguição cruel contra os cristãos."
      },
      {
        paragrafo: "5",
        pergunta: "Como Paulo se sentiu por causa do que tinha feito?",
        resposta: "Depois que se tornou cristão, Paulo às vezes se sentiu culpado pelas coisas que tinha feito. Os erros do passado o deixaram cada vez mais triste. Ele disse: 'Não sou digno de ser chamado apóstolo, porque persegui a congregação de Deus.' Mais tarde, falou que era 'menor que o menor de todos os santos'."
      },
      {
        paragrafo: "6",
        pergunta: "Que outra coisa deixava Paulo ansioso?",
        resposta: "Paulo falou de um problema que era como 'um espinho na carne'. Pode ter sido um problema físico, emocional ou alguma outra coisa. Isso trazia muita dor para ele e o deixava ansioso."
      },
      {
        paragrafo: "7",
        pergunta: "Como Paulo se sentiu por causa das suas imperfeições? (Romanos 7:18,19)",
        resposta: "Paulo às vezes se sentia desanimado por causa das suas imperfeições. Ele queria fazer o que era certo, mas se sentia incapaz. Paulo reconheceu que estava sempre lutando para não seguir suas tendências erradas e se esforçava muito para melhorar a sua personalidade."
      },
      {
        paragrafo: "8",
        pergunta: "O que Paulo fazia para lidar com suas imperfeições?",
        resposta: "Paulo pensava em quais eram seus pontos fracos, buscava a orientação das Escrituras e identificava os passos necessários para vencer essa luta. Ele meditava em como ele e outros cristãos podiam lutar contra tendências erradas e melhorar sua personalidade com a ajuda do espírito santo."
      },
      {
        paragrafo: "9-10",
        pergunta: "O que ajudou Paulo a lutar contra sentimentos negativos? (Efésios 1:7)",
        resposta: "Paulo via o resgate como um presente especial de Deus para ele. Ele tinha certeza de que receberia o perdão de Jeová por meio do sacrifício de Jesus Cristo. Assim, ele podia continuar 'prestando serviço sagrado' a Deus com alegria, apesar de erros do passado e de suas imperfeições."
      },
      {
        paragrafo: "11",
        pergunta: "Como o exemplo de Paulo faz você se sentir?",
        resposta: "É animador pensar na situação difícil que Paulo enfrentou. Fica aliviador saber que não somos os únicos a nos sentir assim. O exemplo dele também nos lembra que Jeová entende os desafios que seus servos enfrentam."
      },
      {
        paragrafo: "12",
        pergunta: "Como manter uma boa rotina espiritual nos ajuda?",
        resposta: "Desenvolver uma boa rotina espiritual nos ajuda a focar em coisas positivas. Assim como geralmente nos alimentar bem, fazer exercícios regularmente e dormir o suficiente contribui para nosso bem-estar, ler a Palavra de Deus regularmente, preparar e assistir às reuniões e ir ao campo nos anima e nos ajuda a lidar com pensamentos negativos."
      },
      {
        paragrafo: "13-14",
        pergunta: "Dê exemplos que mostram como faz bem ter uma boa rotina espiritual.",
        resposta: "John, ao descobrir que tinha câncer, fez questão que sua família continuasse tendo uma rotina espiritual: assistir a todas as reuniões, ir ao campo toda semana e fazer adoração em família regularmente. Eliza diz: 'Toda vez que vou às reuniões e faço o meu estudo pessoal, eu tenho mais certeza de que Jeová me escuta e me ama. Isso me deixa feliz.'"
      },
      {
        paragrafo: "15",
        pergunta: "O que mais podemos fazer para superar pensamentos negativos? Ilustre.",
        resposta: "Assim como para melhorar uma dor nas costas pode ser preciso pesquisar mais sobre o assunto e até falar com um médico, para lidar com sentimentos negativos podemos fazer pesquisas usando a Bíblia e nossas publicações e até conversar com um irmão maduro."
      },
      {
        paragrafo: "16",
        pergunta: "O que pode ajudar você a identificar a causa dos seus sentimentos negativos? (Salmo 139:1-4,23,24)",
        resposta: "O rei Davi sabia que Jeová o conhecia muito bem. Por isso, pediu que Jeová o ajudasse a identificar a causa das 'suas ansiedades'. Podemos pedir que Jeová nos ajude a identificar o que nos faz ter pensamentos negativos e como lidar com eles."
      },
      {
        paragrafo: "17",
        pergunta: "Que assuntos você pode incluir em seu estudo pessoal para ter pensamentos mais positivos?",
        resposta: "De vez em quando, pode ser de ajuda estudar algumas características da personalidade de Jeová. Por exemplo, refletir sobre o perdão de Jeová e o resgate foi muito bom para o apóstolo Paulo. Podemos usar o Guia de Pesquisa ou Índice das Publicações para aprender mais sobre assuntos como a misericórdia, o perdão e o amor leal de Deus."
      },
      {
        paragrafo: "18",
        pergunta: "Que projetos de estudo têm ajudado alguns irmãos?",
        resposta: "Eliza fez um projeto de estudo sobre Jó e se identificou muito com ele. Mesmo em seu pior momento, Jó continuou confiando na ajuda de Jeová. Diane e seu marido estão fazendo um projeto de estudo usando o livro Achegue-se a Jeová, imaginando Jeová os moldando como um oleiro faz com o barro."
      },
      {
        paragrafo: "19",
        pergunta: "O que vai acontecer de vez em quando, mas que certeza podemos ter?",
        resposta: "De vez em quando, ainda vamos ficar desanimados. Mas com a ajuda de Jeová, podemos parar de alimentar pensamentos negativos e nos acalmar. Podemos ter certeza de que, na maior parte do tempo, nossa vida vai ser feliz porque temos uma consciência limpa e somos amigos de Jeová."
      },
      {
        paragrafo: "20",
        pergunta: "O que queremos fazer?",
        resposta: "Queremos fazer o máximo para não ser controlados por sentimentos negativos relacionados ao nosso passado, aos nossos problemas ou às nossas imperfeições. Com a ajuda de Jeová, podemos ser bem-sucedidos na luta contra os pensamentos e sentimentos negativos!"
      }
    ],
    recapitulacao: [
      {
        pergunta: "Por que às vezes o apóstolo Paulo tinha sentimentos negativos?",
        resposta: "Paulo tinha sentimentos negativos por causa de erros do passado (perseguiu os cristãos), de um problema persistente ('espinho na carne') e de suas imperfeições. Mesmo assim, ele não deixou que esses sentimentos o controlassem."
      },
      {
        pergunta: "O que ajudou Paulo a manter uma atitude positiva, apesar de às vezes ficar desanimado?",
        resposta: "Paulo via o resgate como um presente especial de Deus para ele. Ele tinha certeza de que receberia o perdão de Jeová. Também ficava feliz de ouvir boas notícias sobre congregações distantes, valorizava a amizade com os irmãos e tinha uma amizade forte com Jeová."
      },
      {
        pergunta: "Como podemos lutar contra sentimentos negativos?",
        resposta: "Podemos manter uma boa rotina espiritual (reuniões, campo, estudo pessoal), orar para identificar a causa das ansiedades, adaptar nosso estudo pessoal à nossa situação e olhar para o futuro com confiança, sabendo que Jeová vai nos ajudar."
      }
    ]
  },
  {
    id: 3,
    semana: "Semana 3",
    dataInicio: "16 de março",
    dataFim: "22 de março",
    canticoInicial: 20,
    canticoFinal: 19,
    titulo: "Por que precisamos do resgate?",
    textoTema: "Quem me livrará do corpo que é submetido a essa morte? — Romanos 7:24",
    objetivo: "Ver como o resgate traz perdão, cura e reconciliação.",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "Por que precisamos que alguém nos resgate? (Romanos 7:22-24)",
        resposta: "Por Adão ter desobedecido seu Criador, ele se tornou pecador. Como somos descendentes de Adão, nós também somos pecadores. Por causa disso, todos os humanos ficaram, por assim dizer, presos debaixo dos escombros do pecado. Não podemos nos livrar das consequências disso sozinhos. Estamos em perigo e precisamos ser resgatados!"
      },
      {
        paragrafo: "3",
        pergunta: "De que formas o resgate nos salva?",
        resposta: "O resgate nos salva porque nos dá (1) o perdão dos nossos pecados, (2) a cura da nossa condição pecaminosa e (3) a reconciliação com nosso Criador."
      },
      {
        paragrafo: "4-5",
        pergunta: "Por que todos nós precisamos do resgate? (Eclesiastes 7:20)",
        resposta: "Todo humano imperfeito comete pecados, seja em palavras ou em ações. Alguns pecados são bem graves, mas mesmo assim todos cometemos pecados. Até algo que falamos pode ser um pecado. Já dissemos algo que preferíamos não ter dito ou fizemos alguma coisa e depois nos arrependemos."
      },
      {
        paragrafo: "6-7",
        pergunta: "O que torna possível que Jeová perdoe nossos pecados?",
        resposta: "O resgate é o que torna possível que Jeová perdoe os nossos pecados. A Lei mosaica exigia que os israelitas oferecessem sacrifícios de animais para fazer expiação pelos seus pecados. Esses sacrifícios mostravam que os humanos precisavam de um sacrifício muito maior. Foi o sacrifício de Jesus que trouxe muitas bênçãos e que deu a base para Jeová perdoar nossos pecados."
      },
      {
        paragrafo: "8",
        pergunta: "No que você pode pensar enquanto se prepara para a Celebração deste ano?",
        resposta: "Podemos pensar no que o perdão de Jeová significa para nós. Graças ao resgate, não precisamos ficar carregando o peso da culpa por pecados que cometemos no passado e já nos arrependemos. Devemos lembrar que é Jeová quem perdoa e que ele está 'sempre pronto a perdoar'."
      },
      {
        paragrafo: "9",
        pergunta: "Além de ações erradas, o que o pecado envolve? (Salmo 51:5 e nota)",
        resposta: "Na Bíblia, a palavra 'pecado' se refere não só a uma ação errada, mas também a uma condição que nós herdamos desde o momento em que fomos concebidos. Por causa dessa condição, além de termos a tendência de fazer coisas erradas, nosso corpo não funciona da maneira como Jeová tinha projetado, e ficamos doentes, envelhecemos e morremos."
      },
      {
        paragrafo: "10",
        pergunta: "Como a condição pecaminosa de Adão e Eva os afetou?",
        resposta: "O pecado produziu uma mudança drástica dentro deles. Eles perceberam que algo no seu íntimo tinha mudado, e não foi para melhor. Sentiram a necessidade de cobrir partes do seu corpo e de se esconder de seu Criador. Pela primeira vez, tiveram sentimentos de culpa, ansiedade, insegurança, dor e vergonha."
      },
      {
        paragrafo: "11",
        pergunta: "Que efeito nossa condição pecaminosa tem em nós?",
        resposta: "Assim como aconteceu com o primeiro casal humano, nossa condição pecaminosa nos faz sentir culpa, vergonha e ansiedade. É por causa da imperfeição que sofremos em sentido físico e emocional. Não importa o quanto tentemos melhorar nossa situação, não conseguimos ter uma vida livre de problemas e dificuldades."
      },
      {
        paragrafo: "12",
        pergunta: "Que esperança o resgate nos dá?",
        resposta: "O resgate nos dá a esperança de que 'a própria criação... será libertada da escravidão à decadência'. No novo mundo de Deus, quando nos tornarmos perfeitos, não vamos mais ser atormentados por doenças físicas, mentais e emocionais. Nem teremos mais sentimentos que podem nos deixar paralisados, como culpa, ansiedade, insegurança, dor ou vergonha."
      },
      {
        paragrafo: "13",
        pergunta: "Em que você pode pensar enquanto se prepara para a Celebração deste ano?",
        resposta: "Podemos imaginar acordar todo dia se sentindo bem, e nunca mais se preocupar se vamos passar fome, ficar doentes ou morrer. Até mesmo agora podemos encontrar certa paz por se 'apegar firmemente à esperança... como âncora para a alma, tanto segura como firme'."
      },
      {
        paragrafo: "14",
        pergunta: "De que forma o pecado afeta nossa amizade com o Criador, e por quê?",
        resposta: "Desde que Adão e Eva pecaram, os humanos ficaram separados de seu Criador. A Bíblia até mesmo diz que há inimizade entre a humanidade como um todo e Deus. Os padrões de Jeová são perfeitos, por isso é impossível que ele simplesmente ignore o pecado. O resgate é a ponte que possibilita nossa reconciliação com Deus."
      },
      {
        paragrafo: "15",
        pergunta: "De que forma a morte de Jesus permitiu que Jeová recuperasse a amizade com os humanos?",
        resposta: "Jesus é 'um sacrifício propiciatório pelos nossos pecados', ou seja, um 'meio de pacificação'. O resgate satisfez o padrão de justiça de Jeová, dando-lhe uma base para restabelecer a amizade entre ele e a humanidade. Jeová podia até mesmo 'creditar' justiça àqueles que o adoraram fielmente antes da morte de Cristo, com base no resgate que ainda viria."
      },
      {
        paragrafo: "16",
        pergunta: "Em que outras coisas você pode meditar enquanto se prepara para a Celebração deste ano?",
        resposta: "Podemos pensar no que a reconciliação com Deus significa para nós. Podemos nos referir a Jeová como nosso 'Pai' ou nosso 'Amigo'. É apenas por causa do resgate que podemos ter uma amizade com Jeová — mesmo agora em nossa condição imperfeita."
      },
      {
        paragrafo: "17",
        pergunta: "Como o resgate prova que Jeová é muito misericordioso? (Efésios 2:4,5)",
        resposta: "O resgate deixa claro que Jeová é 'rico em misericórdia'. Ele 'nos deu vida... quando estávamos mortos por causa das nossas falhas'. Os que têm 'a disposição correta para com a vida eterna' sabem que estão presos debaixo dos escombros do pecado e que precisam ser libertados. Por isso, eles gritam por ajuda."
      },
      {
        paragrafo: "18",
        pergunta: "Ao meditar no resgate, do que precisamos nos lembrar?",
        resposta: "Precisamos ter em mente que uma questão maior está envolvida. Em vez de ver o resgate como algo apenas para o nosso benefício, devemos lembrar que é por meio do resgate que Jeová está respondendo ao desafio que Satanás lançou no jardim do Éden. Jeová também usa o resgate para santificar seu nome e limpá-lo de todas as mentiras que Satanás conta."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Como o resgate nos dá PERDÃO?",
        resposta: "O sacrifício de Jesus deu a base sólida para Jeová perdoar nossos pecados. Graças ao resgate, não precisamos ficar carregando o peso da culpa por pecados que cometemos no passado e já nos arrependemos. Jeová está 'sempre pronto a perdoar' aqueles que andam na luz."
      },
      {
        pergunta: "Como o resgate nos dá CURA?",
        resposta: "O resgate nos dá a esperança de que 'a própria criação... será libertada da escravidão à decadência'. No novo mundo, quando nos tornarmos perfeitos, não vamos mais ser atormentados por doenças físicas, mentais e emocionais. Até mesmo agora podemos encontrar certa paz por nos apegar à esperança."
      },
      {
        pergunta: "Como o resgate nos dá RECONCILIAÇÃO?",
        resposta: "O resgate satisfez o padrão de justiça de Jeová, dando-lhe uma base para restabelecer a amizade entre ele e a humanidade. Por meio de Jesus, Jeová tornou possível 'reconciliar todas as outras coisas consigo mesmo, estabelecendo a paz por meio do sangue que Jesus derramou na estaca'."
      }
    ]
  },
  {
    id: 4,
    semana: "Semana 4",
    dataInicio: "23 de março",
    dataFim: "29 de março",
    canticoInicial: 18,
    canticoFinal: 14,
    titulo: "Como você vai mostrar sua gratidão pelo resgate?",
    textoTema: "O amor do Cristo nos impele. — 2 Coríntios 5:14",
    objetivo: "Ver como todos nós podemos mostrar que somos gratos pelo resgate.",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "O que o resgate de Jesus nos impele a fazer, e por quê? (2 Coríntios 5:14,15)",
        resposta: "O resgate é uma prova do amor de Jesus pelas pessoas — um amor que ele já sentia muito tempo antes de vir à Terra. O amor de Jesus por nós deve nos motivar a agir, a fazer algo para mostrar que somos muito gratos e que nunca vamos esquecer do sacrifício que ele fez por nós."
      },
      {
        paragrafo: "3",
        pergunta: "Por que cada pessoa talvez tenha uma maneira diferente de mostrar gratidão pelo resgate?",
        resposta: "Assim como três pessoas viajando para o mesmo lugar vão percorrer caminhos diferentes dependendo de onde saem, o 'caminho' que vamos percorrer para mostrar gratidão pelo resgate depende de onde estamos agora no que diz respeito à nossa amizade com Jeová."
      },
      {
        paragrafo: "4",
        pergunta: "No que Jeová presta atenção ao ver os estudantes da Bíblia?",
        resposta: "O fato de querer aprender sobre Jeová e a Bíblia indica que Jeová está atraindo a pessoa a ele. 'É Jeová quem examina os corações.' Ele vê os esforços de aprender sobre ele e fica muito feliz com o progresso e as mudanças que a pessoa faz para ser amiga dele. Essa amizade só é possível graças ao resgate."
      },
      {
        paragrafo: "5",
        pergunta: "Como os estudantes da Bíblia podem seguir o conselho de Filipenses 3:16?",
        resposta: "Paulo aconselhou: 'Seja qual for o progresso que já fizemos, prossigamos andando nesse mesmo rumo.' Os estudantes devem aplicar esse conselho e não deixar que nada nem ninguém os atrapalhe de andar na estrada da vida."
      },
      {
        paragrafo: "6",
        pergunta: "O que os estudantes da Bíblia podem fazer ao enfrentar certas dificuldades? (Deuteronômio 30:11-14)",
        resposta: "Se acharem difícil aceitar um ensino da Bíblia, podem fazer pesquisas e orar a Jeová para que os ajude a entender melhor. Jeová nunca pede algo que seja 'difícil demais'. Se a dificuldade for abandonar um hábito que a Bíblia condena, devem continuar se esforçando, sabendo que Jeová promete ajudar."
      },
      {
        paragrafo: "7",
        pergunta: "Os jovens que estão sendo criados na verdade podem meditar em quê?",
        resposta: "Os jovens também são estudantes da Bíblia. Jeová atrai cada pessoa de forma individual, incluindo aqueles que estão sendo criados na verdade. Devem lembrar do que Jeová fez para que tenham uma amizade forte com ele: ele deu o seu Filho. Podem meditar nisso antes da Celebração e pensar no que querem fazer com sua vida."
      },
      {
        paragrafo: "8",
        pergunta: "Como um cristão que é batizado já mostrou gratidão pelo resgate?",
        resposta: "Um cristão batizado já mostrou gratidão de várias maneiras: deu os passos para se achegar a Jeová, obedeceu a ordem de Jesus de pregar e fazer discípulos, se dedicou a Jeová e se batizou. Talvez até sofreu oposição por decidir servir a Jeová, mas perseverou."
      },
      {
        paragrafo: "9",
        pergunta: "Um cristão batizado deve estar atento a qual perigo?",
        resposta: "Com o tempo, podemos deixar de dar valor ao resgate. Como os cristãos de Éfeso do primeiro século, um cristão pode, aos poucos, acabar deixando sua adoração a Jeová cair na rotina. A pessoa pode estar orando, indo às reuniões e participando no ministério, mas só porque está acostumada a fazer isso, não mais motivada por amor."
      },
      {
        paragrafo: "10",
        pergunta: "Como você pode 'meditar' e 'se concentrar totalmente' em suas atividades cristãs? (1 Timóteo 4:13,15)",
        resposta: "Podemos pensar no que podemos fazer para dar mais vida à nossa adoração a Jeová e continuar 'sendo fervorosos no espírito'. Por exemplo, ir mais a fundo ao preparar as reuniões, procurar lugares sem distrações para fazer o estudo pessoal, e nas semanas antes da Celebração meditar nas bênçãos maravilhosas que temos."
      },
      {
        paragrafo: "11-12",
        pergunta: "Se às vezes você sente que não tem o mesmo zelo de antes, será que você perdeu o espírito de Deus? Explique.",
        resposta: "Não necessariamente. Às vezes, algumas coisas sufocavam o desejo que Paulo tinha de pregar. Mas ele estava decidido a perseverar na pregação, com ou sem vontade. Podemos ter a mesma atitude: estar decididos a fazer o que é certo, mesmo se faltar motivação. Devemos orar para ter 'tanto o desejo como o poder de agir'."
      },
      {
        paragrafo: "13",
        pergunta: "Como podemos continuar examinando se 'estamos na fé'?",
        resposta: "Podemos nos fazer perguntas como: 'Estou colocando o Reino em primeiro lugar na vida?' 'As coisas que eu escolho para me divertir mostram que eu odeio o que é mau?' 'Minhas palavras e ações estão ajudando a congregação a continuar unida?' A época da Celebração é um período especial para meditar no presente do resgate."
      },
      {
        paragrafo: "14",
        pergunta: "Que coisas podem fazer alguns irmãos se afastarem do rebanho?",
        resposta: "Alguns estão sobrecarregados com as 'ansiedades da vida'. Outros tropeçaram por causa de algo que algum irmão disse ou fez. Já outros cometeram um pecado grave e não pedem ajuda por sentirem vergonha ou por algum outro motivo."
      },
      {
        paragrafo: "15",
        pergunta: "Como Jeová mostra que se importa com as ovelhas que se afastaram? (Ezequiel 34:11,12,16)",
        resposta: "Ele não fica com raiva dessas pessoas nem se esquece delas. Muito pelo contrário. Ele procura por suas ovelhas perdidas e cuida delas, por alimentá-las e ajudá-las a voltar para ele. Jeová vê o coração das pessoas e continua atraindo aquelas que têm coisas boas no coração."
      },
      {
        paragrafo: "16",
        pergunta: "O que pode ajudar as ovelhas perdidas a voltarem para Jeová?",
        resposta: "A brochura Volte para Jeová oferece palavras animadoras. Jeová ajudará a lidar com a ansiedade, a se livrar de mágoas e a encontrar a paz mental de ter uma consciência limpa. Os anciãos querem muito ajudar e podem providenciar alguém para estudar a Bíblia novamente por um tempo."
      },
      {
        paragrafo: "17-18",
        pergunta: "Como podemos usar bem nosso tempo antes da Celebração deste ano?",
        resposta: "Os dias antes da Celebração nos dão uma chance de meditar no amor que Jeová e Jesus mostraram, e esse amor vai nos motivar a fazer algo para mostrar gratidão pelo que eles fizeram. Jeová vai abençoar nossos esforços e os de milhões de outros adoradores que 'não vivem mais para si mesmos, mas para aquele que morreu por eles'."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Como os ESTUDANTES DA BÍBLIA podem mostrar gratidão pelo resgate?",
        resposta: "Podem continuar andando no mesmo rumo, não deixando que nada os atrapalhe de andar na estrada da vida. Podem fazer pesquisas e orar quando acharem difícil aceitar um ensino, e continuar se esforçando para abandonar hábitos que a Bíblia condena. Nunca devem se esquecer que a amizade com Jeová só é possível graças ao resgate."
      },
      {
        pergunta: "Como os CRISTÃOS BATIZADOS podem mostrar gratidão pelo resgate?",
        resposta: "Podem dar mais vida à sua adoração a Jeová, continuar 'sendo fervorosos no espírito'. Podem ir mais a fundo ao preparar as reuniões, meditar nas bênçãos que têm como Testemunhas de Jeová, e examinar regularmente se 'estão na fé'. A época da Celebração é um período especial para essa meditação."
      },
      {
        pergunta: "Como as OVELHAS QUE SE AFASTARAM podem mostrar gratidão pelo resgate?",
        resposta: "Podem voltar para Jeová, sabendo que ele não está com raiva delas nem se esqueceu delas. Podem assistir a uma reunião no Salão do Reino, falar com um dos anciãos e pedir ajuda em sentido espiritual. Se orarem e se esforçarem para mostrar gratidão pelo resgate, Jeová vai abençoá-las."
      }
    ]
  },
  {
    id: 5,
    semana: "Semana 5",
    dataInicio: "30 de março",
    dataFim: "5 de abril",
    canticoInicial: 76,
    canticoFinal: 160,
    titulo: "Fale a verdade de modo agradável",
    textoTema: "Jeová, [o] Deus da verdade. — Salmo 31:5",
    objetivo: "Ver como podemos falar a verdade de uma forma que traga bons resultados.",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "O que precisamos fazer para nos tornar parte da família de Jeová?",
        resposta: "A verdade da Palavra de Deus influencia toda a nossa vida. Só podemos nos tornar parte da família de Jeová se amarmos a verdade e vivermos de acordo com ela. Isso inclui sermos honestos no que falamos e fazemos."
      },
      {
        paragrafo: "2",
        pergunta: "Jesus sempre falava a verdade? Como as pessoas reagiam? (Mateus 10:35)",
        resposta: "Jesus sempre falava a verdade, mesmo que suas palavras não agradassem a todos. Até mesmo os inimigos dele reconheciam isso. Jesus disse que viria causar divisão entre as pessoas. Ele sabia que a mensagem que pregava dividiria o mundo em dois grupos: aqueles que amam a verdade da Bíblia e aqueles que não amam."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        resposta: "Vamos responder às perguntas: Onde podemos encontrar a verdade? Por que, como e quando devemos falar a verdade? Isso vai nos ajudar a falar a verdade de maneira ainda mais agradável, ou seja, com jeito e no momento certo."
      },
      {
        paragrafo: "4",
        pergunta: "Por que podemos dizer que Jeová é a Fonte da verdade?",
        resposta: "Tudo o que Jeová diz é verdadeiro. Ele fala a verdade quando diz o que é certo e o que é errado. Tudo o que ele prediz sobre o futuro se cumpre. Ele nunca quebra uma promessa. A Bíblia chega até a dizer que é impossível Jeová mentir. Não é à toa que Jeová seja conhecido como o 'Deus da verdade'."
      },
      {
        paragrafo: "5",
        pergunta: "Por que não é difícil conhecer o 'Deus da verdade'? (Atos 17:27)",
        resposta: "Para qualquer lugar que olhamos, vemos provas de que Deus existe. Paulo disse que Deus quer que 'o achemos' e que ele 'não está longe de cada um de nós'. Na realidade, Jeová atrai pessoas humildes que estão procurando pela verdade."
      },
      {
        paragrafo: "6",
        pergunta: "Quais são algumas das verdades que encontramos na Bíblia? Por que você ama conhecer essas verdades?",
        resposta: "A Bíblia ensina verdades sobre a origem do Universo e da vida na Terra, a origem do pecado, do sofrimento e da morte. Podemos confiar na promessa de que Jeová, por meio de seu Filho, vai desfazer todos os danos causados pelo Diabo. Jesus vai destruir os maus, ressuscitar os mortos, restaurar a Terra e nos levar à perfeição."
      },
      {
        paragrafo: "7-8",
        pergunta: "Faz diferença a nossa motivação ao falar a verdade? Dê um exemplo. (Marcos 3:11,12)",
        resposta: "Sim, faz diferença. Quando Jesus pregava, algumas pessoas possuídas por demônios gritavam: 'Você é o Filho de Deus.' Os demônios disseram a verdade, mas talvez quisessem ganhar a confiança das pessoas para depois desviá-las de servir a Jeová. A motivação deles era egoísta. Jesus não gostou e ordenou que não pregassem sobre ele."
      },
      {
        paragrafo: "9",
        pergunta: "O que devemos evitar fazer, e por quê?",
        resposta: "Devemos evitar chamar atenção para nós mesmos. Se divulgarmos informações confidenciais para outros, isso pode nos fazer subir no conceito das pessoas, mas não no conceito de Jeová. Além de divulgarmos informações confidenciais, estaremos falando a verdade com a motivação errada."
      },
      {
        paragrafo: "10",
        pergunta: "O que significa falar palavras 'agradáveis'? (Colossenses 4:6)",
        resposta: "Paulo lembrou aos cristãos de Colossos que nossas palavras devem ser 'sempre agradáveis'. A expressão no idioma original passa a ideia de que nossas palavras, além de beneficiar os nossos ouvintes, precisam ser bondosas e atraentes."
      },
      {
        paragrafo: "11-12",
        pergunta: "Por que devemos ensinar a verdade com cuidado? Dê um exemplo.",
        resposta: "A Bíblia é comparada a uma espada afiada que pode revelar quem nós realmente somos por dentro. Mas se não usarmos a Bíblia com cuidado, podemos acabar ofendendo as pessoas. Por exemplo, se alguém comemora o Natal e nós logo na primeira conversa falamos que essa comemoração não é aprovada por Deus, isso não seria falar de modo agradável."
      },
      {
        paragrafo: "13",
        pergunta: "O que significa temperar nossas palavras com sal?",
        resposta: "Paulo disse que devemos 'temperar' nossas palavras para apresentar a verdade de uma forma que agrade o 'gosto' do nosso ouvinte. Assim como ao cozinhar para outros devemos pensar no gosto deles, não no nosso, ao falar a verdade devemos adaptar nossas palavras de acordo com o gosto e a cultura do nosso ouvinte."
      },
      {
        paragrafo: "14",
        pergunta: "Jesus ensinava tudo o que sabia para os seus discípulos? Explique.",
        resposta: "Jesus ensinava de forma agradável e bondosamente ensinava muitas coisas para seus seguidores. Mas eles ainda tinham muito o que aprender. Jesus não tentava ensinar tudo o que sabia porque levava em conta as limitações dos seus discípulos. Ele entendia que não era a hora certa de eles aprenderem algumas verdades."
      },
      {
        paragrafo: "15",
        pergunta: "Será que devemos ensinar aos nossos estudantes tudo o que sabemos de uma vez? Explique. (Provérbios 25:11)",
        resposta: "Não. O exemplo de Jesus mostra que devemos levar em conta as circunstâncias das pessoas. Alguns estudantes são rápidos em colocar em prática o que aprendem, mas outros levam mais tempo. Devemos dizer o que os estudantes precisam saber na hora em que eles precisam saber, ou seja, quando forem capazes de suportar."
      },
      {
        paragrafo: "16",
        pergunta: "Como podemos ajudar nossos estudantes a 'continuar andando na verdade'?",
        resposta: "Devemos dar um bom exemplo, mostrar pelo nosso modo de vida que acreditamos nas promessas de Deus, ensinar a verdade com a motivação correta e no momento certo, falar de forma agradável usando palavras gentis e bondosas, e dar todo o crédito a Jeová quando recebermos um elogio."
      }
    ],
    recapitulacao: [
      {
        pergunta: "O que aprendemos de Atos 17:27 sobre encontrar a verdade?",
        resposta: "Paulo disse que Deus quer que 'o achemos' e que ele 'não está longe de cada um de nós'. Para qualquer lugar que olhamos, vemos provas de que Deus existe. Na realidade, Jeová atrai pessoas humildes que estão procurando pela verdade. Por meio de seu estudo da Bíblia, podemos conhecer o 'Deus da verdade'."
      },
      {
        pergunta: "O que aprendemos de Colossenses 4:6 sobre como falar a verdade?",
        resposta: "Nossas palavras devem ser 'sempre agradáveis', temperadas com sal. Isso significa que nossas palavras, além de beneficiar os nossos ouvintes, precisam ser bondosas e atraentes. Devemos 'temperar' nossas palavras para apresentar a verdade de uma forma que agrade o 'gosto' do nosso ouvinte."
      },
      {
        pergunta: "O que aprendemos de Provérbios 25:11 sobre quando falar a verdade?",
        resposta: "Assim como Jesus, devemos levar em conta as limitações e circunstâncias das pessoas. Não devemos tentar ensinar tudo o que sabemos de uma vez. Devemos dizer o que os estudantes precisam saber na hora em que eles precisam saber, ou seja, quando forem capazes de suportar."
      }
    ]
  }
]

export default function EstudoSentinelaPage() {
  const [semanaAtiva, setSemanaAtiva] = useState("1")
  const [perguntaExpandida, setPerguntaExpandida] = useState<string | null>(null)
  const [recapExpandida, setRecapExpandida] = useState<string | null>(null)

  const togglePergunta = (id: string) => {
    setPerguntaExpandida(perguntaExpandida === id ? null : id)
  }

  const toggleRecap = (id: string) => {
    setRecapExpandida(recapExpandida === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estudo de A Sentinela</h1>
          <p className="text-muted-foreground">Março 2026</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <BookOpen className="w-5 h-5 mr-2" />
          5 Estudos
        </Badge>
      </div>

      <Tabs value={semanaAtiva} onValueChange={setSemanaAtiva} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          {estudosMarco.map((estudo) => (
            <TabsTrigger
              key={estudo.id}
              value={estudo.id.toString()}
              className="flex flex-col py-3 px-2 text-xs sm:text-sm"
            >
              <span className="font-semibold">{estudo.semana}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                {estudo.dataInicio.split(" ")[0]}-{estudo.dataFim.split(" ")[0]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {estudosMarco.map((estudo) => (
          <TabsContent key={estudo.id} value={estudo.id.toString()} className="mt-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-red-600 hover:bg-red-700 text-white">
                      <Music className="w-4 h-4 mr-1" />
                      Cântico {estudo.canticoInicial}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {estudo.dataInicio} - {estudo.dataFim}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl text-red-700">{estudo.titulo}</CardTitle>
                  <div className="space-y-2">
                    <p className="text-sm italic text-muted-foreground">{estudo.textoTema}</p>
                    <div className="flex items-start gap-2 text-sm">
                      <Target className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span><strong>Objetivo:</strong> {estudo.objetivo}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Tabela de Perguntas */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Perguntas do Estudo
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-20">Parágrafo</TableHead>
                            <TableHead>Pergunta</TableHead>
                            <TableHead className="w-20 text-center">Resposta</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {estudo.perguntas.map((pergunta, index) => (
                            <>
                              <TableRow
                                key={`pergunta-${estudo.id}-${index}`}
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => togglePergunta(`${estudo.id}-${index}`)}
                              >
                                <TableCell className="font-bold text-center text-red-600">
                                  {pergunta.paragrafo}
                                </TableCell>
                                <TableCell className="text-sm">{pergunta.pergunta}</TableCell>
                                <TableCell className="text-center">
                                  {perguntaExpandida === `${estudo.id}-${index}` ? (
                                    <ChevronUp className="w-5 h-5 mx-auto text-primary" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 mx-auto text-muted-foreground" />
                                  )}
                                </TableCell>
                              </TableRow>
                              {perguntaExpandida === `${estudo.id}-${index}` && (
                                <TableRow key={`resposta-${estudo.id}-${index}`}>
                                  <TableCell colSpan={3} className="bg-green-50 dark:bg-green-950/30 p-4">
                                    <div className="text-sm">
                                      <strong className="text-green-700 dark:text-green-400">Resposta:</strong>
                                      <p className="mt-1 text-green-800 dark:text-green-300">{pergunta.resposta}</p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Perguntas de Recapitulação */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-600" />
                      Perguntas de Recapitulação
                    </h3>
                    <div className="border rounded-lg overflow-hidden border-amber-200 dark:border-amber-800">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-amber-50 dark:bg-amber-950/30">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Pergunta</TableHead>
                            <TableHead className="w-20 text-center">Ver</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {estudo.recapitulacao.map((recap, index) => (
                            <>
                              <TableRow
                                key={`recap-${estudo.id}-${index}`}
                                className="cursor-pointer hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors"
                                onClick={() => toggleRecap(`recap-${estudo.id}-${index}`)}
                              >
                                <TableCell className="font-bold text-center text-amber-600">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="text-sm font-medium">{recap.pergunta}</TableCell>
                                <TableCell className="text-center">
                                  {recapExpandida === `recap-${estudo.id}-${index}` ? (
                                    <ChevronUp className="w-5 h-5 mx-auto text-amber-600" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 mx-auto text-muted-foreground" />
                                  )}
                                </TableCell>
                              </TableRow>
                              {recapExpandida === `recap-${estudo.id}-${index}` && (
                                <TableRow key={`recap-resposta-${estudo.id}-${index}`}>
                                  <TableCell colSpan={3} className="bg-amber-50 dark:bg-amber-950/30 p-4">
                                    <div className="text-sm">
                                      <strong className="text-amber-700 dark:text-amber-400">Resposta:</strong>
                                      <p className="mt-1 text-amber-800 dark:text-amber-300">{recap.resposta}</p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Cântico Final */}
                  <div className="flex justify-center pt-4 border-t">
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-2">
                      <Music className="w-5 h-5 mr-2" />
                      Cântico Final: {estudo.canticoFinal}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
