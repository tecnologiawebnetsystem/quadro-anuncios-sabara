"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Music, Target, BookOpen, MessageCircle, ChevronDown, ChevronUp } from "lucide-react"

// Dados dos estudos de março 2026
const estudosMarco = [
  {
    id: "semana1",
    semana: "2-8 de março de 2026",
    cantico: 111,
    titulo: "Fique decidido a ter uma conduta exemplar!",
    textoTema: "Mantenham uma conduta exemplar. — 1 Ped. 2:12.",
    objetivo: "Entender como manter uma conduta exemplar pode ajudar outros a glorificar a Deus.",
    paragrafos: [
      {
        numero: 1,
        conteudo: "Será que você também gostaria de ajudar outros a conhecer a Jeová e a glorificá-lo? Como servo de Deus, com certeza o seu desejo é ajudar outros a glorificá-lo. E você pode fazer isso de várias maneiras. Veja um exemplo. O apóstolo Pedro escreveu aos cristãos: \"Mantenham uma conduta exemplar entre as nações, para que . . . elas glorifiquem a Deus.\" (1 Ped. 2:12) O que significa ter uma \"conduta exemplar\"? Ter uma conduta exemplar significa se comportar de um modo que honra a Deus. Isso inclui o modo como tratamos outros, o modo como reagimos a situações difíceis e as escolhas de entretenimento que fazemos.",
        perguntas: ["Qual é o desejo de todo servo de Deus?", "O que significa ter uma conduta exemplar?"]
      },
      {
        numero: 2,
        conteudo: "Neste artigo, vamos ver o que significa ter uma conduta exemplar em três áreas: (1) como tratar outros com respeito, (2) como reagir quando alguém nos trata mal e (3) como fazer boas escolhas de entretenimento.",
        perguntas: ["O que vamos ver neste artigo?"]
      },
      {
        numero: 3,
        conteudo: "Tratar outros com respeito. A Bíblia diz: \"Honrem a todos.\" (1 Ped. 2:17) Honrar alguém significa tratá-lo com respeito. Devemos tratar com respeito todas as pessoas, incluindo as que não servem a Jeová. Por que isso é importante? Porque quando tratamos outros com respeito, mostramos que seguimos os ensinos de Jesus e que somos diferentes das outras pessoas. Além disso, quando tratamos outros com respeito, podemos fazer com que eles queiram saber mais sobre a nossa fé.",
        perguntas: ["Por que devemos tratar outros com respeito?"]
      },
      {
        numero: 4,
        conteudo: "Veja um exemplo. Um irmão chamado André trabalha como policial. Ele disse: \"No meu trabalho, muitos colegas usam linguagem obscena e contam piadas imorais. Mas eu não faço isso. Também trato todas as pessoas com respeito, incluindo as que cometem crimes.\" Qual foi o resultado? André disse: \"Alguns colegas notaram minha conduta e perguntaram por que sou diferente. Isso me deu a oportunidade de falar sobre minha fé.\"",
        perguntas: ["Como André mantém uma conduta exemplar no trabalho?"]
      },
      {
        numero: 5,
        conteudo: "Como você pode mostrar respeito a outros? Pode fazer isso de várias maneiras. Por exemplo, pode cumprimentar as pessoas com um sorriso. Pode ouvir com atenção quando alguém está falando. Pode usar expressões como \"por favor\" e \"obrigado\". Essas coisas podem parecer simples, mas podem fazer uma grande diferença no modo como outros nos veem.",
        perguntas: ["De que maneiras você pode mostrar respeito a outros?"]
      },
      {
        numero: 6,
        conteudo: "Reagir bem quando somos tratados mal. O apóstolo Pedro escreveu: \"Não paguem mal com mal ou insulto com insulto.\" (1 Ped. 3:9) Nem sempre é fácil seguir esse conselho. Quando alguém nos trata mal, nossa reação natural pode ser revidar. Mas a Bíblia nos incentiva a controlar nossas emoções e a não deixar que a raiva nos domine.",
        perguntas: ["Qual é nossa reação natural quando somos tratados mal?", "O que a Bíblia nos incentiva a fazer?"]
      },
      {
        numero: 7,
        conteudo: "Por que devemos reagir bem quando somos tratados mal? Porque isso mostra que seguimos os ensinos de Jesus. Jesus disse: \"Continuem a amar os seus inimigos e a orar pelos que os perseguem.\" (Mat. 5:44) Além disso, quando reagimos bem, podemos tocar o coração das pessoas que nos trataram mal.",
        perguntas: ["Por que devemos reagir bem quando somos tratados mal?"]
      },
      {
        numero: 8,
        conteudo: "Veja um exemplo. Uma irmã chamada Lúcia trabalha num escritório. Uma colega de trabalho costumava tratá-la mal. A colega fazia comentários maldosos sobre a fé de Lúcia e tentava fazer com que outros também a tratassem mal. O que Lúcia fez? Ela disse: \"Eu orei pedindo ajuda a Jeová. Também tentei ser gentil com ela. Quando ela estava doente, levei um presente para ela.\" Qual foi o resultado? Lúcia disse: \"Com o tempo, minha colega mudou. Ela parou de falar mal de mim e até começou a me defender quando outros falavam mal de mim.\"",
        perguntas: ["Como Lúcia reagiu quando uma colega a tratou mal?", "Qual foi o resultado?"]
      },
      {
        numero: 9,
        conteudo: "Como você pode reagir bem quando alguém o trata mal? Primeiro, ore pedindo ajuda a Jeová. Segundo, tente entender por que a pessoa agiu daquele modo. Talvez ela esteja passando por problemas e por isso está tratando mal outras pessoas. Terceiro, tente ser gentil com a pessoa. Quem sabe, com o tempo, ela mude o modo como o trata.",
        perguntas: ["O que pode ajudá-lo a reagir bem quando alguém o trata mal?"]
      },
      {
        numero: 10,
        conteudo: "Fazer boas escolhas de entretenimento. A Bíblia diz: \"Quer comam, quer bebam, quer façam qualquer outra coisa, façam tudo para a glória de Deus.\" (1 Cor. 10:31) Isso inclui as escolhas de entretenimento que fazemos. Quando fazemos boas escolhas de entretenimento, mostramos que amamos a Jeová e que queremos agradá-lo.",
        perguntas: ["Por que devemos fazer boas escolhas de entretenimento?"]
      },
      {
        numero: 11,
        conteudo: "Como você pode fazer boas escolhas de entretenimento? Pergunte-se: \"Será que Jeová aprovaria esse tipo de entretenimento? Será que isso vai me ajudar a ter pensamentos limpos?\" Se a resposta for não, é melhor evitar esse tipo de entretenimento. Lembre-se de que existem muitas opções de entretenimento que são saudáveis e que Jeová aprova.",
        perguntas: ["Que perguntas você pode fazer a si mesmo antes de escolher um tipo de entretenimento?"]
      },
      {
        numero: 12,
        conteudo: "Veja um exemplo. Um irmão chamado Marcos gostava de assistir a vídeos na internet. Mas ele notou que alguns vídeos tinham conteúdo impróprio. O que ele fez? Marcos disse: \"Decidi ser mais cuidadoso. Agora, antes de assistir a um vídeo, leio a descrição e os comentários para saber se o conteúdo é apropriado. Se não for, escolho outro vídeo.\" Essa atitude ajudou Marcos a manter sua mente limpa.",
        perguntas: ["O que Marcos fez para fazer boas escolhas de entretenimento?"]
      },
      {
        numero: 13,
        conteudo: "Qual é o resultado de ter uma conduta exemplar? Quando temos uma conduta exemplar, honramos a Jeová e ajudamos outros a glorificá-lo. Além disso, nos sentimos bem por saber que estamos fazendo o que é certo. Por isso, fique decidido a ter uma conduta exemplar em todas as áreas da sua vida!",
        perguntas: ["Qual é o resultado de ter uma conduta exemplar?"]
      }
    ],
    respostas: {
      1: ["Todo servo de Deus deseja ajudar outros a conhecer a Jeová e a glorificá-lo.", "Ter uma conduta exemplar significa se comportar de um modo que honra a Deus, incluindo o modo como tratamos outros, como reagimos a situações difíceis e as escolhas de entretenimento que fazemos."],
      2: ["Vamos ver o que significa ter uma conduta exemplar em três áreas: como tratar outros com respeito, como reagir quando alguém nos trata mal e como fazer boas escolhas de entretenimento."],
      3: ["Devemos tratar outros com respeito porque: (1) mostramos que seguimos os ensinos de Jesus, (2) somos diferentes das outras pessoas, e (3) podemos fazer com que eles queiram saber mais sobre a nossa fé."],
      4: ["André não usa linguagem obscena, não conta piadas imorais e trata todas as pessoas com respeito, inclusive as que cometem crimes. Alguns colegas notaram sua conduta e perguntaram por que ele é diferente, dando-lhe a oportunidade de falar sobre sua fé."],
      5: ["Podemos mostrar respeito cumprimentando as pessoas com um sorriso, ouvindo com atenção quando alguém está falando, e usando expressões como 'por favor' e 'obrigado'."],
      6: ["Nossa reação natural pode ser revidar quando somos tratados mal.", "A Bíblia nos incentiva a controlar nossas emoções e a não deixar que a raiva nos domine."],
      7: ["Devemos reagir bem porque isso mostra que seguimos os ensinos de Jesus e podemos tocar o coração das pessoas que nos trataram mal."],
      8: ["Lúcia orou pedindo ajuda a Jeová e tentou ser gentil com a colega, inclusive levando um presente quando ela estava doente.", "Com o tempo, a colega mudou, parou de falar mal de Lúcia e até começou a defendê-la."],
      9: ["Três coisas podem ajudar: (1) orar pedindo ajuda a Jeová, (2) tentar entender por que a pessoa agiu daquele modo, e (3) tentar ser gentil com a pessoa."],
      10: ["Devemos fazer boas escolhas de entretenimento porque isso mostra que amamos a Jeová e queremos agradá-lo, fazendo tudo para a glória de Deus."],
      11: ["Podemos perguntar: 'Será que Jeová aprovaria esse tipo de entretenimento? Será que isso vai me ajudar a ter pensamentos limpos?'"],
      12: ["Marcos passou a ler a descrição e os comentários dos vídeos antes de assistir para verificar se o conteúdo é apropriado. Se não for, ele escolhe outro vídeo."],
      13: ["Quando temos uma conduta exemplar, honramos a Jeová, ajudamos outros a glorificá-lo e nos sentimos bem por saber que estamos fazendo o que é certo."]
    }
  },
  {
    id: "semana2",
    semana: "9-15 de março de 2026",
    cantico: 103,
    titulo: "Cuide bem do seu casamento",
    textoTema: "O que Deus uniu, o homem não deve separar. — Mat. 19:6.",
    objetivo: "Entender como aplicar os princípios bíblicos para fortalecer o casamento.",
    paragrafos: [
      {
        numero: 1,
        conteudo: "Jeová criou o casamento para ser uma fonte de felicidade. Quando um homem e uma mulher se casam, eles se tornam 'uma só carne'. (Gên. 2:24) Jeová quer que o casamento dure para sempre. Jesus disse: 'O que Deus uniu, o homem não deve separar.' (Mat. 19:6) Mas sabemos que manter um casamento feliz não é fácil. Vivemos num mundo que não valoriza o casamento. Por isso, os casais precisam se esforçar para manter seu casamento forte.",
        perguntas: ["O que Jeová quer para o casamento?", "Por que manter um casamento feliz não é fácil?"]
      },
      {
        numero: 2,
        conteudo: "Neste artigo, vamos ver três coisas que podem ajudar os casais a fortalecer seu casamento: (1) comunicação, (2) respeito e (3) perdão.",
        perguntas: ["O que vamos considerar neste artigo?"]
      },
      {
        numero: 3,
        conteudo: "A importância da comunicação. A boa comunicação é essencial para um casamento feliz. Casais que se comunicam bem conseguem resolver problemas com mais facilidade e se sentem mais unidos. Por outro lado, casais que não se comunicam bem podem ter muitos mal-entendidos e conflitos.",
        perguntas: ["Por que a boa comunicação é essencial para um casamento feliz?"]
      },
      {
        numero: 4,
        conteudo: "Como os casais podem melhorar sua comunicação? Primeiro, reservem tempo para conversar. Muitos casais estão tão ocupados com o trabalho, os filhos e outras responsabilidades que mal têm tempo para conversar. Se esse for o seu caso, tente reservar um tempo específico para conversar com seu cônjuge. Segundo, ouçam com atenção. Quando seu cônjuge estiver falando, não interrompa. Tente entender o que ele está sentindo. Terceiro, falem com respeito. Mesmo que discordem de algo, não gritem ou usem palavras ofensivas.",
        perguntas: ["Que sugestões podem ajudar os casais a melhorar sua comunicação?"]
      },
      {
        numero: 5,
        conteudo: "A importância do respeito. A Bíblia diz que o marido deve amar sua esposa e que a esposa deve ter profundo respeito pelo marido. (Efé. 5:33) Quando o marido ama sua esposa e a esposa respeita o marido, o casamento se torna mais forte. Por outro lado, quando falta respeito no casamento, os dois sofrem.",
        perguntas: ["O que a Bíblia diz sobre amor e respeito no casamento?"]
      },
      {
        numero: 6,
        conteudo: "Como os casais podem mostrar respeito um pelo outro? Podem fazer isso de várias maneiras. Por exemplo, podem falar bem um do outro na frente de outras pessoas. Podem valorizar a opinião um do outro. Podem evitar criticar um ao outro. Essas atitudes ajudam a fortalecer o casamento.",
        perguntas: ["De que maneiras os casais podem mostrar respeito um pelo outro?"]
      },
      {
        numero: 7,
        conteudo: "A importância do perdão. A Bíblia diz: 'Continuem a suportar uns aos outros e a perdoar uns aos outros liberalmente.' (Col. 3:13) Nenhum casamento é perfeito. Todos nós cometemos erros. Por isso, é importante que os casais estejam dispostos a perdoar um ao outro.",
        perguntas: ["Por que o perdão é importante no casamento?"]
      },
      {
        numero: 8,
        conteudo: "Como os casais podem cultivar o perdão? Primeiro, lembrem-se de que todos nós cometemos erros. Segundo, não guardem rancor. Quando você guarda rancor, você prejudica a si mesmo e ao seu casamento. Terceiro, peçam perdão quando errar. Dizer 'me desculpe' pode parecer difícil, mas faz uma grande diferença no casamento.",
        perguntas: ["O que pode ajudar os casais a cultivar o perdão?"]
      },
      {
        numero: 9,
        conteudo: "Jeová quer que os casais sejam felizes. Por isso, ele nos deu orientações na Bíblia para nos ajudar a ter um casamento forte. Quando os casais aplicam essas orientações, eles honram a Jeová e fortalecem seu casamento. Então, cuide bem do seu casamento!",
        perguntas: ["Por que devemos aplicar as orientações de Jeová para o casamento?"]
      }
    ],
    respostas: {
      1: ["Jeová quer que o casamento dure para sempre e seja uma fonte de felicidade.", "Manter um casamento feliz não é fácil porque vivemos num mundo que não valoriza o casamento, então os casais precisam se esforçar."],
      2: ["Vamos ver três coisas que podem ajudar os casais a fortalecer seu casamento: comunicação, respeito e perdão."],
      3: ["A boa comunicação é essencial porque casais que se comunicam bem conseguem resolver problemas com mais facilidade e se sentem mais unidos."],
      4: ["Três sugestões: (1) reservar tempo para conversar, (2) ouvir com atenção sem interromper, e (3) falar com respeito, sem gritar ou usar palavras ofensivas."],
      5: ["A Bíblia diz que o marido deve amar sua esposa e que a esposa deve ter profundo respeito pelo marido. Isso torna o casamento mais forte."],
      6: ["Podem falar bem um do outro na frente de outras pessoas, valorizar a opinião um do outro e evitar criticar um ao outro."],
      7: ["O perdão é importante porque nenhum casamento é perfeito e todos cometemos erros. Os casais precisam estar dispostos a perdoar um ao outro."],
      8: ["Três coisas ajudam: (1) lembrar que todos cometem erros, (2) não guardar rancor, e (3) pedir perdão quando errar."],
      9: ["Devemos aplicar as orientações de Jeová porque isso nos ajuda a ter um casamento forte e honra a Jeová."]
    }
  },
  {
    id: "semana3",
    semana: "16-22 de março de 2026",
    cantico: 123,
    titulo: "Como ter alegria no serviço a Jeová",
    textoTema: "Sirvam a Jeová com alegria. — Sal. 100:2.",
    objetivo: "Entender como manter a alegria no serviço a Jeová mesmo diante de dificuldades.",
    paragrafos: [
      {
        numero: 1,
        conteudo: "Servir a Jeová é um grande privilégio. Devemos servir a Jeová com alegria, como diz Salmo 100:2. Mas às vezes pode ser difícil manter a alegria. Podemos enfrentar problemas de saúde, dificuldades financeiras ou outros desafios. Mesmo assim, é possível ter alegria no serviço a Jeová.",
        perguntas: ["Por que às vezes pode ser difícil manter a alegria no serviço a Jeová?"]
      },
      {
        numero: 2,
        conteudo: "Neste artigo, vamos ver três coisas que podem nos ajudar a ter alegria no serviço a Jeová: (1) focar nas bênçãos que temos, (2) ter objetivos espirituais e (3) confiar em Jeová.",
        perguntas: ["O que vamos considerar neste artigo?"]
      },
      {
        numero: 3,
        conteudo: "Focar nas bênçãos que temos. Quando focamos nos problemas, podemos ficar desanimados. Mas quando focamos nas bênçãos que temos, nossa alegria aumenta. Por isso, é importante parar de vez em quando e pensar nas coisas boas que Jeová nos dá.",
        perguntas: ["Por que é importante focar nas bênçãos que temos?"]
      },
      {
        numero: 4,
        conteudo: "Quais são algumas bênçãos que temos? Temos o conhecimento da verdade. Temos uma esperança maravilhosa para o futuro. Temos uma família espiritual mundial. Temos a ajuda do espírito santo de Jeová. Quando pensamos nessas bênçãos, nos sentimos gratos e alegres.",
        perguntas: ["Quais são algumas bênçãos que temos?"]
      },
      {
        numero: 5,
        conteudo: "Ter objetivos espirituais. Ter objetivos nos dá direção e propósito. Quando alcançamos um objetivo, nos sentimos realizados e felizes. Por isso, é bom ter objetivos espirituais. Esses objetivos podem incluir melhorar na leitura da Bíblia, participar mais nas reuniões ou ajudar alguém a conhecer a Jeová.",
        perguntas: ["Por que é bom ter objetivos espirituais?"]
      },
      {
        numero: 6,
        conteudo: "Como você pode estabelecer objetivos espirituais? Primeiro, pense em áreas em que você gostaria de melhorar. Segundo, defina objetivos específicos e realistas. Terceiro, faça um plano para alcançar esses objetivos. Quarto, peça ajuda a Jeová em oração.",
        perguntas: ["O que pode ajudá-lo a estabelecer objetivos espirituais?"]
      },
      {
        numero: 7,
        conteudo: "Confiar em Jeová. A Bíblia diz: 'Confie em Jeová de todo o seu coração.' (Pro. 3:5) Quando confiamos em Jeová, sabemos que ele vai nos ajudar a enfrentar qualquer situação. Isso nos dá paz e alegria.",
        perguntas: ["Por que confiar em Jeová nos dá alegria?"]
      },
      {
        numero: 8,
        conteudo: "Como você pode fortalecer sua confiança em Jeová? Leia relatos bíblicos de pessoas que confiaram em Jeová e foram abençoadas. Ore a Jeová regularmente, contando a ele seus problemas e preocupações. Observe como Jeová o tem ajudado no passado. Essas coisas vão fortalecer sua confiança em Jeová.",
        perguntas: ["O que pode ajudá-lo a fortalecer sua confiança em Jeová?"]
      },
      {
        numero: 9,
        conteudo: "Jeová quer que seus servos sejam felizes. Ele nos deu tudo o que precisamos para ter alegria. Por isso, foque nas bênçãos que você tem, estabeleça objetivos espirituais e confie em Jeová. Fazendo isso, você vai ter alegria no serviço a Jeová!",
        perguntas: ["O que devemos fazer para ter alegria no serviço a Jeová?"]
      }
    ],
    respostas: {
      1: ["Pode ser difícil manter a alegria porque podemos enfrentar problemas de saúde, dificuldades financeiras ou outros desafios."],
      2: ["Vamos ver três coisas que podem nos ajudar a ter alegria: focar nas bênçãos que temos, ter objetivos espirituais e confiar em Jeová."],
      3: ["É importante focar nas bênçãos porque quando focamos nos problemas, ficamos desanimados, mas quando focamos nas bênçãos, nossa alegria aumenta."],
      4: ["Algumas bênçãos: o conhecimento da verdade, uma esperança maravilhosa para o futuro, uma família espiritual mundial e a ajuda do espírito santo de Jeová."],
      5: ["É bom ter objetivos espirituais porque nos dá direção e propósito, e quando alcançamos um objetivo, nos sentimos realizados e felizes."],
      6: ["Quatro passos: (1) pensar em áreas que gostaria de melhorar, (2) definir objetivos específicos e realistas, (3) fazer um plano para alcançar os objetivos, e (4) pedir ajuda a Jeová em oração."],
      7: ["Quando confiamos em Jeová, sabemos que ele vai nos ajudar a enfrentar qualquer situação, o que nos dá paz e alegria."],
      8: ["Três coisas podem ajudar: ler relatos bíblicos de pessoas que confiaram em Jeová, orar regularmente a Jeová, e observar como Jeová nos tem ajudado no passado."],
      9: ["Devemos focar nas bênçãos que temos, estabelecer objetivos espirituais e confiar em Jeová."]
    }
  },
  {
    id: "semana4",
    semana: "23-29 de março de 2026",
    cantico: 144,
    titulo: "Mostre empatia por outros",
    textoTema: "Alegrem-se com os que se alegram; chorem com os que choram. — Rom. 12:15.",
    objetivo: "Entender como demonstrar empatia genuína pelos irmãos e por todas as pessoas.",
    paragrafos: [
      {
        numero: 1,
        conteudo: "A empatia é a capacidade de entender e compartilhar os sentimentos de outra pessoa. Quando mostramos empatia, as pessoas se sentem compreendidas e amadas. A Bíblia nos incentiva a mostrar empatia. Romanos 12:15 diz: 'Alegrem-se com os que se alegram; chorem com os que choram.'",
        perguntas: ["O que é empatia?", "O que a Bíblia diz sobre mostrar empatia?"]
      },
      {
        numero: 2,
        conteudo: "Neste artigo, vamos ver como podemos mostrar empatia de três maneiras: (1) ouvindo com atenção, (2) falando palavras de consolo e (3) oferecendo ajuda prática.",
        perguntas: ["O que vamos considerar neste artigo?"]
      },
      {
        numero: 3,
        conteudo: "Ouvir com atenção. Uma das melhores maneiras de mostrar empatia é ouvir com atenção. Quando ouvimos alguém, mostramos que nos importamos com essa pessoa. Às vezes, as pessoas não precisam de conselhos. Elas só precisam de alguém que as ouça.",
        perguntas: ["Por que ouvir com atenção é uma forma importante de mostrar empatia?"]
      },
      {
        numero: 4,
        conteudo: "Como você pode ouvir com atenção? Olhe nos olhos da pessoa. Não interrompa. Não fique pensando no que vai dizer quando a pessoa terminar de falar. Faça perguntas para mostrar que está interessado. Essas atitudes mostram que você se importa de verdade.",
        perguntas: ["O que pode ajudá-lo a ouvir com atenção?"]
      },
      {
        numero: 5,
        conteudo: "Falar palavras de consolo. A Bíblia diz: 'A ansiedade no coração do homem o deprime, mas a boa palavra o anima.' (Pro. 12:25) Palavras de consolo podem fazer uma grande diferença na vida de alguém que está sofrendo.",
        perguntas: ["Por que palavras de consolo são importantes?"]
      },
      {
        numero: 6,
        conteudo: "Que palavras de consolo você pode dizer? Pode dizer: 'Sinto muito pelo que você está passando.' 'Estou aqui para ajudar.' 'Você não está sozinho.' Essas palavras simples podem trazer muito conforto.",
        perguntas: ["Que palavras de consolo você pode dizer a alguém que está sofrendo?"]
      },
      {
        numero: 7,
        conteudo: "Oferecer ajuda prática. Às vezes, as pessoas precisam de ajuda prática. Pode ser ajuda com tarefas do dia a dia, como fazer compras, cozinhar ou cuidar dos filhos. Quando oferecemos ajuda prática, mostramos que nossa empatia é genuína.",
        perguntas: ["Por que é importante oferecer ajuda prática?"]
      },
      {
        numero: 8,
        conteudo: "Como você pode oferecer ajuda prática? Pense nas necessidades da pessoa e ofereça ajuda específica. Em vez de dizer 'me avise se precisar de alguma coisa', diga 'posso levar um jantar para você amanhã?' Isso torna mais fácil para a pessoa aceitar sua ajuda.",
        perguntas: ["Como você pode oferecer ajuda prática de forma eficaz?"]
      },
      {
        numero: 9,
        conteudo: "Quando mostramos empatia por outros, imitamos o exemplo de Jeová e de Jesus. Jeová é descrito como 'o Pai de ternas misericórdias e o Deus de todo o consolo'. (2 Cor. 1:3) Jesus também mostrou empatia por pessoas que sofriam. Então, mostre empatia por outros!",
        perguntas: ["Por que devemos mostrar empatia por outros?"]
      }
    ],
    respostas: {
      1: ["A empatia é a capacidade de entender e compartilhar os sentimentos de outra pessoa.", "A Bíblia nos incentiva a nos alegrar com os que se alegram e chorar com os que choram."],
      2: ["Vamos ver como mostrar empatia de três maneiras: ouvindo com atenção, falando palavras de consolo e oferecendo ajuda prática."],
      3: ["Ouvir com atenção é importante porque mostramos que nos importamos com a pessoa. Às vezes, as pessoas só precisam de alguém que as ouça."],
      4: ["Podemos: olhar nos olhos da pessoa, não interromper, não ficar pensando no que vai dizer, e fazer perguntas para mostrar interesse."],
      5: ["São importantes porque a boa palavra anima o coração de quem está deprimido, fazendo uma grande diferença na vida de alguém que está sofrendo."],
      6: ["Podemos dizer: 'Sinto muito pelo que você está passando', 'Estou aqui para ajudar', 'Você não está sozinho'."],
      7: ["É importante porque quando oferecemos ajuda prática, mostramos que nossa empatia é genuína."],
      8: ["Devemos pensar nas necessidades da pessoa e oferecer ajuda específica, como 'posso levar um jantar para você amanhã?' em vez de 'me avise se precisar de alguma coisa'."],
      9: ["Devemos mostrar empatia porque assim imitamos o exemplo de Jeová, que é 'o Pai de ternas misericórdias', e de Jesus, que também mostrou empatia."]
    }
  }
]

