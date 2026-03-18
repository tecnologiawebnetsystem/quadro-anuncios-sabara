import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface ParagrafoData {
  numero: string
  texto_base: string
  pergunta: string
  resposta: string
  ordem: number
}

interface RecapitulacaoData {
  pergunta: string
  resposta: string
  ordem: number
}

interface EstudoData {
  numero_estudo: number
  data_inicio: string
  data_fim: string
  cantico_inicial: number
  cantico_inicial_nome: string
  cantico_final: number
  cantico_final_nome: string
  titulo: string
  texto_tema: string
  objetivo: string
  paragrafos: ParagrafoData[]
  recapitulacao: RecapitulacaoData[]
}

async function inserirEstudosMarco2026() {
  console.log("Iniciando inserção dos estudos de março de 2026...")

  // 1. Criar ou buscar o mês de março 2026
  let mesId: string
  const { data: mesExistente } = await supabase
    .from("sentinela_meses")
    .select("id")
    .eq("mes", 3)
    .eq("ano", 2026)
    .single()

  if (mesExistente) {
    mesId = mesExistente.id
    console.log("Mês março/2026 já existe:", mesId)
  } else {
    const { data: novoMes, error: erroMes } = await supabase
      .from("sentinela_meses")
      .insert({ mes: 3, ano: 2026, cor_tema: "#10b981" })
      .select("id")
      .single()
    
    if (erroMes || !novoMes) {
      console.error("Erro ao criar mês:", erroMes)
      return
    }
    mesId = novoMes.id
    console.log("Mês março/2026 criado:", mesId)
  }

  // Dados dos 4 estudos de março 2026
  const estudos: EstudoData[] = [
    // ESTUDO 1: 2-8 de março
    {
      numero_estudo: 1,
      data_inicio: "2026-03-02",
      data_fim: "2026-03-08",
      cantico_inicial: 97,
      cantico_inicial_nome: "A Palavra de Deus nos ajuda a viver",
      cantico_final: 162,
      cantico_final_nome: "Preciso de ti",
      titulo: "Continue cuidando da sua \"necessidade espiritual\"",
      texto_tema: "Felizes os que têm consciência de sua necessidade espiritual. — Mat. 5:3",
      objetivo: "Ver como podemos continuar nos beneficiando de tudo o que Jeová nos dá para ficarmos bem alimentados, vestidos e protegidos em sentido espiritual.",
      paragrafos: [
        {
          numero: "1",
          texto_base: "Jeová criou os humanos com algumas necessidades básicas. Por exemplo, para continuarmos vivos, precisamos ter o que comer, o que vestir e também de um lugar onde ficamos protegidos. Se ficarmos sem alguma dessas coisas, mesmo que por pouco tempo, a vida se torna muito difícil. Além de ter nos criado com necessidades físicas, Jeová nos criou com uma necessidade espiritual. Para sermos felizes de verdade, precisamos ter consciência dessa necessidade e continuar cuidando dela.",
          pergunta: "Com que necessidades básicas Jeová nos criou? (Mateus 5:3)",
          resposta: "Jeová nos criou com necessidades físicas como comida, roupa e abrigo, mas também com uma necessidade espiritual. Para sermos verdadeiramente felizes, precisamos reconhecer essa necessidade espiritual e cuidar dela continuamente.",
          ordem: 1
        },
        {
          numero: "2",
          texto_base: "O que significa 'ter consciência de nossa necessidade espiritual'? No idioma original, essa expressão passa a ideia de alguém saber que é pobre, ou mendigo, em sentido espiritual. Ela cria uma imagem muito forte na nossa mente. Podemos imaginar um mendigo vestindo trapos, sentado numa calçada. Ele está fraco porque não tem o que comer. As pessoas passam longe dele por causa da sua aparência. De dia, ele fica exposto ao calor intenso, e à noite ele quase morre de frio. Esse mendigo sabe muito bem que, para mudar de vida, ele precisa da ajuda de alguém. Da mesma forma, quem tem consciência da sua necessidade espiritual — um mendigo do espírito — precisa de ajuda para melhorar sua situação. Por isso, ele quer muito aproveitar tudo o que Jeová dá em sentido espiritual para aqueles que o amam.",
          pergunta: "Que ilustração nos ajuda a entender o que significa 'ter consciência de nossa necessidade espiritual'?",
          resposta: "A ilustração de um mendigo vestindo trapos, fraco de fome, exposto ao calor e ao frio. Assim como o mendigo sabe que precisa de ajuda para mudar sua situação, quem tem consciência da necessidade espiritual reconhece que precisa da ajuda de Jeová e quer aproveitar tudo o que Ele oferece.",
          ordem: 2
        },
        {
          numero: "3",
          texto_base: "Neste estudo, primeiro vamos ver o que podemos aprender com uma mulher da Fenícia que implorou pela ajuda de Jesus. Esse relato destaca três qualidades que aqueles que têm consciência de sua necessidade espiritual precisam desenvolver. Depois vamos considerar os exemplos de Pedro, Paulo e Davi, homens que cuidaram de sua necessidade espiritual.",
          pergunta: "O que vamos ver neste estudo?",
          resposta: "Vamos aprender com o exemplo de uma mulher fenícia que implorou pela ajuda de Jesus, destacando três qualidades importantes. Também vamos considerar os exemplos de Pedro, Paulo e Davi, homens que cuidaram de sua necessidade espiritual.",
          ordem: 3
        },
        {
          numero: "4",
          texto_base: "Certa vez, uma mulher fenícia foi até Jesus. A filha dela estava 'possuída por um demônio que a atormentava cruelmente'. A mulher se ajoelhou e implorou que Jesus a ajudasse. Vamos ver três qualidades que ela demonstrou e que nós podemos imitar.",
          pergunta: "Por que uma mulher fenícia foi até Jesus?",
          resposta: "Ela foi até Jesus porque sua filha estava possuída por um demônio que a atormentava cruelmente. A mulher se ajoelhou e implorou pela ajuda de Jesus.",
          ordem: 4
        },
        {
          numero: "5",
          texto_base: "A mulher fenícia mostrou verdadeira humildade. Por que podemos dizer isso? Porque ela não ficou ofendida pelo modo como Jesus falou. Jesus a comparou a um cachorrinho, que talvez fosse um animal de estimação comum para os não judeus. Como você teria reagido se estivesse na situação dela? Teria ficado ofendido e desistido de pedir a ajuda de Jesus? Não foi isso que a mulher fenícia fez. Ela mostrou não apenas humildade, mas também persistência. Tanto é que ela continuou implorando que Jesus a ajudasse. Por quê? Por causa da sua fé em Jesus. E Jesus ficou tão impressionado com a fé dela que fez algo incrível. Ele tinha acabado de dizer: 'Fui enviado apenas às ovelhas perdidas da casa de Israel.' Mesmo assim, ele decidiu fazer o que a mulher tinha pedido e expulsou o demônio que atormentava a filha dela.",
          pergunta: "Que qualidades a mulher fenícia demonstrou e qual foi a reação de Jesus? (Veja também a imagem.)",
          resposta: "A mulher fenícia demonstrou humildade, persistência e fé. Ela não ficou ofendida quando Jesus a comparou a um cachorrinho, mas continuou implorando por ajuda. Jesus ficou tão impressionado com a fé dela que atendeu seu pedido e expulsou o demônio da filha dela.",
          ordem: 5
        },
        {
          numero: "6",
          texto_base: "Para cuidarmos de nossa necessidade espiritual, temos que desenvolver essas mesmas qualidades. Precisamos ser humildes, persistentes e ter uma forte fé. Apenas uma pessoa humilde persiste em implorar a ajuda de Deus. Precisamos também ter uma forte fé em Jesus Cristo e confiar naqueles que ele está usando para orientar os seus discípulos. Se demonstrarmos essas qualidades, Jeová e seu Filho vão ficar felizes de nos ajudar a cuidar de nossa necessidade espiritual. Agora vamos ver o que Jeová nos dá para ficarmos bem alimentados, vestidos e protegidos em sentido espiritual. O exemplo dos apóstolos Pedro e Paulo, e também do rei Davi, vai nos ajudar a saber o que temos que fazer para cuidar dessa necessidade.",
          pergunta: "O que aprendemos com o exemplo da mulher fenícia?",
          resposta: "Aprendemos que para cuidar de nossa necessidade espiritual precisamos ser humildes, persistentes e ter forte fé em Jesus Cristo. Devemos confiar naqueles que ele usa para orientar seus discípulos. Com essas qualidades, Jeová e Jesus nos ajudarão.",
          ordem: 6
        },
        {
          numero: "7",
          texto_base: "Veja o exemplo do apóstolo Pedro. Ele foi um dos primeiros judeus a reconhecer que Jesus era o Messias — aquele que Jeová estava usando para alimentar seu povo com 'declarações de vida eterna'. Antes de voltar para o céu, Jesus disse a Pedro: 'Alimente as minhas ovelhinhas.' Pedro cuidou dessa responsabilidade de modo fiel, e Jeová até o usou para escrever duas cartas que mais tarde passaram a fazer parte da Bíblia. Mesmo assim, Pedro também precisava se alimentar espiritualmente. Por exemplo, ele estudava as cartas que o apóstolo Paulo tinha escrito. Pedro reconheceu que algumas das coisas que Paulo escreveu eram 'difíceis de entender'. Mas ele com certeza persistiu em estudar. Ele tinha fé de que Jeová o ajudaria a digerir, ou seja, a entender e aplicar, o 'alimento sólido' que Paulo tinha sido inspirado a servir em suas cartas.",
          pergunta: "Que responsabilidade Pedro recebeu, mas o que ele precisava fazer? (Hebreus 5:14–6:1)",
          resposta: "Pedro recebeu a responsabilidade de alimentar as ovelhinhas de Jesus e até escreveu duas cartas da Bíblia. Mas ele também precisava se alimentar espiritualmente, estudando as cartas de Paulo, mesmo sendo 'difíceis de entender'. Ele tinha fé que Jeová o ajudaria a entender o alimento sólido.",
          ordem: 7
        },
        {
          numero: "8",
          texto_base: "Pedro mostrou que tinha fé em Jeová por obedecer às orientações que recebia. Por exemplo, quando estava na cidade de Jope, ele teve uma visão. Nela, um anjo disse para Pedro matar e comer animais que eram impuros de acordo com a Lei mosaica. Para um judeu, essa orientação deve ter sido chocante. Tanto que, de início, Pedro respondeu: 'De jeito nenhum, Senhor, porque nunca comi nada aviltado ou impuro.' Daí o anjo disse: 'Pare de chamar de impuras as coisas que Deus purificou.' Pedro entendeu a vontade de Jeová e ajustou seu modo de pensar. Como sabemos disso? Pouco depois de receber essa visão, três homens enviados por um não judeu chamado Cornélio chegaram e convidaram Pedro para ir até a casa do seu senhor. Os judeus consideravam os não judeus impuros. Então, antes da visão, Pedro jamais teria aceitado entrar na casa daquele homem. Mas ele aceitou imediatamente a orientação que Jeová tinha acabado de dar. Pedro pregou a Cornélio e aos parentes e amigos que estavam na casa dele e teve a alegria de ver todos eles aceitar a verdade, receber espírito santo e ser batizados.",
          pergunta: "Como Pedro reagiu a uma nova orientação que recebeu de um anjo?",
          resposta: "Pedro inicialmente resistiu quando um anjo disse para comer animais impuros. Mas quando o anjo explicou que Deus os purificou, Pedro ajustou seu modo de pensar. Logo depois, aceitou visitar Cornélio, um não judeu, e pregou a ele e sua família, que aceitaram a verdade e foram batizados.",
          ordem: 8
        },
        {
          numero: "9",
          texto_base: "Assim como Pedro, devemos nos alimentar regularmente das verdades básicas, ou do leite, da Palavra de Deus. Também devemos desenvolver o desejo por alimento espiritual sólido, ou seja, verdades que talvez sejam mais difíceis de entender. Precisamos reservar um tempo e nos esforçar para entender mais a fundo a Palavra de Deus. Mas esse esforço vale a pena! Por quê? Por pelo menos dois motivos. Primeiro, vamos aprender coisas sobre Jeová que aumentam nosso amor e respeito por ele. E segundo, vamos ficar mais motivados a falar com outros sobre o nosso maravilhoso Pai celestial. O exemplo de Pedro nos ensina outra lição: Quando o nosso entendimento de uma verdade bíblica é ajustado, precisamos ser rápidos para adaptar nosso modo de pensar e de agir. Só assim vamos continuar bem alimentados espiritualmente e úteis para Jeová.",
          pergunta: "Que dois motivos temos para desenvolver um forte desejo por alimento espiritual sólido?",
          resposta: "Primeiro, vamos aprender coisas sobre Jeová que aumentam nosso amor e respeito por ele. Segundo, vamos ficar mais motivados a falar com outros sobre nosso Pai celestial. Também aprendemos a ser rápidos para ajustar nosso modo de pensar quando o entendimento bíblico é atualizado.",
          ordem: 9
        },
        {
          numero: "10",
          texto_base: "Para agradar a Deus, devemos aproveitar outra coisa que Jeová nos dá: nossa vestimenta espiritual. Como assim? O apóstolo Paulo escreveu que devemos nos 'despir da velha personalidade' e nos 'revestir da nova personalidade'. Fazer isso é um processo contínuo, que exige tempo e esforço. Veja o exemplo de Paulo. Quando era jovem, ele se esforçava para agradar a Deus. Mas ele não tinha conhecimento exato da vontade de Deus e, por isso, era pobre em sentido espiritual. Por não conhecer os ensinos de Jesus e ser orgulhoso, Paulo se tornou uma pessoa 'insolente', com várias características ruins de personalidade. Era como se ele estivesse mal vestido em sentido espiritual.",
          pergunta: "De acordo com Colossenses 3:8-10, o que envolve estar bem vestido em sentido espiritual?",
          resposta: "Envolve nos despir da velha personalidade e nos revestir da nova. É um processo contínuo que exige tempo e esforço. Paulo, quando jovem, era orgulhoso e insolente, como alguém 'mal vestido' espiritualmente, porque não conhecia os ensinos de Jesus.",
          ordem: 10
        },
        {
          numero: "11",
          texto_base: "Antes de se tornar cristão, Paulo ficava irado com facilidade. Um relato em Atos mostra que ele tinha tanta raiva dos discípulos de Jesus que 'respirava ameaça e morte' contra eles. Depois de se tornar cristão, Paulo com certeza se esforçou bastante para abandonar essa característica da sua velha personalidade. Mesmo assim, certa vez ele e Barnabé discutiram, e aquela discussão se tornou 'um forte acesso de ira'. Isso foi um passo atrás no progresso de Paulo, mas ele não desistiu. Paulo continuou 'surrando o seu corpo', ou seja, lutando contra as suas imperfeições, para não perder a aprovação de Jeová.",
          pergunta: "Contra que característica de personalidade Paulo lutava? Explique.",
          resposta: "Paulo lutava contra a raiva. Antes de ser cristão, ele 'respirava ameaça e morte' contra os discípulos de Jesus. Mesmo depois de cristão, teve 'um forte acesso de ira' com Barnabé. Mas ele não desistiu e continuou lutando contra suas imperfeições.",
          ordem: 11
        },
        {
          numero: "12",
          texto_base: "Paulo conseguiu fazer mudanças na sua personalidade porque era humilde e não confiava em si mesmo. Assim como Pedro, Paulo confiava 'na força que Deus fornece'. Mesmo assim, às vezes ele se sentia um fracasso. Mas quando ficava desanimado, Paulo pensava nas coisas boas que seu Pai celestial já tinha feito por ele. Isso o deixava mais determinado a persistir em fazer mudanças para agradar a Deus.",
          pergunta: "O que ajudou Paulo a conseguir fazer mudanças na sua personalidade?",
          resposta: "Paulo era humilde e não confiava em si mesmo, mas confiava na força que Deus fornece. Quando ficava desanimado, ele pensava nas coisas boas que Jeová já tinha feito por ele, o que o motivava a persistir em fazer mudanças.",
          ordem: 12
        },
        {
          numero: "13",
          texto_base: "Nós podemos imitar Paulo por reconhecer que, não importa há quanto tempo servimos a Jeová, precisamos continuar usando a vestimenta espiritual que ele nos dá. E como vimos, isso envolve nos livrar da velha personalidade e nos revestir da nova. Se voltarmos a mostrar uma característica ruim de personalidade, como perder a cabeça ou falar de modo grosseiro com alguém, não precisamos achar que somos um fracasso. Em vez disso, devemos continuar tentando mudar nosso modo de pensar e agir. Mas precisamos nos lembrar de algo importante: É possível fazer ajustes em uma roupa literal para conseguirmos vesti-la. Mas a vestimenta espiritual que Jeová nos dá é diferente. Nós é que precisamos nos ajustar a ela. Mudar quem somos para nos ajustar aos padrões de Jeová é a coisa certa a fazer.",
          pergunta: "Como podemos imitar Paulo?",
          resposta: "Podemos reconhecer que sempre precisamos usar a vestimenta espiritual de Jeová. Se mostrarmos características ruins, não devemos desistir, mas continuar tentando mudar. Diferente de uma roupa literal, nós é que precisamos nos ajustar à vestimenta espiritual, mudando quem somos para nos conformar aos padrões de Jeová.",
          ordem: 13
        },
        {
          numero: "14-15",
          texto_base: "Para sermos felizes de verdade, não basta termos alimento e vestimenta espiritual. Nós também precisamos de proteção espiritual. Mas de que forma Jeová nos protege? E como podemos permitir que ele faça isso? O rei Davi falou sobre a proteção espiritual que Jeová dá ao seu povo. Jeová protege seus servos de qualquer coisa ou pessoa que possa destruir sua fé nele. Ele promete que nenhuma arma fabricada contra nós vai ser bem-sucedida. Apesar de Satanás e seus apoiadores serem poderosos, eles jamais vão conseguir nos causar algum dano permanente. Mesmo que eles consigam tirar a nossa vida, Jeová é capaz de nos trazer de volta na ressurreição. Jeová também nos protege por nos ajudar a lidar com as ansiedades que poderiam nos fazer parar de servir a ele. E o nosso amoroso Pai nos dá irmãos e irmãs na fé para nos apoiar e anciãos para nos pastorear. Quando assistimos às reuniões, aprendemos outras maneiras de permitir que Jeová nos ajude e nos proteja.",
          pergunta: "De que forma Jeová protege seus servos em sentido espiritual? (Salmo 27:5) (Veja também a imagem da capa.)",
          resposta: "Jeová protege nossa fé de qualquer ameaça. Nenhuma arma contra nós terá sucesso. Mesmo se perdermos a vida, Ele pode nos ressuscitar. Ele nos ajuda com ansiedades e nos dá irmãos na fé e anciãos para nos apoiar. Nas reuniões aprendemos como permitir que Ele nos proteja.",
          ordem: 14
        },
        {
          numero: "16",
          texto_base: "Quando Davi seguia os padrões de Jeová, ele era protegido porque Jeová o ajudava a tomar decisões sábias, que traziam felicidade. Por outro lado, quando ignorava esses padrões, Davi não era protegido das consequências de suas ações. Mas em algumas ocasiões, Davi sofreu por causa das ações de outras pessoas. Quando isso acontecia, ele contava para Jeová todas as suas ansiedades. E Jeová consolava e acalmava Davi, garantindo que o amava muito e que cuidaria bem dele.",
          pergunta: "De que maneiras Jeová protegeu Davi?",
          resposta: "Quando Davi seguia os padrões de Jeová, ele recebia ajuda para tomar decisões sábias. Quando sofria por causa de outros, ele contava suas ansiedades a Jeová, que o consolava e acalmava, garantindo seu amor e cuidado.",
          ordem: 15
        },
        {
          numero: "17",
          texto_base: "Podemos imitar o exemplo de Davi buscando as orientações de Jeová antes de tomar decisões. Também entendemos que às vezes sofremos, não porque Jeová deixou de nos proteger, mas porque nós tomamos decisões ruins. E quando sofremos por causa das ações de outros, abrimos nosso coração para Jeová, confiando que ele vai proteger nossa mente e nosso coração.",
          pergunta: "Como podemos imitar Davi?",
          resposta: "Podemos buscar as orientações de Jeová antes de tomar decisões. Reconhecemos que às vezes sofremos por nossas próprias escolhas ruins. Quando sofremos por causa de outros, abrimos nosso coração para Jeová, confiando que Ele protegerá nossa mente e coração.",
          ordem: 16
        },
        {
          numero: "18",
          texto_base: "Nosso texto do ano para 2026 diz: 'Felizes os que têm consciência de sua necessidade espiritual.' Hoje isso é mais verdade do que nunca. Em todo lugar, vemos pessoas infelizes. Por quê? Porque muitas negam que têm uma necessidade espiritual. Outras até acreditam em Deus, mas o adoram do jeito errado. E ainda outras confiam nas orientações de simples humanos. Não devemos permitir que a atitude dessas pessoas nos influencie. Como podemos continuar cuidando da nossa necessidade espiritual? Por aproveitar o alimento espiritual que Jeová provê, nos revestir da nova personalidade e buscar a proteção que Jeová nos dá.",
          pergunta: "O que não devemos permitir, e como podemos continuar cuidando da nossa necessidade espiritual? (Veja também as imagens.)",
          resposta: "Não devemos permitir que pessoas que negam a necessidade espiritual, adoram a Deus de forma errada ou confiam em humanos nos influenciem. Cuidamos de nossa necessidade espiritual aproveitando o alimento espiritual de Jeová, revestindo-nos da nova personalidade e buscando Sua proteção.",
          ordem: 17
        }
      ],
      recapitulacao: [
        {
          pergunta: "O que podemos fazer para aproveitar bem o alimento espiritual?",
          resposta: "Devemos nos alimentar regularmente das verdades básicas da Palavra de Deus e desenvolver desejo por alimento sólido. Precisamos reservar tempo para entender a Bíblia a fundo e ser rápidos para ajustar nosso modo de pensar quando o entendimento é atualizado.",
          ordem: 1
        },
        {
          pergunta: "O que podemos fazer para aproveitar bem a vestimenta espiritual?",
          resposta: "Devemos nos despir da velha personalidade e nos revestir da nova. Se mostrarmos características ruins, não devemos desistir, mas continuar tentando mudar. Nós é que precisamos nos ajustar aos padrões de Jeová.",
          ordem: 2
        },
        {
          pergunta: "O que podemos fazer para aproveitar bem a proteção espiritual?",
          resposta: "Devemos buscar as orientações de Jeová antes de tomar decisões, abrir nosso coração a Ele quando sofremos, assistir às reuniões e confiar que Ele protegerá nossa mente e coração.",
          ordem: 3
        }
      ]
    },
    // ESTUDO 2: 9-15 de março
    {
      numero_estudo: 2,
      data_inicio: "2026-03-09",
      data_fim: "2026-03-15",
      cantico_inicial: 45,
      cantico_inicial_nome: "Os pensamentos do meu coração",
      cantico_final: 34,
      cantico_final_nome: "Andarei em integridade",
      titulo: "Você é capaz de lutar contra sentimentos negativos!",
      texto_tema: "Homem miserável que eu sou! — Rom. 7:24",
      objetivo: "Aprender a lidar com pensamentos e sentimentos negativos.",
      paragrafos: [
        {
          numero: "1-2",
          texto_base: "Do que você lembra quando pensa no apóstolo Paulo? Que ele era um missionário corajoso, um instrutor habilidoso ou alguém que escreveu vários livros da Bíblia? Tudo isso é verdade! Mas às vezes, como muitos de nós, ele tinha que lutar contra sentimentos negativos, como tristeza, desânimo e ansiedade. Em sua carta aos romanos, Paulo mostrou que tinha sentimentos que muitos de nós também temos. Mesmo sendo um cristão fiel, Paulo estava numa luta entre sua inclinação para fazer coisas erradas e seu desejo sincero de fazer a vontade de Deus. Às vezes, Paulo também tinha que lidar com sentimentos negativos relacionados a um problema persistente e a erros do passado.",
          pergunta: "Como o apóstolo Paulo se sentia às vezes? E por que podemos nos identificar com ele? (Romanos 7:21-24)",
          resposta: "Paulo, apesar de ser um cristão fiel, lutava contra sentimentos negativos como tristeza, desânimo e ansiedade. Ele enfrentava uma luta interna entre sua inclinação para errar e seu desejo de fazer a vontade de Deus. Podemos nos identificar porque também enfrentamos lutas semelhantes.",
          ordem: 1
        },
        {
          numero: "3",
          texto_base: "Apesar de sua luta interna, Paulo não deixou que sentimentos negativos o controlassem. Neste estudo, vamos considerar as seguintes perguntas: Por que às vezes Paulo se sentia 'miserável'? Como ele lidava com sentimentos negativos? E como podemos ser bem-sucedidos na luta contra nossos sentimentos negativos?",
          pergunta: "O que vamos ver neste estudo? (Veja também 'Entenda Melhor'.)",
          resposta: "Vamos considerar por que Paulo às vezes se sentia 'miserável', como ele lidava com sentimentos negativos e como podemos ser bem-sucedidos na luta contra nossos próprios sentimentos negativos.",
          ordem: 2
        },
        {
          numero: "4",
          texto_base: "Erros do passado. Antes de se tornar cristão, Paulo, que era conhecido como Saulo, fez muitas coisas ruins. Por exemplo, ele aprovou o assassinato de um homem fiel chamado Estêvão. Além disso, Saulo liderou uma perseguição cruel contra os cristãos.",
          pergunta: "Por que Paulo teve sentimentos negativos?",
          resposta: "Paulo teve sentimentos negativos por causa de erros graves que cometeu no passado. Antes de ser cristão, ele aprovou o assassinato de Estêvão e liderou uma perseguição cruel contra os cristãos.",
          ordem: 3
        },
        {
          numero: "5",
          texto_base: "Depois que se tornou cristão, o apóstolo Paulo às vezes se sentia culpado pelas coisas que tinha feito. Parece que, ao longo dos anos, os erros do passado o deixaram cada vez mais triste. Por exemplo, quando escreveu sua primeira carta aos coríntios, mais ou menos no ano 55, ele disse: 'Não sou digno de ser chamado apóstolo, porque perseguia a congregação de Deus.' Uns cinco anos mais tarde, na sua carta aos efésios, ele falou que era 'menor que o menor de todos os santos'. Quando escreveu para Timóteo, Paulo também disse que costumava ser 'blasfemador, perseguidor e insolente'. Ao visitar as congregações, deve ter sido muito difícil para Paulo encontrar os irmãos que ele tinha perseguido ou os parentes deles.",
          pergunta: "Como Paulo se sentia por causa do que tinha feito?",
          resposta: "Paulo se sentia muito culpado pelos erros do passado. Ao longo dos anos, ele se descreveu como 'não digno de ser apóstolo', 'menor que o menor dos santos' e 'blasfemador, perseguidor e insolente'. Deve ter sido difícil encontrar aqueles que ele havia perseguido.",
          ordem: 4
        },
        {
          numero: "6",
          texto_base: "Um espinho na carne. Paulo falou de um problema que o deixava ansioso e era como 'um espinho na carne'. Paulo não disse exatamente qual era o problema. Mas a expressão que ele usou indica que era algo que trazia muita dor para ele. Pode ter sido um problema físico, emocional ou alguma outra coisa.",
          pergunta: "Que outra coisa deixava Paulo ansioso? (Veja também a nota.)",
          resposta: "Paulo tinha 'um espinho na carne' - um problema persistente que o deixava ansioso. Não sabemos exatamente o que era, mas trazia muita dor para ele, podendo ser um problema físico, emocional ou de outra natureza.",
          ordem: 5
        },
        {
          numero: "7",
          texto_base: "Suas imperfeições. Paulo às vezes se sentia desanimado por causa das suas imperfeições. Ele queria fazer o que era certo, mas se sentia incapaz. Paulo reconheceu que estava sempre lutando para não seguir suas tendências erradas. Ele se esforçava muito para melhorar a sua personalidade. Mas de vez em quando, algumas características negativas da sua personalidade voltavam a aparecer. Quando isso acontecia, Paulo devia se sentir muito frustrado.",
          pergunta: "Como Paulo se sentia por causa das suas imperfeições? (Romanos 7:18, 19)",
          resposta: "Paulo se sentia desanimado e frustrado por causa de suas imperfeições. Ele queria fazer o certo mas se sentia incapaz, e apesar de se esforçar muito, às vezes características negativas voltavam a aparecer.",
          ordem: 6
        },
        {
          numero: "8",
          texto_base: "Em suas cartas, Paulo escreveu várias vezes sobre características e desejos errados que os cristãos tinham que combater. Além disso, Paulo meditava em como ele e outros cristãos podiam lutar contra tendências erradas e melhorar sua personalidade com a ajuda do espírito santo. Isso mostra que, para lidar com suas imperfeições, Paulo pensava em quais eram seus pontos fracos, buscava a orientação das Escrituras e identificava os passos necessários para vencer essa luta. E já que ele aconselhava outros a fazer isso, podemos ter certeza que ele também colocava em prática esses conselhos.",
          pergunta: "O que Paulo fazia para lidar com suas imperfeições?",
          resposta: "Paulo pensava em seus pontos fracos, buscava orientação nas Escrituras e identificava passos para vencer a luta contra tendências erradas. Ele meditava em como melhorar sua personalidade com a ajuda do espírito santo.",
          ordem: 7
        },
        {
          numero: "9-10",
          texto_base: "Às vezes, Paulo se sentia desanimado, mas na maior parte do tempo ele tinha uma atitude positiva. Por exemplo, ele ficava feliz de ouvir boas notícias sobre congregações distantes. A amizade que tinha com os irmãos também era uma fonte de alegria para ele. Além disso, Paulo ficava feliz porque tinha uma amizade forte com Jeová e o servia 'com uma consciência limpa'. Até quando estava numa prisão em Roma, ele incentivou os irmãos a 'se alegrar no Senhor'. As palavras de Paulo mostram que ele não ficava o tempo todo pensando em seus problemas e suas falhas. Quando pensamentos negativos vinham à sua mente, ele logo pensava em coisas que o ajudavam a ter novamente uma atitude feliz e positiva. Outra coisa que ajudava Paulo a lutar contra sentimentos negativos era que ele via o resgate como um presente especial de Deus para ele. Paulo tinha certeza de que receberia o perdão de Jeová por meio do sacrifício de Jesus Cristo. Assim, ele podia continuar 'prestando serviço sagrado' a Deus com alegria, apesar de erros do passado e de suas imperfeições.",
          pergunta: "O que ajudou Paulo a lutar contra sentimentos negativos? (Efésios 1:7) (Veja também a imagem.)",
          resposta: "Paulo mantinha atitude positiva alegando-se com boas notícias, amizades e sua amizade com Jeová. Quando pensamentos negativos vinham, ele logo focava em coisas positivas. Especialmente, ele via o resgate como um presente pessoal e tinha certeza do perdão de Jeová.",
          ordem: 8
        },
        {
          numero: "11",
          texto_base: "Assim como Paulo, temos uma luta dentro de nós. É um desafio pensar, agir e falar de um modo que agrade a Jeová. Pode ser que às vezes até pensemos: 'Que pessoa miserável eu sou!' Uma irmã de 26 anos chamada Eliza explica como ela se sente: 'É animador pra mim pensar na situação difícil que Paulo enfrentou. Eu fico aliviada de saber que não sou a única a me sentir assim. O exemplo dele também me lembra que Jeová entende os desafios que seus servos enfrentam.' O que podemos fazer para, assim como Paulo, continuarmos felizes e com a consciência limpa, apesar de nossos sentimentos negativos?",
          pergunta: "Como o exemplo de Paulo faz você se sentir?",
          resposta: "O exemplo de Paulo é animador porque mostra que até servos fiéis enfrentam lutas internas. É reconfortante saber que não estamos sozinhos e que Jeová entende os desafios que seus servos enfrentam.",
          ordem: 9
        },
        {
          numero: "12",
          texto_base: "Mantenha uma boa rotina espiritual. Desenvolver uma boa rotina espiritual nos ajuda a focar em coisas positivas. Podemos comparar nossa rotina espiritual com hábitos saudáveis. Geralmente nos alimentar bem, fazer exercícios regularmente e dormir o suficiente contribui para o nosso bem-estar. Da mesma forma, todos nós já sentimos como é bom ler a Palavra de Deus regularmente, preparar, assistir e participar das reuniões e ir ao campo. Essas atividades nos animam e nos ajudam a lidar com pensamentos negativos.",
          pergunta: "Como manter uma boa rotina espiritual nos ajuda?",
          resposta: "Uma boa rotina espiritual nos ajuda a focar em coisas positivas. Assim como hábitos saudáveis contribuem para o bem-estar físico, ler a Bíblia, preparar e assistir reuniões e pregar nos animam e ajudam a lidar com pensamentos negativos.",
          ordem: 10
        },
        {
          numero: "13-14",
          texto_base: "Veja o exemplo de John, que aos 39 anos descobriu que tinha um tipo raro de câncer. No começo, ele ficou ansioso e com muito medo. Ele pensava: 'Não é justo! Eu sou muito jovem pra ficar doente.' Nessa época, o filho dele tinha apenas 3 anos. O que ajudou John a lidar com esses sentimentos negativos? Ele conta: 'Apesar de me sentir muito cansado, eu fiz questão que nossa família continuasse tendo uma rotina espiritual. A gente assistia a todas as reuniões, ia no campo toda semana e fazia adoração em família regularmente, mesmo tendo muitos compromissos.' Olhando para trás, ele conclui: 'Depois que passou o choque inicial, o amor e o poder de Jeová me ajudaram a superar os pensamentos negativos. Jeová me deu forças, e ele pode fazer o mesmo por você.' Eliza, citada antes, diz: 'Toda vez que vou às reuniões e faço o meu estudo pessoal, eu tenho mais certeza de que Jeová me escuta e me ama. Isso me deixa feliz.' Nolan, um superintendente de circuito na África, conta como ele e sua esposa, Diane, se sentem: 'Fazemos questão de manter nossa rotina espiritual mesmo quando estamos desanimados. Jeová sempre mostra de alguma forma que está do nosso lado nos ajudando a ter a atitude certa. Procuramos nos lembrar que Jeová vai nos ajudar e abençoar. Podemos até não saber como, mas temos certeza de que ele vai!'",
          pergunta: "Dê exemplos que mostram como faz bem ter uma boa rotina espiritual.",
          resposta: "John, diagnosticado com câncer, manteve a rotina espiritual da família e isso o ajudou a superar pensamentos negativos. Eliza sente mais certeza do amor de Jeová quando vai às reuniões e estuda. Nolan e Diane mantêm a rotina mesmo desanimados, confiando que Jeová os ajudará.",
          ordem: 11
        },
        {
          numero: "15",
          texto_base: "Nós também podemos fazer outras coisas para superar pensamentos negativos. Por exemplo, imagine que você esteja com dor nas costas. Para melhorar, só fazer uma massagem talvez não seja suficiente. Pode ser preciso pesquisar mais sobre o assunto e até mesmo falar com um médico. Assim você vai conseguir identificar a causa da dor. Para lidar com sentimentos negativos, podemos fazer algo parecido. Talvez precisemos fazer pesquisas usando a Bíblia e nossas publicações e até conversar com um irmão maduro. Vamos ver outras sugestões que podem nos ajudar.",
          pergunta: "O que mais podemos fazer para superar pensamentos negativos? Ilustre.",
          resposta: "Podemos pesquisar na Bíblia e publicações, e conversar com irmãos maduros, assim como alguém com dor nas costas pesquisa e consulta um médico para identificar a causa do problema.",
          ordem: 12
        },
        {
          numero: "16",
          texto_base: "Ore para entender melhor a sua situação. O rei Davi sabia que Jeová o conhecia muito bem. Por isso, ele pediu que Jeová o ajudasse a identificar a causa das 'suas ansiedades'. Você também pode pedir que Jeová o ajude a identificar o que te faz ter pensamentos negativos e como lidar com eles. Você pode se perguntar: 'O que talvez esteja me deixando ansioso? Existe algum gatilho que me leva a ter pensamentos negativos? Tenho a tendência de alimentar um pensamento negativo em vez de rejeitá-lo?'",
          pergunta: "O que pode ajudar você a identificar a causa dos seus sentimentos negativos? (Salmo 139:1-4, 23, 24)",
          resposta: "Podemos orar como Davi pedindo que Jeová nos ajude a identificar as causas dos pensamentos negativos. Devemos nos perguntar: O que me deixa ansioso? Existe algum gatilho? Tenho tendência de alimentar pensamentos negativos em vez de rejeitá-los?",
          ordem: 13
        },
        {
          numero: "17",
          texto_base: "Adapte seu estudo pessoal à sua situação. De vez em quando, pode ser de ajuda estudar algumas características da personalidade de Jeová. Por exemplo, refletir sobre o perdão de Jeová e o resgate foi muito bom para o apóstolo Paulo. Então, imite o exemplo dele. Use o Guia de Pesquisa para Testemunhas de Jeová, o Índice das Publicações da Torre de Vigia ou outras ferramentas de estudo disponíveis em seu idioma para aprender mais sobre assuntos como a misericórdia, o perdão e o amor leal de Deus. Quando encontrar artigos que podem ser de ajuda para você, crie uma lista com eles e deixe essa lista num lugar visível. Daí quando começar a se sentir pra baixo, estude esses artigos e pense em como eles podem ajudar você em sua situação.",
          pergunta: "Que assuntos você pode incluir em seu estudo pessoal para ter pensamentos mais positivos? (Veja também a imagem.)",
          resposta: "Podemos estudar características de Jeová como misericórdia, perdão e amor leal. Usar ferramentas de pesquisa para encontrar artigos sobre esses assuntos, fazer uma lista e estudá-los quando nos sentirmos desanimados.",
          ordem: 14
        },
        {
          numero: "18",
          texto_base: "Eliza, citada antes, fez um projeto de estudo sobre Jó. Ela conta: 'Eu me identifico muito com Jó. Ele enfrentou um problema atrás do outro, sem nem saber porque aquilo estava acontecendo. Mesmo assim, em seu pior momento, Jó continuou confiando na ajuda de Jeová.' Diane, já mencionada, diz: 'Eu e meu marido estamos fazendo um projeto de estudo usando o livro Achegue-se a Jeová. Agradecemos a Jeová por nos moldar, assim como um oleiro faz com o barro. Em vez de focarmos em nossos erros, tentamos imaginar Jeová nos moldando e nos ajudando a ser pessoas melhores. Isso nos achega ainda mais a ele.'",
          pergunta: "Que projetos de estudo têm ajudado alguns irmãos?",
          resposta: "Eliza estudou sobre Jó e se identificou com ele por enfrentar problemas sem saber o motivo, mas continuar confiando em Jeová. Diane e seu marido estudam o livro 'Achegue-se a Jeová' e imaginam Jeová os moldando como um oleiro.",
          ordem: 15
        },
        {
          numero: "19",
          texto_base: "Uma boa rotina espiritual e um programa de estudo adaptado às nossas necessidades não vão fazer os sentimentos e pensamentos negativos desaparecerem por completo. De vez em quando, ainda vamos ficar desanimados. Mas com a ajuda de Jeová, podemos parar de alimentar pensamentos negativos e nos acalmar. Podemos ter certeza de que, na maior parte do tempo, a nossa vida vai ser feliz porque temos uma consciência limpa e somos amigos de Jeová.",
          pergunta: "O que vai acontecer de vez em quando, mas que certeza podemos ter?",
          resposta: "Ainda vamos ficar desanimados de vez em quando, pois pensamentos negativos não desaparecem por completo. Mas com a ajuda de Jeová podemos nos acalmar e ter uma vida feliz, com consciência limpa e amizade com Ele.",
          ordem: 16
        },
        {
          numero: "20",
          texto_base: "Queremos fazer o máximo para não ser controlados por sentimentos negativos relacionados ao nosso passado, aos nossos problemas ou às nossas imperfeições. Com a ajuda de Jeová, podemos ser bem-sucedidos na luta contra os pensamentos e sentimentos negativos! Não vemos a hora do novo mundo chegar. Lá, não vamos precisar lutar para conseguir pensar em coisas positivas. Pelo contrário, vamos acordar todo dia sem nenhuma ansiedade e felizes por servirmos nosso amoroso Deus, Jeová!",
          pergunta: "O que queremos fazer?",
          resposta: "Queremos fazer o máximo para não ser controlados por sentimentos negativos. Com a ajuda de Jeová, podemos vencer essa luta. No novo mundo, acordaremos sem ansiedade, felizes por servir nosso amoroso Deus.",
          ordem: 17
        }
      ],
      recapitulacao: [
        {
          pergunta: "Por que às vezes o apóstolo Paulo tinha sentimentos negativos?",
          resposta: "Por causa de erros graves do passado (perseguir cristãos), um 'espinho na carne' que o atormentava, e suas imperfeições que o faziam se sentir frustrado quando características negativas voltavam a aparecer.",
          ordem: 1
        },
        {
          pergunta: "O que ajudou Paulo a manter uma atitude positiva, apesar de às vezes ficar desanimado?",
          resposta: "Ele focava em coisas positivas como boas notícias, amizades e sua relação com Jeová. Via o resgate como um presente pessoal de Deus e tinha certeza do perdão de Jeová através do sacrifício de Jesus.",
          ordem: 2
        },
        {
          pergunta: "Como podemos lutar contra sentimentos negativos?",
          resposta: "Mantendo uma boa rotina espiritual, orando para entender nossa situação, adaptando nosso estudo pessoal às nossas necessidades, pesquisando na Bíblia e publicações, e conversando com irmãos maduros.",
          ordem: 3
        }
      ]
    },
    // ESTUDO 3: 16-22 de março
    {
      numero_estudo: 3,
      data_inicio: "2026-03-16",
      data_fim: "2026-03-22",
      cantico_inicial: 20,
      cantico_inicial_nome: "Jeová nos deu o seu melhor",
      cantico_final: 19,
      cantico_final_nome: "A Ceia do Senhor",
      titulo: "Por que precisamos do resgate?",
      texto_tema: "Quem me livrará do corpo que é submetido a essa morte? — Rom. 7:24",
      objetivo: "Ver como o resgate traz perdão, cura e reconciliação.",
      paragrafos: [
        {
          numero: "1-2",
          texto_base: "Imagine a seguinte cena: um prédio desaba, e um homem acaba ficando preso nos escombros. Ele está vivo, mas não consegue sair dessa situação sozinho. Tudo que ele pode fazer é gritar por ajuda e esperar ser resgatado por alguém. Cada um de nós está numa situação parecida. Por Adão ter desobedecido seu Criador, ele se tornou pecador. Como somos descendentes de Adão, nós também somos pecadores. Por causa disso, todos os humanos ficaram, por assim dizer, presos debaixo dos escombros do pecado. E não podemos nos livrar das consequências disso sozinhos. Em sua carta aos romanos, o apóstolo Paulo disse que todos somos 'cativos', ou seja, estamos presos, ao pecado. Ele implorou para ser salvo 'do corpo que é submetido a essa morte'. Paulo estava preso ao pecado herdado, que, por fim, levaria a sua morte. O mesmo acontece com a gente. Estamos em perigo e precisamos ser resgatados!",
          pergunta: "Por que precisamos que alguém nos resgate? (Romanos 7:22-24) (Veja também a imagem.)",
          resposta: "Assim como alguém preso em escombros precisa ser resgatado, nós estamos 'presos' ao pecado herdado de Adão. Não conseguimos nos livrar sozinhos das consequências do pecado, que levam à morte. Por isso precisamos ser resgatados.",
          ordem: 1
        },
        {
          numero: "3",
          texto_base: "Felizmente, depois de falar da situação difícil em que estava, Paulo nos deu esperança. Depois de perguntar: 'Quem me livrará do corpo que é submetido a essa morte?', ele respondeu com bastante confiança: 'Dou graças a Deus, por meio de Jesus Cristo, nosso Senhor!' Paulo estava se referindo ao sacrifício de resgate de Jesus. O resgate nos salva porque nos dá (1) o perdão dos nossos pecados, (2) a cura da nossa condição pecaminosa e (3) a reconciliação com nosso Criador. Ao estudar esses pontos, vamos aumentar nosso amor por Jeová, 'o Deus que dá esperança'. Também vamos ser mais gratos a Jesus, 'por meio de quem temos o nosso livramento por resgate'.",
          pergunta: "De que formas o resgate nos salva?",
          resposta: "O resgate nos salva de três formas: (1) nos dá o perdão dos nossos pecados, (2) a cura da nossa condição pecaminosa e (3) a reconciliação com nosso Criador. Jesus é o meio pelo qual temos esse livramento.",
          ordem: 2
        },
        {
          numero: "4-5",
          texto_base: "Nós precisamos do resgate para sermos perdoados pelos nossos pecados. Todo humano imperfeito comete pecados, seja em palavras ou em ações. Alguns pecados são bem graves. Por exemplo, de acordo com a Lei mosaica, o adultério e o assassinato eram crimes que deveriam ser punidos com a morte da pessoa. É claro que muitos pecados não são tão graves como esses. Mas ainda assim, são pecados. Por exemplo, Davi disse: 'Vou vigiar o meu caminho para não pecar com a minha língua.' Isso mostra que até algo que falamos pode ser um pecado. Pare e pense nas coisas que você já disse ou fez. Alguma vez você disse algo que preferia não ter dito? Você já fez alguma coisa e depois se arrependeu? Com certeza você respondeu que sim a essas duas perguntas. A Bíblia diz: 'Se fazemos a declaração: Não temos pecado, estamos enganando a nós mesmos e a verdade não está em nós.'",
          pergunta: "Por que todos nós precisamos do resgate? (Eclesiastes 7:20)",
          resposta: "Porque todos os humanos imperfeitos cometem pecados, seja em palavras ou ações. Mesmo pecados que parecem menores ainda são pecados. Ninguém pode dizer que não tem pecado, pois estaria enganando a si mesmo.",
          ordem: 3
        },
        {
          numero: "6-7",
          texto_base: "O resgate é o que torna possível que Jeová perdoe os nossos pecados. Mas é claro que isso não significa que Jeová fecha os olhos para os nossos pecados e não se importa com eles. Na verdade, esse é um assunto muito sério para Jeová. Por causa de sua justiça perfeita, é preciso existir uma base sólida para ele perdoar nossos pecados. A Lei mosaica exigia que os israelitas oferecessem sacrifícios de animais para fazer expiação pelos seus pecados. Esses sacrifícios mostravam que os humanos precisavam de um sacrifício muito maior. Foi o sacrifício de Jesus que trouxe muitas bênçãos e que deu a base para Jeová perdoar nossos pecados. As palavras de Paulo aos cristãos em Corinto mostram que ele entendeu o grande valor da morte sacrificial de Jesus. Depois de falar sobre as coisas erradas que eles tinham feito no passado, Paulo disse: 'Vocês foram lavados; vocês foram santificados; vocês foram declarados justos no nome do Senhor Jesus Cristo e com o espírito do nosso Deus.'",
          pergunta: "O que torna possível que Jeová perdoe nossos pecados? (Veja também a imagem.)",
          resposta: "O sacrifício de resgate de Jesus torna possível o perdão. Jeová não ignora o pecado, mas devido à sua justiça, precisava de uma base sólida para perdoar. Os sacrifícios de animais apontavam para o sacrifício maior de Jesus, que nos 'lava', santifica e declara justos.",
          ordem: 4
        },
        {
          numero: "8",
          texto_base: "Enquanto você se prepara para a Celebração deste ano, tire tempo para pensar no que o perdão de Jeová significa para você. Por exemplo, graças ao resgate, você não precisa ficar carregando o peso da culpa por pecados que cometeu no passado e já se arrependeu. Mas e se você acha difícil aceitar isso? Talvez você pense: 'Eu sei que Jeová pode me perdoar, mas eu não consigo perdoar a mim mesmo.' Se você se sente assim, lembre do seguinte: é Jeová quem perdoa, e ele deu ao seu Filho, Jesus, autoridade para nos julgar. Jeová não deu a você, nem a qualquer outro humano, a tarefa de decidir quem ele vai perdoar ou não. A Bíblia diz: 'Se estamos andando na luz assim como [Jeová] está na luz, . . . o sangue de Jesus, seu Filho, nos purifica de todo o pecado.' Podemos confiar totalmente nisso, assim como confiamos em qualquer outro ensino da Bíblia. O resgate deu a Jeová a base legal para mostrar misericórdia a nós, e sua Palavra diz que ele está 'sempre pronto a perdoar'.",
          pergunta: "No que você pode pensar enquanto se prepara para a Celebração deste ano?",
          resposta: "Pensar no que o perdão de Jeová significa pessoalmente. Graças ao resgate, não precisamos carregar culpa por pecados dos quais já nos arrependemos. Se for difícil perdoar a si mesmo, lembrar que é Jeová quem perdoa e que podemos confiar que Ele está 'sempre pronto a perdoar'.",
          ordem: 5
        },
        {
          numero: "9",
          texto_base: "Na Bíblia, a palavra 'pecado' se refere não só a uma ação errada, mas também a uma condição, que nós herdamos desde o momento em que fomos concebidos. Por causa dessa condição, além de termos a tendência de fazer coisas erradas, nosso corpo não funciona da maneira como Jeová tinha projetado, e ficamos doentes, envelhecemos e morremos. É por isso que até bebês recém-nascidos, que ainda não fizeram nada de errado, podem ficar doentes e morrer. Também é por isso que tanto as pessoas boas como as ruins sofrem e morrem. Todos nós, descendentes de Adão, estamos nessa situação difícil.",
          pergunta: "Além de ações erradas, o que o pecado envolve? (Salmo 51:5 e nota)",
          resposta: "O pecado também é uma condição herdada desde a concepção. Por causa dela, temos tendência a errar, nosso corpo não funciona como Jeová projetou, ficamos doentes, envelhecemos e morremos. Até bebês podem sofrer e morrer por essa condição herdada.",
          ordem: 6
        },
        {
          numero: "10",
          texto_base: "Como essa condição pecaminosa afetou o primeiro casal humano? O pecado produziu uma mudança drástica dentro deles. Depois que se rebelaram, Adão e Eva começaram a sentir imediatamente as consequências de desobedecer a lei de Deus, uma lei que estava 'escrita no coração' deles. Eles perceberam que algo no seu íntimo tinha mudado, e não foi para melhor. Eles sentiram a necessidade de cobrir partes do seu corpo e de se esconder do seu Criador, como se fossem criminosos. Pela primeira vez, Adão e Eva tiveram sentimentos de culpa, ansiedade, insegurança, dor e vergonha. E a partir daquele dia, eles teriam que lidar com esses sentimentos até a sua morte.",
          pergunta: "Como a condição pecaminosa de Adão e Eva os afetou?",
          resposta: "O pecado produziu uma mudança drástica neles. Sentiram necessidade de se cobrir e esconder de Deus. Pela primeira vez tiveram culpa, ansiedade, insegurança, dor e vergonha, sentimentos que teriam até a morte.",
          ordem: 7
        },
        {
          numero: "11",
          texto_base: "Assim como aconteceu com o primeiro casal humano, nossa condição pecaminosa nos faz sentir culpa, vergonha e ansiedade. É por causa da imperfeição que sofremos em sentido físico e emocional. Não importa o quanto tentemos melhorar nossa situação, não conseguimos ter uma vida livre de problemas e dificuldades. Por quê? Porque, como a Bíblia diz, nós fomos 'sujeitos à futilidade'. Isso se aplica não só a nós individualmente, mas à humanidade em geral. Por exemplo, pense em todos os esforços feitos para cuidar do meio ambiente, para controlar a violência, para eliminar a pobreza e para alcançar a paz entre as nações. Mesmo com certo progresso, esses esforços têm sido fúteis, ou em vão, porque não acabaram com problemas assim. Mas como o resgate pode nos livrar da nossa condição pecaminosa?",
          pergunta: "Que efeito nossa condição pecaminosa tem em nós?",
          resposta: "Nos faz sentir culpa, vergonha e ansiedade, e sofremos física e emocionalmente. Não conseguimos ter vida livre de problemas porque fomos 'sujeitos à futilidade'. Esforços humanos não acabam com os problemas fundamentais.",
          ordem: 8
        },
        {
          numero: "12",
          texto_base: "O resgate nos dá a esperança de que 'a própria criação . . . será libertada da escravidão à decadência'. Isso significa que no novo mundo de Deus, quando nos tornarmos perfeitos, não vamos mais ser atormentados por doenças físicas, mentais e emocionais. Nem teremos mais sentimentos que podem nos deixar paralisados, como, por exemplo, culpa, ansiedade, insegurança, dor ou vergonha. Além disso, nossos esforços para cuidar do meio ambiente e para viver em paz uns com os outros não serão mais fúteis. Em vez disso, eles darão bons resultados porque viveremos debaixo do governo daquele que nos resgatou, o 'Príncipe da Paz', Jesus Cristo.",
          pergunta: "Que esperança o resgate nos dá?",
          resposta: "O resgate nos dá esperança de que no novo mundo, quando formos perfeitos, não seremos atormentados por doenças nem sentimentos negativos como culpa e ansiedade. Nossos esforços terão sucesso sob o governo do 'Príncipe da Paz', Jesus Cristo.",
          ordem: 9
        },
        {
          numero: "13",
          texto_base: "Pense um pouco em como será a sua vida quando você não for mais imperfeito. Imagine acordar todo dia se sentindo bem, e nunca mais se preocupar se você e as pessoas que você ama vão passar fome, ficar doentes ou morrer. Até mesmo agora você pode encontrar certa paz por se 'apegar firmemente à esperança . . . como âncora para a alma, tanto segura como firme'. Assim como uma âncora pode dar estabilidade a um barco, sua esperança pode dar estabilidade para a sua fé e ajudar você a enfrentar qualquer provação. Você pode ter certeza absoluta de que Jeová será 'o recompensador dos que o buscam seriamente'. Sua esperança para o futuro e o consolo que você sente desde agora só são possíveis graças ao resgate.",
          pergunta: "Em que você pode pensar enquanto se prepara para a Celebração deste ano?",
          resposta: "Pensar em como será a vida quando não formos mais imperfeitos: acordar bem, sem preocupações com fome, doença ou morte. Nossa esperança é uma 'âncora para a alma', dando estabilidade para enfrentar provações. Isso só é possível graças ao resgate.",
          ordem: 10
        },
        {
          numero: "14",
          texto_base: "Desde que Adão e Eva pecaram, os humanos ficaram separados de seu Criador. A Bíblia até mesmo diz que há inimizade entre a humanidade como um todo e Deus. Mas por quê? Os padrões de Jeová são perfeitos, por isso é impossível que ele simplesmente ignore o pecado. A Bíblia fala sobre Jeová: 'Teus olhos são puros demais para ver o que é mau; não podes tolerar a maldade.' Ou seja, o pecado criou um abismo entre Deus e o homem. Nenhum de nós pode ter uma amizade com Jeová a não ser que exista uma ponte nos reconciliando com ele. O resgate é essa ponte que possibilita nossa reconciliação com Deus.",
          pergunta: "De que forma o pecado afeta nossa amizade com o Criador, e por quê?",
          resposta: "O pecado criou um abismo entre nós e Deus. Os olhos de Jeová são puros demais para ver o mal e Ele não pode ignorar o pecado. Precisamos do resgate como uma 'ponte' que possibilita nossa reconciliação com Deus.",
          ordem: 11
        },
        {
          numero: "15",
          texto_base: "A Bíblia diz que Jesus é 'um sacrifício propiciatório pelos nossos pecados'. A palavra grega traduzida como 'sacrifício propiciatório' pode se referir a um 'meio de pacificação'. Pacificar pode envolver a ideia de satisfazer as exigências de alguém para restabelecer a paz. Em que sentido o resgate satisfez Jeová? É claro que a morte de seu Filho não satisfez Jeová no sentido de que ele ficou feliz com isso. Na verdade, o resgate satisfez o padrão de justiça de Jeová. Agora ele tinha uma base para restabelecer a amizade entre ele e a humanidade. Jeová podia até mesmo 'creditar' justiça àqueles que o adoraram fielmente antes da morte de Cristo. Como? Com base no resgate que ainda viria. Jeová tinha absoluta certeza de que seu Filho, Jesus, pagaria o resgate. Assim, o resgate abriu o caminho para as pessoas se reconciliarem com Deus.",
          pergunta: "De que forma a morte de Jesus permitiu que Jeová recuperasse a amizade com os humanos?",
          resposta: "A morte de Jesus satisfez o padrão de justiça de Jeová, dando-lhe base legal para restabelecer amizade com a humanidade. Jeová até pôde 'creditar' justiça a fiéis antes de Cristo, com base no resgate que viria. Assim o resgate abriu o caminho para reconciliação.",
          ordem: 12
        },
        {
          numero: "16",
          texto_base: "Pense no que a reconciliação com Deus significa para você. Por exemplo, talvez você se refira a Jeová como seu 'Pai', assim como Jesus nos ensinou. E pode ser que, às vezes, você se refira a Jeová como seu 'Amigo'. Ao usar palavras como 'Pai' ou 'Amigo', devemos fazer isso com reverência e humildade. Por quê? Porque somos imperfeitos. Então, mesmo que nos sintamos muito próximos de Jeová, nós não merecemos isso. É apenas por causa do resgate que podemos pensar na ideia de ter uma amizade com Jeová. Por meio de Jesus, Jeová tornou possível 'reconciliar todas as outras coisas consigo mesmo, . . . estabelecendo a paz por meio do sangue que [Jesus] derramou na estaca'. É por essa razão que nós podemos ter a alegria de ter uma amizade com Jeová — mesmo agora em nossa condição imperfeita.",
          pergunta: "Em que outras coisas você pode meditar enquanto se prepara para a Celebração deste ano? (Veja também a imagem.)",
          resposta: "Pensar no que significa poder chamar Jeová de 'Pai' e 'Amigo' com reverência e humildade. Não merecemos essa amizade, mas o resgate tornou possível nos reconciliar com Deus e ter essa alegria mesmo sendo imperfeitos.",
          ordem: 13
        },
        {
          numero: "17",
          texto_base: "O resgate deixa claro que Jeová é 'rico em misericórdia'. Ele 'nos deu vida . . . quando estávamos mortos por causa das nossas falhas'. Assim como uma pessoa presa debaixo dos escombros de um prédio, os que têm 'a disposição correta para com a vida eterna' sabem que estão presos debaixo dos escombros do pecado e que precisam ser libertados. Por isso, eles gritam por ajuda. Por meio da mensagem do Reino, Jeová responde aos seus pedidos de ajuda para que eles possam conhecer a ele e a seu Filho, Jesus. Se Satanás achava que o desastre que aconteceu com Adão e Eva iria impedir Jeová de cumprir seu propósito, ele estava completamente enganado.",
          pergunta: "Como o resgate prova que Jeová é muito misericordioso? (Efésios 2:4, 5)",
          resposta: "Jeová 'nos deu vida quando estávamos mortos por causa das nossas falhas'. Pessoas com disposição correta sabem que estão presas ao pecado e gritam por ajuda. Jeová responde através da mensagem do Reino, permitindo que conheçam a Ele e a Jesus.",
          ordem: 14
        },
        {
          numero: "18",
          texto_base: "Ao meditar nos benefícios que o resgate nos oferece, precisamos ter em mente que uma questão maior está envolvida. Em vez de ver o resgate como algo apenas para o nosso benefício, devemos lembrar que é por meio do resgate que Jeová está respondendo ao desafio que Satanás lançou no jardim do Éden. Jeová também usa o resgate para santificar seu nome e limpá-lo de todas as mentiras que Satanás conta. Além disso, como o resgate nos livra do pecado e da morte, essa é uma maneira de Jeová mostrar que é um Deus de amor. E na sua bondade, Jeová nos permite ajudá-lo a provar que Satanás é um mentiroso, mesmo sem merecermos isso já que somos imperfeitos. Então, como você pode mostrar sua gratidão pelo resgate? Vamos responder a essa pergunta no próximo estudo.",
          pergunta: "Ao meditar no resgate, do que precisamos nos lembrar?",
          resposta: "O resgate envolve questões maiores: Jeová responde ao desafio de Satanás, santifica seu nome, limpa-o de mentiras, mostra que é um Deus de amor, e nos permite ajudar a provar que Satanás é mentiroso.",
          ordem: 15
        }
      ],
      recapitulacao: [
        {
          pergunta: "Como o resgate nos dá perdão?",
          resposta: "O sacrifício de Jesus forneceu a base legal para Jeová perdoar nossos pecados. Através dele somos 'lavados', santificados e declarados justos. Jeová está 'sempre pronto a perdoar' com base no resgate.",
          ordem: 1
        },
        {
          pergunta: "Como o resgate nos dá cura?",
          resposta: "O resgate nos dá esperança de que no novo mundo seremos libertados da condição pecaminosa. Não teremos mais doenças físicas, mentais ou emocionais, nem sentimentos como culpa e ansiedade. Viveremos sob o governo do Príncipe da Paz.",
          ordem: 2
        },
        {
          pergunta: "Como o resgate nos dá reconciliação?",
          resposta: "O resgate satisfez o padrão de justiça de Jeová, dando-lhe base para restabelecer amizade com a humanidade. Através de Jesus, podemos nos reconciliar com Deus e chamá-lo de 'Pai' e 'Amigo'.",
          ordem: 3
        }
      ]
    },
    // ESTUDO 4: 23-29 de março
    {
      numero_estudo: 4,
      data_inicio: "2026-03-23",
      data_fim: "2026-03-29",
      cantico_inicial: 18,
      cantico_inicial_nome: "Obrigado pelo resgate!",
      cantico_final: 124,
      cantico_final_nome: "Sempre fiéis",
      titulo: "Como você vai mostrar sua gratidão pelo resgate?",
      texto_tema: "O amor do Cristo nos impele. — 2 Cor. 5:14",
      objetivo: "Ver como todos nós podemos mostrar que somos gratos pelo resgate.",
      paragrafos: [
        {
          numero: "1-2",
          texto_base: "Se você tivesse sido resgatado dos escombros de um prédio que desabou, você se sentiria em dívida com a pessoa que salvou a sua vida, não é verdade? Mesmo que outros também tivessem sido salvos, com certeza você iria querer mostrar que é muito grato e que nunca vai esquecer do que a pessoa fez por você. Como vimos no estudo anterior, não podemos nos livrar sozinhos dos efeitos do pecado herdado. Mas o sacrifício de Jesus pode nos resgatar porque ele nos dá (1) o perdão dos pecados que cometemos, (2) a esperança de sermos totalmente curados da nossa condição pecaminosa e (3) a reconciliação com Deus. O resultado é que poderemos viver para sempre no novo mundo de Jeová. O resgate é mesmo uma prova do amor de Jesus pelas pessoas — um amor que ele já sentia muito tempo antes de vir à Terra. O apóstolo Paulo escreveu que 'o amor do Cristo nos impele'. Isso quer dizer que o amor de Jesus por nós deve nos motivar a agir, a fazer algo para mostrar que somos muito gratos e que nunca vamos esquecer do sacrifício que ele fez por nós.",
          pergunta: "O que o resgate de Jesus nos impele a fazer, e por quê? (2 Coríntios 5:14, 15) (Veja também a imagem.)",
          resposta: "O amor de Jesus deve nos impelir a agir, a mostrar gratidão. Assim como agradeceríamos a quem nos salvou de escombros, devemos mostrar que somos muito gratos pelo resgate que nos dá perdão, cura e reconciliação com Deus.",
          ordem: 1
        },
        {
          numero: "3",
          texto_base: "O que você pode fazer para mostrar sua gratidão pelo presente amoroso do resgate? Sua resposta pode ser diferente da resposta de outras pessoas. Para ilustrar: imagine que três pessoas estão viajando para o mesmo lugar, mas cada uma vai sair de uma cidade diferente. Os caminhos que elas vão percorrer vão ser diferentes. Da mesma forma, o 'caminho' que você vai percorrer até o seu destino, ou seja, de mostrar gratidão pelo resgate de Jesus, depende de onde você está agora no que diz respeito à sua amizade com Jeová. Pensando nisso, este estudo vai falar sobre três grupos de pessoas: (1) os estudantes da Bíblia, (2) os cristãos batizados e (3) as ovelhas que se afastaram do rebanho.",
          pergunta: "Por que cada pessoa talvez tenha uma maneira diferente de mostrar gratidão pelo resgate?",
          resposta: "Assim como viajantes saindo de cidades diferentes percorrem caminhos diferentes, o modo de mostrar gratidão depende de onde cada um está em sua amizade com Jeová. O estudo considera três grupos: estudantes da Bíblia, cristãos batizados e os que se afastaram.",
          ordem: 2
        },
        {
          numero: "4",
          texto_base: "Se você é um estudante da Bíblia, pense no seguinte: o fato de você querer aprender sobre Jeová e a Bíblia indica que Jeová está atraindo você a ele. 'É Jeová quem examina os corações.' Isso quer dizer que ele presta atenção em você. Ele vê seus esforços de aprender sobre ele e fica muito feliz com seu progresso e as mudanças que você faz para ser amigo dele. E essa amizade só é possível graças ao resgate. Nunca se esqueça disso.",
          pergunta: "No que Jeová presta atenção ao ver os estudantes da Bíblia?",
          resposta: "Jeová examina os corações e presta atenção nos esforços de quem quer aprender sobre Ele. Ele fica feliz com o progresso e as mudanças que a pessoa faz. A amizade com Deus só é possível graças ao resgate.",
          ordem: 3
        },
        {
          numero: "5",
          texto_base: "Como você, estudante da Bíblia, pode mostrar que é grato pelo resgate? Uma maneira é por seguir o conselho do apóstolo Paulo aos filipenses: 'Seja qual for o progresso que já fizemos, prossigamos andando nesse mesmo rumo.' Outra versão da Bíblia traduz esse versículo da seguinte forma: 'Vamos em frente, na mesma direção que temos seguido até agora.' Então, aplique esse conselho e não deixe que nada nem ninguém atrapalhe você de andar na estrada da vida.",
          pergunta: "Como os estudantes da Bíblia podem seguir o conselho de Filipenses 3:16?",
          resposta: "Prosseguindo no mesmo rumo, aplicando o conselho de Paulo e não deixando que nada nem ninguém os atrapalhe de andar na estrada da vida. Continuar avançando na direção que já estão seguindo.",
          ordem: 4
        },
        {
          numero: "6",
          texto_base: "E se você achar difícil aceitar um ensino da Bíblia que acabou de aprender? Faça pesquisas e ore a Jeová para que ele ajude você a entender melhor o assunto. Se ainda assim achar difícil entender, não desista. Continue estudando a Bíblia e, com o tempo, você provavelmente vai conseguir entender melhor o assunto. Mas e se a sua dificuldade for abandonar um hábito que a Bíblia condena? Lembre que Jeová nunca pede de nós algo que seja 'difícil demais'. Ou seja, você consegue sim viver de uma maneira que agrade a ele. Jeová promete que vai te ajudar. Então continue se esforçando para obedecer a Jeová. Em vez de se preocupar demais com o desafio que você está enfrentando, se concentre no quanto você é grato por tudo o que Jeová tem feito por você, incluindo dar seu Filho como resgate. Quanto mais seu amor por Jeová crescer, mais você vai perceber que 'os seus mandamentos não são pesados'.",
          pergunta: "O que os estudantes da Bíblia podem fazer ao enfrentar certas dificuldades? (Deuteronômio 30:11-14) (Veja também a imagem.)",
          resposta: "Fazer pesquisas e orar a Jeová por ajuda. Se for difícil abandonar um hábito ruim, lembrar que Jeová não pede o impossível e promete ajudar. Focar na gratidão pelo que Jeová fez, incluindo o resgate, em vez de se preocupar demais com o desafio.",
          ordem: 5
        },
        {
          numero: "7",
          texto_base: "Mas e se você é um jovem que está sendo criado na verdade? Você também é um estudante da Bíblia. Na verdade, você é o estudante da Bíblia mais importante dos seus pais. A Bíblia diz: 'Acheguem-se a Deus, e ele se achegará a vocês.' Quando você dá o primeiro passo para se aproximar de Jeová, ele corresponde por também se aproximar de você. Para Jeová, você não é só mais um na multidão. Ele não atraiu você por causa da sua família. Jeová atrai cada pessoa de forma individual, o que inclui aqueles que estão sendo criados na verdade. Ele lembra do que ele fez para que você tivesse uma amizade forte com ele: Jeová deu o seu Filho. Nunca esqueça que esse é um presente especial de Jeová para você. Então, antes de assistir à Celebração deste ano, o que acha de tirar um tempo para meditar no que Jeová e Jesus fizeram por você? Daí pense no que você quer fazer com sua vida e no próximo alvo que você pode ter — independente de qual seja — para mostrar o quanto você é grato pelo resgate.",
          pergunta: "Os jovens que estão sendo criados na verdade podem meditar em quê?",
          resposta: "Que são os estudantes da Bíblia mais importantes de seus pais. Jeová atrai cada pessoa individualmente, não por causa da família. Devem meditar no presente especial do resgate, pensar no que querem fazer com a vida e estabelecer alvos para mostrar gratidão.",
          ordem: 6
        },
        {
          numero: "8",
          texto_base: "Se você é um cristão batizado, você já mostrou gratidão pelo resgate de várias maneiras. Por exemplo, você deu os passos para se achegar a Jeová e para viver de uma forma que agrade a ele. Você obedeceu a ordem de Jesus de pregar e fazer discípulos. Você se dedicou a Jeová e se batizou. E talvez você até sofreu oposição por decidir servir a Jeová. Mas você perseverou e continuou servindo a Jeová fielmente. Isso mostra o quanto você ama a Jeová e é grato pelo resgate.",
          pergunta: "Como um cristão que é batizado já mostrou gratidão pelo resgate?",
          resposta: "Se achegando a Jeová, vivendo de forma agradável a Ele, pregando e fazendo discípulos, se dedicando e se batizando. Perseverando mesmo diante de oposição, mostrando amor a Jeová e gratidão pelo resgate.",
          ordem: 7
        },
        {
          numero: "9",
          texto_base: "Sendo cristãos batizados, precisamos ficar atentos a um perigo. Com o tempo, podemos deixar de dar valor ao resgate. Como isso poderia acontecer? Pense no exemplo dos cristãos do primeiro século em Éfeso. Depois que já tinha sido ressuscitado, Jesus os elogiou por causa da sua perseverança. Só que ele também disse: 'Tenho o seguinte contra você: você abandonou o amor que tinha no princípio.' As palavras de Jesus indicam que um cristão, aos poucos, pode acabar deixando sua adoração a Jeová cair na rotina. Essa pessoa pode até estar orando, indo às reuniões e participando no ministério. Mas é só porque ela está acostumada a fazer isso; ela não é mais motivada por amor. Então, o que você pode fazer se achar que seu amor por Jeová já não é mais tão forte quanto antes?",
          pergunta: "Um cristão batizado deve estar atento a qual perigo?",
          resposta: "O perigo de deixar de dar valor ao resgate com o tempo. Pode acabar fazendo coisas espirituais apenas por rotina, sem ser motivado por amor, como os cristãos de Éfeso que 'abandonaram o amor que tinham no princípio'.",
          ordem: 8
        },
        {
          numero: "10",
          texto_base: "O apóstolo Paulo disse para Timóteo 'meditar' e 'se concentrar totalmente' em suas atividades cristãs. Seguindo esse conselho, tente pensar no que você pode fazer para dar mais vida à sua adoração a Jeová e para continuar 'sendo fervoroso no espírito'. Por exemplo, talvez você possa ir mais a fundo ao preparar as reuniões, e isso vai ajudar você a se concentrar mais nelas. Ou talvez você possa procurar lugares sem distrações para fazer seu estudo pessoal, onde você possa ficar sozinho para meditar e aproveitar melhor o estudo. Assim como colocar lenha para alimentar as chamas de uma fogueira, você precisa fazer essas coisas para alimentar e manter viva sua gratidão por tudo que Jeová tem feito, o que inclui o resgate. Além disso, o que acha de aproveitar as semanas antes da Celebração para meditar nas bênçãos maravilhosas que temos como Testemunhas de Jeová? Sem dúvida isso vai aumentar sua gratidão pelo resgate, que é a base para você ser um amigo achegado de Jeová.",
          pergunta: "Como você pode 'meditar' e 'se concentrar totalmente' em suas atividades cristãs? (1 Timóteo 4:13, 15)",
          resposta: "Preparando reuniões mais profundamente, encontrando lugares sem distrações para estudo pessoal e meditação. Alimentar a gratidão assim como se alimenta uma fogueira. Meditar nas semanas antes da Celebração nas bênçãos que temos.",
          ordem: 9
        },
        {
          numero: "11-12",
          texto_base: "Se já por algum tempo você acha que não tem mais o mesmo zelo de antes na adoração a Jeová, não fique desanimado nem ache que perdeu o espírito santo de Deus. Lembre do que o apóstolo Paulo escreveu sobre seu ministério aos irmãos em Corinto: 'Mesmo se o fizer contra a minha vontade, ainda assim estou incumbido de uma responsabilidade.' O que ele quis dizer? Às vezes, algumas coisas sufocavam o desejo que Paulo tinha de pregar. Mas ele estava decidido a perseverar na pregação, com ou sem vontade. Você também pode ter essa mesma atitude. Esteja decidido a fazer o que é certo, mesmo se faltar motivação. Então, ore para ter 'tanto o desejo como o poder de agir'. Continue ocupado em suas atividades espirituais. Tenha certeza de que, com o tempo, isso vai influenciar seus sentimentos e reacender o amor que ainda há no seu coração.",
          pergunta: "Se às vezes você sente que não tem o mesmo zelo de antes, será que você perdeu o espírito de Deus? Explique. (Veja também a imagem.)",
          resposta: "Não necessariamente. Como Paulo disse, às vezes fazemos mesmo sem vontade, mas continuamos incumbidos da responsabilidade. Devemos decidir fazer o certo mesmo sem motivação, orar por desejo e poder de agir, e continuar ativos. Com o tempo, os sentimentos e o amor vão se reacender.",
          ordem: 10
        },
        {
          numero: "13",
          texto_base: "De vez em quando, é bom fazermos uma análise de nós mesmos. Paulo nos aconselhou: 'Persistam em examinar se estão na fé; persistam em pôr à prova o que vocês mesmos são.' Então, podemos nos fazer perguntas como: 'Estou colocando o Reino em primeiro lugar na vida?' 'As coisas que eu escolho para me divertir mostram que eu odeio o que é mau?' 'Minhas palavras e ações estão ajudando a congregação a continuar unida?' A época da Celebração é um período especial para meditar no presente do resgate que Jeová nos deu. Ela nos dá uma oportunidade de fazer uma autoanálise e nos certificar de que estamos vivendo para Cristo, e não para nós mesmos.",
          pergunta: "Como podemos continuar examinando se 'estamos na fé'?",
          resposta: "Fazer autoanálise com perguntas como: Estou colocando o Reino em primeiro lugar? Minhas diversões mostram que odeio o mal? Minhas palavras e ações ajudam a unidade da congregação? A Celebração é oportunidade de meditar no resgate e examinar se vivemos para Cristo.",
          ordem: 11
        },
        {
          numero: "14",
          texto_base: "Alguns irmãos e irmãs param de se associar com a congregação. Às vezes, eles fazem isso depois de alguns meses ou até depois de anos servindo a Jeová fielmente. Por quê? Alguns estão sobrecarregados com as 'ansiedades da vida'. Outros tropeçaram por causa de algo que algum irmão disse ou fez. Já outros cometeram um pecado grave e não pedem ajuda por sentirem vergonha ou por algum outro motivo. Se alguma dessas coisas aconteceu com você e você se afastou do rebanho, o que você pode fazer? O que o presente do resgate pode motivar você a fazer?",
          pergunta: "Que coisas podem fazer alguns irmãos e irmãs se afastarem do rebanho?",
          resposta: "Estar sobrecarregados com 'ansiedades da vida', tropeçar por algo que um irmão disse ou fez, ou cometer pecado grave e não pedir ajuda por vergonha. O resgate pode motivá-los a voltar.",
          ordem: 12
        },
        {
          numero: "15",
          texto_base: "Pense em como Jeová se sente sobre aquelas pessoas que se afastaram. Ele não fica com raiva dessas pessoas nem se esquece delas. Muito pelo contrário. Ele procura por suas ovelhas perdidas e cuida delas, por alimentá-las e ajudá-las a voltar para ele. Será que Jeová talvez não está fazendo o mesmo por você? Sim! O simples fato de você estar lendo este estudo mostra que o seu coração ainda está voltado para ele. Assim como Jeová viu o seu coração e te atraiu para entrar para a verdade, será que ele não continua vendo coisas boas em você e está te atraindo para voltar para ele?",
          pergunta: "Como Jeová mostra que se importa com as ovelhas que se afastaram? (Ezequiel 34:11, 12, 16)",
          resposta: "Jeová não fica com raiva nem se esquece delas. Ele procura suas ovelhas perdidas, cuida delas, as alimenta e ajuda a voltar. Se você está lendo este estudo, seu coração ainda está voltado para Ele e Ele está te atraindo de volta.",
          ordem: 13
        },
        {
          numero: "16",
          texto_base: "Na brochura Volte para Jeová, encontramos as seguintes palavras animadoras: 'Esteja certo de que você terá a ajuda de Jeová ao voltar para ele. Ele o ajudará a lidar com a ansiedade, a se livrar de mágoas e a encontrar a paz mental de ter uma consciência limpa. Dessa forma, você poderá se sentir novamente motivado a servir a Jeová junto com seus irmãos na fé.' Lembre também que os anciãos querem muito ajudar você. Eles querem ser para você 'como abrigo contra o vento, como esconderijo contra o temporal'. Para mostrar sua gratidão pelo resgate, pergunte-se: 'O que eu posso fazer agora para \"resolver as questões\" com Jeová?' Por exemplo, será que você poderia assistir a uma reunião no Salão do Reino? O que você acha de falar com um dos anciãos e pedir ajuda em sentido espiritual? Talvez ele providencie alguém para estudar a Bíblia com você novamente por um tempo. Pode ter certeza que, se você orar sobre o assunto e se esforçar para mostrar gratidão pelo resgate de Jesus, Jeová vai te abençoar.",
          pergunta: "O que pode ajudar as ovelhas perdidas a voltarem para Jeová? (Veja também a imagem.)",
          resposta: "A brochura 'Volte para Jeová' oferece encorajamento. Os anciãos querem ajudar como 'abrigo contra o vento'. Pode-se assistir a reuniões, falar com anciãos, e talvez ter alguém para estudar novamente. Orar e se esforçar para mostrar gratidão trará bênçãos.",
          ordem: 14
        },
        {
          numero: "17",
          texto_base: "Jesus disse que tinha sido enviado para dar sua vida 'para que todo aquele que nele exercer fé não seja destruído, mas tenha vida eterna'. O resgate é o meio de Jeová nos livrar do pecado e da morte. Jamais queremos deixar de dar valor ao resgate. Os dias antes da Celebração nos dão uma chance de meditar no amor que Jeová e Jesus mostraram, e esse amor vai nos motivar a fazer algo para mostrar gratidão pelo que eles fizeram.",
          pergunta: "O que queremos fazer?",
          resposta: "Jamais deixar de dar valor ao resgate. Os dias antes da Celebração nos dão chance de meditar no amor de Jeová e Jesus, e isso nos motivará a mostrar gratidão pelo que eles fizeram para nos livrar do pecado e da morte.",
          ordem: 15
        },
        {
          numero: "18",
          texto_base: "Como você vai mostrar sua gratidão pelo resgate? Se você é um estudante da Bíblia, continue fazendo progresso e não deixe que nada o atrapalhe. Se você é um cristão batizado, examine regularmente a si mesmo e reacenda seu amor por Jeová. E se você se afastou do rebanho de Jeová, dê os passos necessários para voltar para ele. Não importa em que grupo você está, este é o momento perfeito para mostrar o quanto você é grato por tudo o que Jeová e Jesus fizeram por você ao providenciar o resgate.",
          pergunta: "Como você vai mostrar sua gratidão pelo resgate?",
          resposta: "Estudantes: continuar progredindo sem obstáculos. Batizados: examinar-se regularmente e reacender o amor por Jeová. Os que se afastaram: dar passos para voltar. Todos podem mostrar gratidão pelo que Jeová e Jesus fizeram.",
          ordem: 16
        }
      ],
      recapitulacao: [
        {
          pergunta: "Como os estudantes da Bíblia podem mostrar gratidão pelo resgate?",
          resposta: "Continuando a progredir, não deixando que nada nem ninguém os atrapalhe, pesquisando e orando quando tiverem dificuldades, e focando na gratidão pelo que Jeová fez, incluindo o resgate.",
          ordem: 1
        },
        {
          pergunta: "Como os cristãos batizados podem mostrar gratidão pelo resgate?",
          resposta: "Examinando regularmente a si mesmos, meditando nas bênçãos, continuando fervorosos no espírito, preparando bem as reuniões e fazendo estudo pessoal sem distrações para manter viva a gratidão.",
          ordem: 2
        },
        {
          pergunta: "Como os que se afastaram podem mostrar gratidão pelo resgate?",
          resposta: "Reconhecendo que Jeová os atrai de volta, assistindo reuniões, conversando com anciãos, pedindo ajuda espiritual, e dando passos para 'resolver as questões' com Jeová.",
          ordem: 3
        }
      ]
    }
  ]

  // Inserir cada estudo
  for (const estudo of estudos) {
    console.log(`\nInserindo estudo: ${estudo.titulo}`)
    
    // Verificar se já existe
    const { data: estudoExistente } = await supabase
      .from("sentinela_estudos")
      .select("id")
      .eq("data_inicio", estudo.data_inicio)
      .maybeSingle()

    let estudoId: string

    if (estudoExistente) {
      console.log(`  Estudo já existe, atualizando...`)
      const { error } = await supabase
        .from("sentinela_estudos")
        .update({
          mes_id: mesId,
          numero_estudo: estudo.numero_estudo,
          data_fim: estudo.data_fim,
          cantico_inicial: estudo.cantico_inicial,
          cantico_inicial_nome: estudo.cantico_inicial_nome,
          cantico_final: estudo.cantico_final,
          cantico_final_nome: estudo.cantico_final_nome,
          titulo: estudo.titulo,
          texto_tema: estudo.texto_tema,
          objetivo: estudo.objetivo
        })
        .eq("id", estudoExistente.id)
      
      if (error) {
        console.error("  Erro ao atualizar estudo:", error)
        continue
      }
      estudoId = estudoExistente.id

      // Deletar parágrafos e recapitulação antigos
      await supabase.from("sentinela_paragrafos").delete().eq("estudo_id", estudoId)
      await supabase.from("sentinela_recapitulacao").delete().eq("estudo_id", estudoId)
    } else {
      console.log(`  Criando novo estudo...`)
      const { data: novoEstudo, error } = await supabase
        .from("sentinela_estudos")
        .insert({
          mes_id: mesId,
          numero_estudo: estudo.numero_estudo,
          data_inicio: estudo.data_inicio,
          data_fim: estudo.data_fim,
          cantico_inicial: estudo.cantico_inicial,
          cantico_inicial_nome: estudo.cantico_inicial_nome,
          cantico_final: estudo.cantico_final,
          cantico_final_nome: estudo.cantico_final_nome,
          titulo: estudo.titulo,
          texto_tema: estudo.texto_tema,
          objetivo: estudo.objetivo
        })
        .select("id")
        .single()
      
      if (error || !novoEstudo) {
        console.error("  Erro ao criar estudo:", error)
        continue
      }
      estudoId = novoEstudo.id
    }

    // Inserir parágrafos
    console.log(`  Inserindo ${estudo.paragrafos.length} parágrafos...`)
    for (const p of estudo.paragrafos) {
      const { error } = await supabase
        .from("sentinela_paragrafos")
        .insert({
          estudo_id: estudoId,
          numero: p.numero,
          texto_base: p.texto_base,
          pergunta: p.pergunta,
          resposta: p.resposta,
          ordem: p.ordem
        })
      
      if (error) {
        console.error(`    Erro ao inserir parágrafo ${p.numero}:`, error)
      }
    }

    // Inserir recapitulação
    console.log(`  Inserindo ${estudo.recapitulacao.length} perguntas de recapitulação...`)
    for (const r of estudo.recapitulacao) {
      const { error } = await supabase
        .from("sentinela_recapitulacao")
        .insert({
          estudo_id: estudoId,
          pergunta: r.pergunta,
          resposta: r.resposta,
          ordem: r.ordem
        })
      
      if (error) {
        console.error(`    Erro ao inserir recapitulação:`, error)
      }
    }

    console.log(`  ✓ Estudo "${estudo.titulo}" inserido com sucesso!`)
  }

  console.log("\n=== Inserção concluída! ===")
  console.log("Total de estudos: 4")
  console.log("Período: 2-29 de março de 2026")
}

inserirEstudosMarco2026()
