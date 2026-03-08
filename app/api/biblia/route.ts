import { NextRequest, NextResponse } from 'next/server'

// Mapeamento de livros em português para inglês (para a API)
const livrosMap: Record<string, string> = {
  'gênesis': 'genesis', 'gen': 'genesis', 'gên': 'genesis',
  'êxodo': 'exodus', 'êx': 'exodus', 'ex': 'exodus',
  'levítico': 'leviticus', 'lev': 'leviticus',
  'números': 'numbers', 'núm': 'numbers', 'num': 'numbers',
  'deuteronômio': 'deuteronomy', 'deut': 'deuteronomy',
  'josué': 'joshua', 'jos': 'joshua',
  'juízes': 'judges', 'juí': 'judges',
  'rute': 'ruth', 'rut': 'ruth',
  '1 samuel': '1-samuel', '1sam': '1-samuel', '1 sam': '1-samuel',
  '2 samuel': '2-samuel', '2sam': '2-samuel', '2 sam': '2-samuel',
  '1 reis': '1-kings', '1reis': '1-kings', '1 re': '1-kings',
  '2 reis': '2-kings', '2reis': '2-kings', '2 re': '2-kings',
  '1 crônicas': '1-chronicles', '1crô': '1-chronicles', '1 crô': '1-chronicles',
  '2 crônicas': '2-chronicles', '2crô': '2-chronicles', '2 crô': '2-chronicles',
  'esdras': 'ezra', 'esd': 'ezra',
  'neemias': 'nehemiah', 'nee': 'nehemiah',
  'ester': 'esther', 'est': 'esther',
  'jó': 'job',
  'salmos': 'psalms', 'sal': 'psalms', 'sl': 'psalms',
  'provérbios': 'proverbs', 'prov': 'proverbs', 'pro': 'proverbs', 'pr': 'proverbs',
  'eclesiastes': 'ecclesiastes', 'ecl': 'ecclesiastes',
  'cântico de salomão': 'song-of-solomon', 'cân': 'song-of-solomon', 'cântico': 'song-of-solomon',
  'isaías': 'isaiah', 'isa': 'isaiah', 'is': 'isaiah',
  'jeremias': 'jeremiah', 'jer': 'jeremiah',
  'lamentações': 'lamentations', 'lam': 'lamentations',
  'ezequiel': 'ezekiel', 'eze': 'ezekiel', 'ez': 'ezekiel',
  'daniel': 'daniel', 'dan': 'daniel',
  'oseias': 'hosea', 'os': 'hosea',
  'joel': 'joel',
  'amós': 'amos', 'am': 'amos',
  'obadias': 'obadiah', 'oba': 'obadiah', 'ob': 'obadiah',
  'jonas': 'jonah', 'jon': 'jonah',
  'miqueias': 'micah', 'miq': 'micah',
  'naum': 'nahum', 'na': 'nahum',
  'habacuque': 'habakkuk', 'hab': 'habakkuk',
  'sofonias': 'zephaniah', 'sof': 'zephaniah',
  'ageu': 'haggai', 'ag': 'haggai',
  'zacarias': 'zechariah', 'zac': 'zechariah',
  'malaquias': 'malachi', 'mal': 'malachi',
  'mateus': 'matthew', 'mat': 'matthew', 'mt': 'matthew',
  'marcos': 'mark', 'mar': 'mark', 'mc': 'mark',
  'lucas': 'luke', 'luc': 'luke', 'lc': 'luke',
  'joão': 'john', 'jo': 'john',
  'atos': 'acts', 'at': 'acts',
  'romanos': 'romans', 'rom': 'romans', 'ro': 'romans',
  '1 coríntios': '1-corinthians', '1cor': '1-corinthians', '1 cor': '1-corinthians',
  '2 coríntios': '2-corinthians', '2cor': '2-corinthians', '2 cor': '2-corinthians',
  'gálatas': 'galatians', 'gál': 'galatians', 'gal': 'galatians',
  'efésios': 'ephesians', 'efé': 'ephesians', 'ef': 'ephesians',
  'filipenses': 'philippians', 'fil': 'philippians', 'fp': 'philippians',
  'colossenses': 'colossians', 'col': 'colossians',
  '1 tessalonicenses': '1-thessalonians', '1tes': '1-thessalonians', '1 tes': '1-thessalonians',
  '2 tessalonicenses': '2-thessalonians', '2tes': '2-thessalonians', '2 tes': '2-thessalonians',
  '1 timóteo': '1-timothy', '1tim': '1-timothy', '1 tim': '1-timothy',
  '2 timóteo': '2-timothy', '2tim': '2-timothy', '2 tim': '2-timothy',
  'tito': 'titus', 'tit': 'titus',
  'filemom': 'philemon', 'flm': 'philemon',
  'hebreus': 'hebrews', 'heb': 'hebrews',
  'tiago': 'james', 'tia': 'james',
  '1 pedro': '1-peter', '1ped': '1-peter', '1 ped': '1-peter', '1pe': '1-peter',
  '2 pedro': '2-peter', '2ped': '2-peter', '2 ped': '2-peter', '2pe': '2-peter',
  '1 joão': '1-john', '1jo': '1-john', '1 jo': '1-john',
  '2 joão': '2-john', '2jo': '2-john', '2 jo': '2-john',
  '3 joão': '3-john', '3jo': '3-john', '3 jo': '3-john',
  'judas': 'jude', 'jud': 'jude',
  'apocalipse': 'revelation', 'apo': 'revelation', 'ap': 'revelation', 'rev': 'revelation'
}