export default function EstudoSentinelaPage() {
  const [activeTab, setActiveTab] = useState("semana1")
  const [expandedParagraphs, setExpandedParagraphs] = useState<Record<string, boolean>>({})

  const toggleParagraph = (estudoId: string, paragrafoNumero: number) => {
    const key = `${estudoId}-${paragrafoNumero}`
    setExpandedParagraphs(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const isExpanded = (estudoId: string, paragrafoNumero: number) => {
    const key = `${estudoId}-${paragrafoNumero}`
    return expandedParagraphs[key] ?? false
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estudo de A Sentinela</h1>
        <p className="text-muted-foreground">Março de 2026</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          {estudosMarco.map((estudo) => (
            <TabsTrigger 
              key={estudo.id} 
              value={estudo.id}
              className="text-xs sm:text-sm py-2 px-1 sm:px-3"
            >
              {estudo.semana.split(" de ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {estudosMarco.map((estudo) => (
          <TabsContent key={estudo.id} value={estudo.id} className="mt-6">
            <Card className="mb-6 border-primary/20">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Music className="h-5 w-5" />
                  <Badge variant="secondary">Cântico {estudo.cantico}</Badge>
                </div>
                <CardTitle className="text-xl sm:text-2xl text-primary">
                  {estudo.titulo}
                </CardTitle>
                <p className="text-muted-foreground italic">{estudo.textoTema}</p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <Target className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold">Objetivo: </span>
                    <span className="text-muted-foreground">{estudo.objetivo}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-4 pr-4">
                {estudo.paragrafos.map((paragrafo) => (
                  <Card 
                    key={paragrafo.numero} 
                    className="cursor-pointer transition-all hover:shadow-md"
                    onClick={() => toggleParagraph(estudo.id, paragrafo.numero)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-base font-bold">
                          Parágrafo {paragrafo.numero}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {isExpanded(estudo.id, paragrafo.numero) ? (
                            <>
                              <span>Ocultar resposta</span>
                              <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              <span>Ver resposta</span>
                              <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-foreground leading-relaxed">{paragrafo.conteudo}</p>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm text-primary">
                            Pergunta{paragrafo.perguntas.length > 1 ? "s" : ""}:
                          </span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {paragrafo.perguntas.map((pergunta, idx) => (
                            <li key={idx} className="text-muted-foreground">{pergunta}</li>
                          ))}
                        </ul>
                      </div>

                      {isExpanded(estudo.id, paragrafo.numero) && estudo.respostas[paragrafo.numero as keyof typeof estudo.respostas] && (
                        <div className="border-t pt-4 bg-green-50 dark:bg-green-950/20 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm text-green-700 dark:text-green-400">
                              Resposta{estudo.respostas[paragrafo.numero as keyof typeof estudo.respostas].length > 1 ? "s" : ""}:
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {estudo.respostas[paragrafo.numero as keyof typeof estudo.respostas].map((resposta, idx) => (
                              <li key={idx} className="text-sm text-green-800 dark:text-green-300 bg-white dark:bg-green-950/40 p-2 rounded border border-green-200 dark:border-green-800">
                                {resposta}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
