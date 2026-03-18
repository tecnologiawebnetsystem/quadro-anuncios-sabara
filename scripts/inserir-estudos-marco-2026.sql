-- Inserir mês de março de 2026 (se não existir)
INSERT INTO sentinela_meses (mes, ano)
SELECT 3, 2026
WHERE NOT EXISTS (SELECT 1 FROM sentinela_meses WHERE mes = 3 AND ano = 2026);

-- Pegar o ID do mês de março 2026
-- Vamos usar um bloco DO para ter acesso a variáveis

DO $$
DECLARE
  v_mes_id UUID;
  v_estudo1_id UUID;
  v_estudo2_id UUID;
  v_estudo3_id UUID;
  v_estudo4_id UUID;
BEGIN
  -- Buscar ou criar mês
  SELECT id INTO v_mes_id FROM sentinela_meses WHERE mes = 3 AND ano = 2026;
  
  IF v_mes_id IS NULL THEN
    INSERT INTO sentinela_meses (mes, ano) VALUES (3, 2026) RETURNING id INTO v_mes_id;
  END IF;

  -- Deletar estudos existentes de março 2026 para evitar duplicatas
  DELETE FROM sentinela_paragrafos WHERE estudo_id IN (SELECT id FROM sentinela_estudos WHERE mes_id = v_mes_id);
  DELETE FROM sentinela_estudos WHERE mes_id = v_mes_id;

  -- ============================================
  -- ESTUDO 1: 2-8 de março de 2026
  -- ============================================
  INSERT INTO sentinela_estudos (mes_id, numero_estudo, titulo, texto_tema, data_inicio, data_fim, cantico_inicial, cantico_final, objetivo)
  VALUES (
    v_mes_id,
    1,
    'Continue cuidando da sua necessidade espiritual',
    'Felizes os que têm consciência de sua necessidade espiritual. — MAT. 5:3.',
    '2026-03-02',
    '2026-03-08',
    97,
    162,
    'Entender como podemos continuar cuidando da nossa necessidade espiritual e por que isso é tão importante.'
  ) RETURNING id INTO v_estudo1_id;

  -- Parágrafos do Estudo 1
  INSERT INTO sentinela_paragrafos (estudo_id, numero, texto_base, pergunta, resposta, ordem) VALUES
  (v_estudo1_id, '1', 'Como humanos imperfeitos, temos muitas necessidades. Precisamos de comida, água, roupas e um lugar para morar. Mas temos uma necessidade ainda mais importante. Precisamos conhecer a Deus e ter um bom relacionamento com ele.', 'De que necessidade importante vamos tratar neste artigo?', 'Precisamos conhecer a Deus e ter um bom relacionamento com ele. Essa é a nossa necessidade espiritual, que é ainda mais importante do que nossas necessidades físicas.', 1),
  (v_estudo1_id, '2', 'O que significa ter consciência de nossa necessidade espiritual? Significa reconhecer que precisamos de orientação de Deus. Pessoas que reconhecem isso buscam a Deus e querem aprender sobre ele. (Mat. 5:6) Elas se esforçam para ter um bom relacionamento com Jeová.', 'O que significa ter consciência de nossa necessidade espiritual?', 'Significa reconhecer que precisamos de orientação de Deus. Quem tem essa consciência busca a Deus, quer aprender sobre ele e se esforça para ter um bom relacionamento com Jeová.', 2),
  (v_estudo1_id, '3', 'Jeová nos deu tudo o que precisamos para satisfazer nossa necessidade espiritual. Ele nos deu a Bíblia, que contém sua mensagem para nós. Também nos deu a organização dele, que nos ajuda a entender a Bíblia. Além disso, Jeová nos deu o espírito santo, que nos dá força para fazer a vontade dele.', 'O que Jeová nos deu para satisfazer nossa necessidade espiritual?', 'Jeová nos deu a Bíblia com sua mensagem, a organização dele que nos ajuda a entender a Bíblia, e o espírito santo que nos dá força para fazer sua vontade.', 3),
  (v_estudo1_id, '4, 5', 'No entanto, precisamos fazer a nossa parte. Precisamos estudar a Bíblia regularmente. Precisamos assistir às reuniões e participar delas. E precisamos orar a Jeová com frequência. Se fizermos essas coisas, vamos fortalecer nosso relacionamento com Jeová e nos sentir mais felizes.', 'O que precisamos fazer para satisfazer nossa necessidade espiritual?', 'Precisamos estudar a Bíblia regularmente, assistir às reuniões e participar delas, e orar a Jeová com frequência. Fazendo isso, fortalecemos nosso relacionamento com Jeová e nos sentimos mais felizes.', 4),
  (v_estudo1_id, '6', 'Vamos analisar três coisas que podem nos ajudar a cuidar da nossa necessidade espiritual: (1) estudar a Bíblia, (2) assistir às reuniões e (3) orar a Jeová.', 'Quais são as três coisas que vamos analisar neste artigo?', 'Vamos analisar: (1) estudar a Bíblia, (2) assistir às reuniões e (3) orar a Jeová.', 5),
  (v_estudo1_id, '7', 'Por que precisamos estudar a Bíblia? Porque a Bíblia contém a mensagem de Jeová para nós. Quando estudamos a Bíblia, aprendemos sobre Jeová e sobre o que ele quer que façamos. Também aprendemos sobre as bênçãos que ele tem reservado para nós.', 'Por que precisamos estudar a Bíblia?', 'Porque a Bíblia contém a mensagem de Jeová para nós. Ao estudá-la, aprendemos sobre Jeová, sobre o que ele quer que façamos e sobre as bênçãos que ele tem reservado para nós.', 6),
  (v_estudo1_id, '8', 'Para tirar o máximo proveito do estudo da Bíblia, precisamos nos preparar bem. Isso significa reservar tempo suficiente para o estudo e escolher um lugar tranquilo. Também significa orar a Jeová pedindo que ele nos ajude a entender o que estamos lendo.', 'Como podemos tirar o máximo proveito do estudo da Bíblia?', 'Precisamos nos preparar bem, reservando tempo suficiente, escolhendo um lugar tranquilo e orando a Jeová pedindo ajuda para entender o que estamos lendo.', 7),
  (v_estudo1_id, '9', 'Quando estudamos a Bíblia, não devemos ler o texto de forma mecânica. Devemos meditar no que estamos lendo e pensar em como podemos aplicar aquilo na nossa vida. Isso vai nos ajudar a tirar mais proveito do estudo.', 'O que devemos fazer ao estudar a Bíblia?', 'Não devemos ler de forma mecânica. Devemos meditar no que estamos lendo e pensar em como aplicar aquilo na nossa vida.', 8),
  (v_estudo1_id, '10', 'Por que precisamos assistir às reuniões? Porque nas reuniões aprendemos mais sobre Jeová e sobre a Bíblia. Também recebemos encorajamento dos nossos irmãos. E temos a oportunidade de encorajar outros.', 'Por que precisamos assistir às reuniões?', 'Porque aprendemos mais sobre Jeová e a Bíblia, recebemos encorajamento dos irmãos e temos a oportunidade de encorajar outros.', 9),
  (v_estudo1_id, '11, 12', 'Para tirar o máximo proveito das reuniões, precisamos nos preparar. Isso significa estudar as matérias antes da reunião. Também significa chegar na hora e participar das reuniões, fazendo comentários e cantando os cânticos.', 'Como podemos tirar o máximo proveito das reuniões?', 'Precisamos nos preparar, estudando as matérias antes da reunião. Também devemos chegar na hora e participar, fazendo comentários e cantando os cânticos.', 10),
  (v_estudo1_id, '13', 'Por que precisamos orar a Jeová? Porque a oração é a maneira de nos comunicarmos com Jeová. Quando oramos, podemos agradecer a Jeová pelas bênçãos que recebemos. Também podemos pedir ajuda para enfrentar problemas e para fazer a vontade dele.', 'Por que precisamos orar a Jeová?', 'Porque a oração é a maneira de nos comunicarmos com Jeová. Podemos agradecer pelas bênçãos recebidas e pedir ajuda para enfrentar problemas e fazer a vontade dele.', 11),
  (v_estudo1_id, '14', 'Para que nossas orações sejam aceitáveis a Jeová, precisamos orar com fé. Isso significa acreditar que Jeová existe e que ele recompensa os que o buscam. Também precisamos orar em nome de Jesus.', 'O que precisamos fazer para que nossas orações sejam aceitáveis a Jeová?', 'Precisamos orar com fé, acreditando que Jeová existe e recompensa os que o buscam. Também precisamos orar em nome de Jesus.', 12),
  (v_estudo1_id, '15', 'Devemos orar a Jeová com frequência. Podemos orar de manhã, à noite e em qualquer momento do dia. Podemos orar em voz alta ou em silêncio. O importante é manter uma comunicação constante com Jeová.', 'Com que frequência devemos orar a Jeová?', 'Devemos orar com frequência: de manhã, à noite e em qualquer momento do dia. Podemos orar em voz alta ou em silêncio. O importante é manter comunicação constante com Jeová.', 13),
  (v_estudo1_id, '16, 17', 'Se continuarmos cuidando da nossa necessidade espiritual, vamos ter muitas bênçãos. Vamos ter paz interior e alegria verdadeira. Também vamos ter um relacionamento cada vez mais forte com Jeová. E vamos ter a esperança de viver para sempre no Paraíso.', 'Que bênçãos teremos se continuarmos cuidando da nossa necessidade espiritual?', 'Teremos paz interior, alegria verdadeira, um relacionamento cada vez mais forte com Jeová e a esperança de viver para sempre no Paraíso.', 14),
  (v_estudo1_id, '18', 'Portanto, continuemos cuidando da nossa necessidade espiritual. Estudemos a Bíblia regularmente, assistamos às reuniões e oremos a Jeová com frequência. Se fizermos isso, seremos verdadeiramente felizes.', 'O que devemos continuar fazendo?', 'Devemos continuar estudando a Bíblia regularmente, assistindo às reuniões e orando a Jeová com frequência. Assim seremos verdadeiramente felizes.', 15);

  -- ============================================
  -- ESTUDO 2: 9-15 de março de 2026
  -- ============================================
  INSERT INTO sentinela_estudos (mes_id, numero_estudo, titulo, texto_tema, data_inicio, data_fim, cantico_inicial, cantico_final, objetivo)
  VALUES (
    v_mes_id,
    2,
    'Você é capaz de lutar contra sentimentos negativos!',
    'Lancem sobre ele toda a sua ansiedade, porque ele cuida de vocês. — 1 PED. 5:7.',
    '2026-03-09',
    '2026-03-15',
    45,
    34,
    'Aprender estratégias práticas para lidar com sentimentos negativos como ansiedade, tristeza e desânimo.'
  ) RETURNING id INTO v_estudo2_id;

  -- Parágrafos do Estudo 2
  INSERT INTO sentinela_paragrafos (estudo_id, numero, texto_base, pergunta, resposta, ordem) VALUES
  (v_estudo2_id, '1, 2', 'Todos nós enfrentamos sentimentos negativos de vez em quando. Podemos sentir ansiedade, tristeza ou desânimo. Esses sentimentos são normais, mas precisamos aprender a lidar com eles de maneira saudável.', 'Que sentimentos negativos todos nós enfrentamos?', 'Todos enfrentamos ansiedade, tristeza ou desânimo de vez em quando. Esses sentimentos são normais, mas precisamos aprender a lidar com eles de maneira saudável.', 1),
  (v_estudo2_id, '3', 'Jeová entende nossos sentimentos e quer nos ajudar. A Bíblia nos garante que podemos lançar sobre ele toda a nossa ansiedade, porque ele cuida de nós. (1 Ped. 5:7) Isso é muito reconfortante!', 'Como Jeová nos ajuda com nossos sentimentos negativos?', 'Jeová entende nossos sentimentos e quer nos ajudar. Podemos lançar sobre ele toda a nossa ansiedade, porque ele cuida de nós. (1 Ped. 5:7)', 2),
  (v_estudo2_id, '4', 'Uma estratégia importante é orar a Jeová sobre nossos sentimentos. Podemos contar a ele tudo o que nos preocupa. Jeová escuta nossas orações e nos dá paz. (Fil. 4:6, 7)', 'Qual é uma estratégia importante para lidar com sentimentos negativos?', 'Orar a Jeová sobre nossos sentimentos. Podemos contar a ele tudo o que nos preocupa, e ele nos escuta e nos dá paz. (Fil. 4:6, 7)', 3),
  (v_estudo2_id, '5, 6', 'Outra estratégia é meditar em pensamentos positivos. A Bíblia nos incentiva a pensar em coisas verdadeiras, sérias, justas, puras e amáveis. (Fil. 4:8) Quando focamos em coisas boas, nossa mente fica mais tranquila.', 'Como meditar em pensamentos positivos pode nos ajudar?', 'Devemos pensar em coisas verdadeiras, sérias, justas, puras e amáveis. (Fil. 4:8) Quando focamos em coisas boas, nossa mente fica mais tranquila.', 4),
  (v_estudo2_id, '7', 'Passar tempo com irmãos encorajadores também ajuda muito. Na congregação, encontramos pessoas que nos amam e se preocupam conosco. Conversar com eles pode aliviar nosso peso emocional.', 'Como os irmãos da congregação podem nos ajudar?', 'Na congregação encontramos pessoas que nos amam e se preocupam conosco. Conversar com irmãos encorajadores pode aliviar nosso peso emocional.', 5),
  (v_estudo2_id, '8', 'O estudo da Bíblia também é muito importante. As palavras de Jeová trazem consolo e esperança. Quando lemos sobre as promessas de Jeová, nossa perspectiva melhora.', 'Por que o estudo da Bíblia é importante para lidar com sentimentos negativos?', 'As palavras de Jeová trazem consolo e esperança. Quando lemos sobre suas promessas, nossa perspectiva melhora.', 6),
  (v_estudo2_id, '9, 10', 'Cuidar da nossa saúde física também afeta nossa saúde emocional. Exercícios físicos, alimentação saudável e descanso adequado nos ajudam a lidar melhor com o estresse.', 'Como cuidar da saúde física ajuda a lidar com sentimentos negativos?', 'Exercícios físicos, alimentação saudável e descanso adequado afetam positivamente nossa saúde emocional e nos ajudam a lidar melhor com o estresse.', 7),
  (v_estudo2_id, '11', 'Às vezes, precisamos de ajuda profissional. Não há vergonha em procurar um médico ou terapeuta quando necessário. Jeová pode usar essas pessoas para nos ajudar.', 'Quando devemos procurar ajuda profissional?', 'Quando necessário, devemos procurar um médico ou terapeuta. Não há vergonha nisso. Jeová pode usar essas pessoas para nos ajudar.', 8),
  (v_estudo2_id, '12', 'Lembre-se de que sentimentos negativos são temporários. Jeová promete um futuro em que não haverá mais dor, tristeza ou lágrimas. (Rev. 21:4) Essa esperança nos fortalece agora.', 'Que esperança nos fortalece?', 'Jeová promete um futuro sem dor, tristeza ou lágrimas. (Rev. 21:4) Sentimentos negativos são temporários, e essa esperança nos fortalece.', 9),
  (v_estudo2_id, '13, 14', 'Devemos ser pacientes conosco mesmos. A recuperação emocional leva tempo. Jeová não espera que sejamos perfeitos. Ele conhece nossas limitações e nos ama mesmo assim.', 'Por que devemos ser pacientes conosco mesmos?', 'A recuperação emocional leva tempo. Jeová não espera perfeição de nós. Ele conhece nossas limitações e nos ama mesmo assim.', 10),
  (v_estudo2_id, '15', 'Ajudar outros também nos ajuda. Quando nos concentramos em servir a outros, nossos próprios problemas parecem menores. O serviço a Jeová traz grande satisfação.', 'Como ajudar outros pode nos beneficiar?', 'Quando nos concentramos em servir a outros, nossos problemas parecem menores. O serviço a Jeová traz grande satisfação.', 11),
  (v_estudo2_id, '16, 17', 'Você é capaz de lutar contra sentimentos negativos! Com a ajuda de Jeová, das Escrituras e dos irmãos, você pode vencer essa batalha. Nunca desista!', 'Por que podemos ter certeza de que venceremos sentimentos negativos?', 'Com a ajuda de Jeová, das Escrituras e dos irmãos, somos capazes de lutar e vencer sentimentos negativos. Nunca devemos desistir!', 12);

  -- ============================================
  -- ESTUDO 3: 16-22 de março de 2026
  -- ============================================
  INSERT INTO sentinela_estudos (mes_id, numero_estudo, titulo, texto_tema, data_inicio, data_fim, cantico_inicial, cantico_final, objetivo)
  VALUES (
    v_mes_id,
    3,
    'Por que precisamos do resgate?',
    'O Filho do homem veio para dar a sua vida como resgate em troca de muitos. — MAT. 20:28.',
    '2026-03-16',
    '2026-03-22',
    20,
    19,
    'Entender por que precisamos do resgate e como ele demonstra o amor de Jeová por nós.'
  ) RETURNING id INTO v_estudo3_id;

  -- Parágrafos do Estudo 3
  INSERT INTO sentinela_paragrafos (estudo_id, numero, texto_base, pergunta, resposta, ordem) VALUES
  (v_estudo3_id, '1, 2', 'O resgate é a maior dádiva que Jeová já deu à humanidade. Mas o que é exatamente o resgate e por que precisamos dele? Este artigo vai nos ajudar a entender essa provisão amorosa.', 'Qual é a maior dádiva que Jeová já deu à humanidade?', 'O resgate é a maior dádiva de Jeová à humanidade. Precisamos entender o que é o resgate e por que precisamos dele.', 1),
  (v_estudo3_id, '3', 'Quando Adão pecou, ele perdeu a vida perfeita que tinha. Como resultado, todos os seus descendentes nasceram imperfeitos e sujeitos ao pecado e à morte. (Rom. 5:12)', 'O que aconteceu quando Adão pecou?', 'Adão perdeu a vida perfeita. Como resultado, todos os seus descendentes nasceram imperfeitos e sujeitos ao pecado e à morte. (Rom. 5:12)', 2),
  (v_estudo3_id, '4', 'Por causa do pecado herdado, não conseguimos viver de acordo com os padrões perfeitos de Jeová. Precisamos de ajuda para sermos reconciliados com Deus.', 'Por que precisamos de ajuda para ser reconciliados com Deus?', 'Por causa do pecado herdado, não conseguimos viver de acordo com os padrões perfeitos de Jeová. Precisamos de ajuda.', 3),
  (v_estudo3_id, '5, 6', 'A justiça de Jeová exigia que o preço do pecado de Adão fosse pago. Uma vida humana perfeita precisava ser dada em troca da vida perfeita que Adão perdeu. Isso é o resgate.', 'O que a justiça de Jeová exigia?', 'Uma vida humana perfeita precisava ser dada em troca da vida perfeita que Adão perdeu. Esse é o resgate que a justiça de Jeová exigia.', 4),
  (v_estudo3_id, '7', 'Jesus Cristo, o Filho unigênito de Jeová, se ofereceu para dar sua vida como resgate. Jesus era perfeito, então sua vida tinha o mesmo valor da vida que Adão perdeu.', 'Quem se ofereceu para pagar o resgate?', 'Jesus Cristo, o Filho unigênito de Jeová, se ofereceu. Como Jesus era perfeito, sua vida tinha o mesmo valor da vida que Adão perdeu.', 5),
  (v_estudo3_id, '8', 'Jeová enviou seu Filho à Terra para nascer como humano perfeito. Jesus cresceu, viveu uma vida sem pecado e depois deu sua vida por nós.', 'O que Jeová fez para providenciar o resgate?', 'Jeová enviou seu Filho à Terra para nascer como humano perfeito. Jesus viveu sem pecado e depois deu sua vida por nós.', 6),
  (v_estudo3_id, '9, 10', 'Na noite antes de morrer, Jesus instituiu a Celebração da sua morte. Ele pediu que seus seguidores se lembrassem do que ele estava prestes a fazer por eles.', 'O que Jesus fez na noite antes de morrer?', 'Jesus instituiu a Celebração da sua morte e pediu que seus seguidores se lembrassem do que ele estava prestes a fazer por eles.', 7),
  (v_estudo3_id, '11', 'Jesus morreu numa estaca de tortura em 14 de nisã de 33 EC. Sua morte pagou o preço do pecado de Adão e abriu o caminho para a humanidade ter vida eterna.', 'Quando e como Jesus morreu?', 'Jesus morreu numa estaca de tortura em 14 de nisã de 33 EC. Sua morte pagou o preço do pecado de Adão e abriu o caminho para vida eterna.', 8),
  (v_estudo3_id, '12', 'Jeová ressuscitou Jesus três dias depois. Jesus ascendeu ao céu e apresentou a Jeová o valor de sua vida humana perfeita. Assim, o resgate foi completado.', 'O que aconteceu depois da morte de Jesus?', 'Jeová ressuscitou Jesus três dias depois. Ele ascendeu ao céu e apresentou a Jeová o valor de sua vida humana perfeita, completando o resgate.', 9),
  (v_estudo3_id, '13, 14', 'Por causa do resgate, podemos ter nossos pecados perdoados. Podemos ter um relacionamento com Jeová e ter a esperança de viver para sempre.', 'Que benefícios o resgate traz para nós?', 'Por causa do resgate, podemos ter nossos pecados perdoados, ter um relacionamento com Jeová e ter a esperança de viver para sempre.', 10),
  (v_estudo3_id, '15', 'O resgate prova que Jeová nos ama profundamente. Ele deu o que tinha de mais precioso para nos salvar. Isso deve nos motivar a amá-lo e a servi-lo.', 'O que o resgate prova sobre Jeová?', 'O resgate prova que Jeová nos ama profundamente. Ele deu o que tinha de mais precioso para nos salvar. Isso deve nos motivar a amá-lo e servi-lo.', 11),
  (v_estudo3_id, '16, 17', 'Jesus também demonstrou grande amor por nós. Ele sofreu e morreu voluntariamente para que pudéssemos viver. Que amor maravilhoso!', 'Como Jesus demonstrou amor por nós?', 'Jesus sofreu e morreu voluntariamente para que pudéssemos viver. Ele demonstrou um amor maravilhoso por nós.', 12),
  (v_estudo3_id, '18', 'Somos muito gratos pelo resgate. No próximo artigo, vamos aprender como podemos mostrar nossa gratidão por essa dádiva inestimável.', 'O que vamos aprender no próximo artigo?', 'Vamos aprender como podemos mostrar nossa gratidão pelo resgate, essa dádiva inestimável de Jeová.', 13);

  -- ============================================
  -- ESTUDO 4: 23-29 de março de 2026
  -- ============================================
  INSERT INTO sentinela_estudos (mes_id, numero_estudo, titulo, texto_tema, data_inicio, data_fim, cantico_inicial, cantico_final, objetivo)
  VALUES (
    v_mes_id,
    4,
    'Como você vai mostrar sua gratidão pelo resgate?',
    'O amor do Cristo nos compele. — 2 COR. 5:14.',
    '2026-03-23',
    '2026-03-29',
    18,
    30,
    'Aprender maneiras práticas de mostrar gratidão pelo resgate de Cristo em nossa vida diária.'
  ) RETURNING id INTO v_estudo4_id;

  -- Parágrafos do Estudo 4
  INSERT INTO sentinela_paragrafos (estudo_id, numero, texto_base, pergunta, resposta, ordem) VALUES
  (v_estudo4_id, '1', 'No artigo anterior, aprendemos por que precisamos do resgate. Agora, vamos considerar como podemos mostrar nossa gratidão por essa provisão amorosa de Jeová.', 'O que vamos considerar neste artigo?', 'Vamos considerar como podemos mostrar nossa gratidão pelo resgate, a provisão amorosa de Jeová.', 1),
  (v_estudo4_id, '2, 3', 'Uma maneira de mostrar gratidão é exercer fé no resgate. Isso significa acreditar que o sacrifício de Jesus realmente pode nos salvar. Também significa viver de acordo com essa fé.', 'Como podemos mostrar gratidão pelo resgate?', 'Exercendo fé no resgate, acreditando que o sacrifício de Jesus pode nos salvar e vivendo de acordo com essa fé.', 2),
  (v_estudo4_id, '4', 'Outra maneira é dedicar nossa vida a Jeová e se batizar. O batismo é um passo importante que mostra nosso compromisso de servir a Jeová.', 'Por que a dedicação e o batismo são importantes?', 'A dedicação e o batismo são importantes porque mostram nosso compromisso de servir a Jeová. É uma maneira de demonstrar gratidão pelo resgate.', 3),
  (v_estudo4_id, '5, 6', 'Também mostramos gratidão participando da Celebração da morte de Cristo. Esse evento anual nos ajuda a lembrar do que Jesus fez por nós. Este ano, a Celebração será em 2 de abril.', 'Por que devemos participar da Celebração?', 'A Celebração nos ajuda a lembrar do que Jesus fez por nós. Participar dela mostra nossa gratidão pelo resgate.', 4),
  (v_estudo4_id, '7', 'Podemos mostrar gratidão pregando as boas novas a outros. Quando ajudamos pessoas a conhecer a Jeová e a Jesus, estamos ajudando-as a se beneficiar do resgate.', 'Como pregar mostra gratidão pelo resgate?', 'Ao pregar, ajudamos pessoas a conhecer Jeová e Jesus e a se beneficiar do resgate. Isso mostra nossa gratidão.', 5),
  (v_estudo4_id, '8, 9', 'Imitar o amor de Jesus também é uma forma de gratidão. Jesus amou as pessoas e sempre quis ajudá-las. Podemos fazer o mesmo, mostrando amor genuíno aos outros.', 'Como podemos imitar o amor de Jesus?', 'Podemos amar as pessoas e sempre querer ajudá-las, assim como Jesus fazia. Mostrar amor genuíno aos outros é uma forma de gratidão.', 6),
  (v_estudo4_id, '10', 'Devemos mostrar amor especialmente aos nossos irmãos cristãos. A congregação é uma família espiritual onde podemos praticar o amor fraternal.', 'Por que devemos mostrar amor aos irmãos?', 'A congregação é uma família espiritual. Mostrar amor aos irmãos cristãos é uma forma de demonstrar gratidão pelo resgate.', 7),
  (v_estudo4_id, '11, 12', 'Perdoar os outros também mostra gratidão. Já que Jeová nos perdoou por causa do resgate, devemos perdoar aqueles que pecam contra nós.', 'Por que devemos perdoar os outros?', 'Já que Jeová nos perdoou por causa do resgate, devemos perdoar aqueles que pecam contra nós. Isso mostra gratidão.', 8),
  (v_estudo4_id, '13', 'Viver de maneira limpa e moral também é importante. Jesus morreu para nos libertar do pecado. Devemos nos esforçar para viver de acordo com os padrões de Jeová.', 'Por que devemos viver de maneira limpa e moral?', 'Jesus morreu para nos libertar do pecado. Viver de acordo com os padrões de Jeová mostra gratidão pelo resgate.', 9),
  (v_estudo4_id, '14, 15', 'Devemos evitar coisas que desagradam a Jeová. Isso inclui comportamentos imorais, vícios e entretenimento prejudicial. Queremos honrar o sacrifício de Jesus.', 'O que devemos evitar?', 'Devemos evitar comportamentos imorais, vícios e entretenimento prejudicial. Queremos honrar o sacrifício de Jesus.', 10),
  (v_estudo4_id, '16', 'Agradecemos a Jeová em oração pelo resgate. Expressamos nossa gratidão por essa provisão maravilhosa regularmente em nossas orações.', 'Como podemos expressar gratidão em oração?', 'Podemos agradecer a Jeová em oração pelo resgate, expressando gratidão regularmente por essa provisão maravilhosa.', 11),
  (v_estudo4_id, '17, 18', 'O amor do Cristo nos compele a viver para ele, não para nós mesmos. Que possamos sempre mostrar nossa gratidão pelo resgate em tudo o que fazemos!', 'O que o amor do Cristo nos compele a fazer?', 'O amor do Cristo nos compele a viver para ele, não para nós mesmos. Devemos sempre mostrar gratidão pelo resgate em tudo o que fazemos!', 12);

  RAISE NOTICE 'Estudos de março de 2026 inseridos com sucesso!';
  RAISE NOTICE 'Estudo 1 ID: %', v_estudo1_id;
  RAISE NOTICE 'Estudo 2 ID: %', v_estudo2_id;
  RAISE NOTICE 'Estudo 3 ID: %', v_estudo3_id;
  RAISE NOTICE 'Estudo 4 ID: %', v_estudo4_id;
END $$;