// Nomes dos livros em português
const nomesLivros: Record<string, string> = {
  'genesis': 'Gênesis', 'exodus': 'Êxodo', 'leviticus': 'Levítico',
  'numbers': 'Números', 'deuteronomy': 'Deuteronômio', 'joshua': 'Josué',
  'judges': 'Juízes', 'ruth': 'Rute', '1-samuel': '1 Samuel',
  '2-samuel': '2 Samuel', '1-kings': '1 Reis', '2-kings': '2 Reis',
  '1-chronicles': '1 Crônicas', '2-chronicles': '2 Crônicas', 'ezra': 'Esdras',
  'nehemiah': 'Neemias', 'esther': 'Ester', 'job': 'Jó',
  'psalms': 'Salmos', 'proverbs': 'Provérbios', 'ecclesiastes': 'Eclesiastes',
  'song-of-solomon': 'Cântico de Salomão', 'isaiah': 'Isaías', 'jeremiah': 'Jeremias',
  'lamentations': 'Lamentações', 'ezekiel': 'Ezequiel', 'daniel': 'Daniel',
  'hosea': 'Oseias', 'joel': 'Joel', 'amos': 'Amós', 'obadiah': 'Obadias',
  'jonah': 'Jonas', 'micah': 'Miqueias', 'nahum': 'Naum', 'habakkuk': 'Habacuque',
  'zephaniah': 'Sofonias', 'haggai': 'Ageu', 'zechariah': 'Zacarias',
  'malachi': 'Malaquias', 'matthew': 'Mateus', 'mark': 'Marcos',
  'luke': 'Lucas', 'john': 'João', 'acts': 'Atos', 'romans': 'Romanos',
  '1-corinthians': '1 Coríntios', '2-corinthians': '2 Coríntios',
  'galatians': 'Gálatas', 'ephesians': 'Efésios', 'philippians': 'Filipenses',
  'colossians': 'Colossenses', '1-thessalonians': '1 Tessalonicenses',
  '2-thessalonians': '2 Tessalonicenses', '1-timothy': '1 Timóteo',
  '2-timothy': '2 Timóteo', 'titus': 'Tito', 'philemon': 'Filemom',
  'hebrews': 'Hebreus', 'james': 'Tiago', '1-peter': '1 Pedro',
  '2-peter': '2 Pedro', '1-john': '1 João', '2-john': '2 João',
  '3-john': '3 João', 'jude': 'Judas', 'revelation': 'Apocalipse'
}

// Base de versículos em português (Tradução do Novo Mundo - principais versículos)
const versiculosBase: Record<string, Record<string, Record<string, string>>> = {
  'matthew': {
    '5': {
      '3': 'Felizes os que têm consciência de sua necessidade espiritual, pois o Reino dos céus lhes pertence.',
      '4': 'Felizes os que choram, pois serão consolados.',
      '5': 'Felizes os de temperamento brando, pois herdarão a terra.',
      '6': 'Felizes os que têm fome e sede de justiça, pois serão satisfeitos.',
      '7': 'Felizes os misericordiosos, pois será mostrada misericórdia a eles.'
    },
    '6': {
      '33': 'Portanto, persistam em buscar primeiro o Reino e a justiça de Deus, e todas essas outras coisas lhes serão acrescentadas.',
      '34': 'Nunca fiquem ansiosos por causa do dia seguinte, pois o dia seguinte terá as suas próprias ansiedades. Cada dia já tem problemas suficientes.'
    },
    '10': {
      '35': 'Pois vim causar divisão entre o homem e seu pai, entre a filha e sua mãe, e entre a jovem esposa e sua sogra.'
    },
    '24': {
      '45': 'Quem é realmente o escravo fiel e prudente, a quem seu amo encarregou dos seus domésticos, para lhes dar o alimento no tempo apropriado?',
      '46': 'Feliz é aquele escravo, se o seu amo, ao chegar, o encontrar fazendo assim!',
      '47': 'Digo-lhes a verdade: Ele o encarregará de todos os seus bens.'
    }
  },
  'hebrews': {
    '5': {
      '14': 'Mas o alimento sólido é para os maduros, para aqueles que pelo uso têm as suas faculdades perceptivas treinadas para distinguir tanto o certo como o errado.'
    },
    '6': {
      '1': 'Portanto, agora que já passamos dos ensinamentos elementares a respeito de Cristo, avancemos rumo à maturidade, não lançando novamente um fundamento, a saber, o arrependimento de obras mortas e a fé em Deus.'
    }
  },
  'proverbs': {
    '25': {
      '11': 'Palavras ditas no tempo certo são como maçãs de ouro em engastes de prata.',
      '12': 'Sábio que dá reprova sábia a ouvido obediente é como um brinco de ouro e um adorno de ouro fino.'
    }
  },
  'colossians': {
    '4': {
      '6': 'Que sua fala seja sempre agradável, temperada com sal, para que saibam como responder a cada pessoa.'
    }
  },
  'acts': {
    '17': {
      '27': 'para que procurem a Deus, se é que poderiam tatear e realmente o achar, embora, de fato, ele não esteja longe de cada um de nós.'
    }
  },
  'mark': {
    '3': {
      '11': 'E os espíritos impuros, sempre que o viam, caíam diante dele e gritavam: "Tu és o Filho de Deus!"',
      '12': 'Mas ele lhes ordenava muitas vezes que não o divulgassem.'
    }
  },
  'psalms': {
    '31': {
      '5': 'Nas tuas mãos entrego o meu espírito. Tu me resgataste, ó Jeová, o Deus da verdade.'
    },
    '23': {
      '1': 'Jeová é meu Pastor. Nada me faltará.',
      '2': 'Ele me faz repousar em pastagens verdejantes; Guia-me junto a águas tranquilas.',
      '3': 'Ele reanima a minha alma. Guia-me pelos caminhos da justiça por amor do seu nome.',
      '4': 'Mesmo que eu ande pelo vale de sombra profunda, não temo nenhum mal, pois tu estás comigo; a tua vara e o teu cajado me confortam.'
    }
  },
  'john': {
    '3': {
      '16': 'Porque Deus amou tanto o mundo, que deu o seu Filho unigênito, para que todo aquele que nele exercer fé não seja destruído, mas tenha vida eterna.'
    },
    '17': {
      '3': 'Isto significa vida eterna: que conheçam a ti, o único Deus verdadeiro, e àquele que tu enviaste, Jesus Cristo.'
    }
  },
  'romans': {
    '5': {
      '8': 'Mas Deus demonstra seu próprio amor para conosco, porque Cristo morreu por nós enquanto ainda éramos pecadores.'
    },
    '6': {
      '23': 'Porque o salário pago pelo pecado é a morte, mas o dom dado por Deus é a vida eterna por Cristo Jesus, nosso Senhor.'
    }
  },
  '1-peter': {
    '5': {
      '7': 'lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.'
    }
  },
  'revelation': {
    '21': {
      '3': 'Com isso, ouvi uma voz alta vinda do trono dizer: "Eis que a tenda de Deus está com a humanidade. Ele residirá com eles, e eles serão o seu povo. O próprio Deus estará com eles."',
      '4': 'Ele enxugará dos seus olhos toda lágrima, e não haverá mais morte, nem haverá mais tristeza, nem choro, nem dor. As coisas anteriores já passaram."'
    }
  }
}

function parseReferencia(ref: string): { livro: string; capitulo: string; versiculoInicio: number; versiculoFim: number } | null {
  // Limpa a referência
  const refLimpa = ref.toLowerCase().trim().replace('.', '').replace(':', ' ')
  
  // Regex para capturar livro, capítulo e versículos
  // Exemplos: "mateus 5:3", "mat. 5:3", "1 coríntios 13:4-7", "sal 23:1, 2"
  const regex = /^(\d?\s?[a-záéíóúâêôãõç]+\.?)\s*(\d+)[\s:]+(\d+)(?:\s*[-–,]\s*(\d+))?/i
  const match = refLimpa.match(regex)
  
  if (!match) return null
  
  const livroInput = match[1].trim().replace('.', '')
  const capitulo = match[2]
  const versiculoInicio = parseInt(match[3])
  const versiculoFim = match[4] ? parseInt(match[4]) : versiculoInicio
  
  const livro = livrosMap[livroInput]
  if (!livro) return null
  
  return { livro, capitulo, versiculoInicio, versiculoFim }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ref = searchParams.get('ref')
  
  if (!ref) {
    return NextResponse.json({ error: 'Referência não fornecida' }, { status: 400 })
  }
  
  const parsed = parseReferencia(ref)
  
  if (!parsed) {
    return NextResponse.json({ 
      error: 'Referência inválida',
      referencia: ref,
      texto: `Não foi possível interpretar a referência "${ref}". Por favor, consulte diretamente em jw.org.`
    }, { status: 200 })
  }
  
  const { livro, capitulo, versiculoInicio, versiculoFim } = parsed
  const nomeLivro = nomesLivros[livro] || livro
  
  // Tenta buscar na base local
  const versiculos: string[] = []
  for (let v = versiculoInicio; v <= versiculoFim; v++) {
    const texto = versiculosBase[livro]?.[capitulo]?.[v.toString()]
    if (texto) {
      versiculos.push(`${v} ${texto}`)
    }
  }
  
  if (versiculos.length > 0) {
    return NextResponse.json({
      referencia: `${nomeLivro} ${capitulo}:${versiculoInicio}${versiculoFim > versiculoInicio ? `-${versiculoFim}` : ''}`,
      texto: versiculos.join(' '),
      fonte: 'Tradução do Novo Mundo'
    })
  }
  
  // Se não encontrou, retorna uma mensagem para consultar no jw.org
  return NextResponse.json({
    referencia: `${nomeLivro} ${capitulo}:${versiculoInicio}${versiculoFim > versiculoInicio ? `-${versiculoFim}` : ''}`,
    texto: `Para ler este texto, acesse a Bíblia de Estudo em jw.org`,
    fonte: 'jw.org',
    link: `https://www.jw.org/pt/biblioteca/biblia/biblia-de-estudo/livros/${livro}/${capitulo}/`
  })
}
