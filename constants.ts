import { CreativeType, ImageSize, VoiceStyle, VoiceOption, AwarenessLevel, LanguageType } from './types';

export const CREATIVE_TYPE_OPTIONS: { value: CreativeType; label: string }[] = [
  { value: CreativeType.VIDEO_UGC, label: 'Vídeo UGC (Reels/Stories)' },
  { value: CreativeType.MINI_VSL, label: 'Mini VSL (40 segundos)' },
  { value: CreativeType.IMAGEM_UNICA, label: 'Imagem Única (Feed/Stories)' },
  { value: CreativeType.CARROSSEL, label: 'Carrossel (Educativo/Oferta)' },
];

export const IMAGE_SIZE_OPTIONS: Record<string, { value: ImageSize; label: string }[]> = {
    [CreativeType.IMAGEM_UNICA]: [
        { value: '1:1', label: 'Quadrado (1:1)' },
        { value: '4:5', label: 'Vertical (4:5)' },
        { value: '9:16', label: 'Stories (9:16)' },
    ],
    [CreativeType.CARROSSEL]: [
        { value: '1:1', label: 'Quadrado (1:1)' },
        { value: '4:5', label: 'Vertical (4:5)' },
    ],
    [CreativeType.VIDEO_UGC]: [],
    [CreativeType.MINI_VSL]: [],
};


export const NICHE_OPTIONS: string[] = [
  'Emagrecimento',
  'Saúde e Bem-estar',
  'Finanças e Investimentos',
  'Renda Extra',
  'Beleza e Estética',
  'Relacionamentos',
  'Desenvolvimento Pessoal',
  'Marketing Digital',
  'Pets',
  'Maternidade',
  'Outro',
];

export const HOOK_OPTIONS_BY_AWARENESS: Record<AwarenessLevel, { value: string; label: string }[]> = {
  [AwarenessLevel.UNCONSCIOUS]: [
    { value: 'Padrão de Interrupção', label: 'Padrão de Interrupção' },
    { value: 'Estatística Chocante', label: 'Estatística Chocante' },
    { value: 'Revelação Silenciosa', label: 'Revelação Silenciosa' },
    { value: 'Comparação Temporal', label: 'Comparação Temporal' },
    { value: 'Pergunta Existencial', label: 'Pergunta Existencial' },
    { value: 'Observação Social', label: 'Observação Social' },
    { value: 'Inversão de Realidade', label: 'Inversão de Realidade' },
  ],
  [AwarenessLevel.PROBLEM_AWARE]: [
    { value: 'Causa Oculta', label: 'Causa Oculta' },
    { value: 'Desconstrução', label: 'Desconstrução' },
    { value: 'Ciclo Vicioso', label: 'Ciclo Vicioso' },
    { value: 'Revelação Progressiva', label: 'Revelação Progressiva' },
    { value: 'Erro Comum', label: 'Erro Comum' },
    { value: 'Teste de Auto-Diagnóstico', label: 'Teste de Auto-Diagnóstico' },
    { value: 'Linha do Tempo', label: 'Linha do Tempo' },
  ],
  [AwarenessLevel.SOLUTION_AWARE]: [
    { value: 'Diferenciação Direta', label: 'Diferenciação Direta' },
    { value: 'Prova Social Numérica', label: 'Prova Social Numérica' },
    { value: 'Objeção Antecipada', label: 'Objeção Antecipada' },
    { value: 'Comparação Lado a Lado', label: 'Comparação Lado a Lado' },
    { value: 'Antes e Depois Emocional', label: 'Antes e Depois Emocional' },
    { value: 'Autoridade por Associação', label: 'Autoridade por Associação' },
    { value: 'Garantia Inversa', label: 'Garantia Inversa' },
  ],
  [AwarenessLevel.PRODUCT_AWARE]: [
    { value: 'Escassez Real', label: 'Escassez Real' },
    { value: 'Facilitação Extrema', label: 'Facilitação Extrema' },
    { value: 'Custo de Oportunidade', label: 'Custo de Oportunidade' },
    { value: 'Bônus com Prazo', label: 'Bônus com Prazo' },
    { value: 'Próximo Passo Óbvio', label: 'Próximo Passo Óbvio' },
    { value: 'Comparação de Investimento', label: 'Comparação de Investimento' },
    { value: 'Deadline Emocional', label: 'Deadline Emocional' },
  ],
  [AwarenessLevel.ULTRA_AWARE]: [
    { value: 'Acesso Imediato', label: 'Acesso Imediato' },
    { value: 'Demonstração em Tempo Real', label: 'Demonstração em Tempo Real' },
    { value: 'Chamada Direta', label: 'Chamada Direta' },
    { value: 'Resultado Garantido', label: 'Resultado Garantido' },
  ],
};


export const VOICE_STYLE_OPTIONS: { value: VoiceStyle; label: string }[] = [
    { value: VoiceStyle.ENTHUSIASTIC, label: 'Entusiasmado/Energético' },
    { value: VoiceStyle.CALM, label: 'Calmo/Confiante' },
    { value: VoiceStyle.PROFESSIONAL, label: 'Profissional/Explicativo' },
    { value: VoiceStyle.EMPATHETIC, label: 'Empático/Conversacional' },
    { value: VoiceStyle.NARRATIVE, label: 'Narrativo/Contação de Histórias' },
];

// Lista de vozes revisada e organizada, usando vozes oficiais do Gemini para garantir compatibilidade e gênero correto.
// Adicionadas variações de estilo para as vozes mais versáteis (Kore e Zephyr) para obter resultados mais humanizados e menos robóticos.
const femaleVoices: VoiceOption[] = [
    { name: 'Kore - Amigável e Conversacional', apiName: 'Kore', gender: 'female', styleHint: 'friendly' },
    { name: 'Kore - Calma e Clara', apiName: 'Kore', gender: 'female', styleHint: 'calm' },
    { name: 'Kore - Animada e Energética', apiName: 'Kore', gender: 'female', styleHint: 'energetic' },
];

const maleVoices: VoiceOption[] = [
    { name: 'Zephyr - Amigável e Confiável', apiName: 'Zephyr', gender: 'male', styleHint: 'friendly' },
    { name: 'Zephyr - Calmo e Profissional', apiName: 'Zephyr', gender: 'male', styleHint: 'calm' },
    { name: 'Zephyr - Dinâmico e Energético', apiName: 'Zephyr', gender: 'male', styleHint: 'energetic' },
    { name: 'Puck - Jovem e Otimista', apiName: 'Puck', gender: 'male' },
    { name: 'Charon - Séria e Profunda (Documentário)', apiName: 'Charon', gender: 'male' },
    { name: 'Fenrir - Forte e Assertiva (Impacto)', apiName: 'Fenrir', gender: 'male' },
];


export const VOICE_OPTIONS: VoiceOption[] = [
  ...femaleVoices,
  ...maleVoices,
];

export const AWARENESS_LEVEL_OPTIONS: { value: AwarenessLevel; label: string; description: string }[] = [
    {
        value: AwarenessLevel.UNCONSCIOUS,
        label: 'Inconsciente',
        description: 'Objetivo: despertar consciência do problema sem vender. Tom: intrigante, provocativo, misterioso. Formato ideal: Reels curtos (7–15s), Stories.',
    },
    {
        value: AwarenessLevel.PROBLEM_AWARE,
        label: 'Consciente do Problema',
        description: 'Objetivo: educar sobre a solução e desconstruir crenças antigas. Tom: educativo, revelador, consultivo. Formato ideal: carrossel educativo, Reels 15–30s.',
    },
    {
        value: AwarenessLevel.SOLUTION_AWARE,
        label: 'Consciente da Solução',
        description: 'Objetivo: provar diferenciação e quebrar objeções. Tom: confiante, factual, evidencial. Formato ideal: cases, depoimentos, comparações, UGC.',
    },
    {
        value: AwarenessLevel.PRODUCT_AWARE,
        label: 'Consciente do Produto',
        description: 'Objetivo: criar urgência, facilitar decisão e remover último atrito. Tom: direto, urgente, facilitador. Formato ideal: Stories com swipe up, Reels com CTA direto.',
    },
    {
        value: AwarenessLevel.ULTRA_AWARE,
        label: 'Ultra Consciente',
        description: 'Objetivo: conversão imediata e remoção total de atrito. Tom: ultra direto, transacional. Formato ideal: Stories com link, Reels com um único CTA.',
    }
];

export const LANGUAGE_TYPE_OPTIONS: { value: LanguageType; label: string; description: string }[] = [
    {
        value: LanguageType.SENSORIAL,
        label: '⚙️ 1. Sensorial (Imersiva)',
        description: 'Uso: Despertar / Problem Aware. Objetivo: Fazer o público sentir antes de entender. Exemplo: “Você acorda cansado, o despertador grita, e parece que o corpo pesa o dobro.” Palavras-chave: cheiro, calor, peso, som, toque. Função: Cria sinestesia emocional, ativa empatia instantânea.',
    },
    {
        value: LanguageType.IDENTIFICATION,
        label: '💬 2. Identificação (Espelho)',
        description: 'Uso: Problem → Solution Aware. Objetivo: Fazer o leitor pensar “esse sou eu!”. Exemplo: “Se você sente que trabalha o dia todo e ainda assim o resultado nunca vem... bem-vindo ao clube.” Técnica: repetir expressões reais do público (“tô cansado”, “tentei de tudo”). Função: Reduz resistência e cria afinidade.',
    },
    {
        value: LanguageType.MECHANISM,
        label: '🧠 3. Mecanismo (Revelação)',
        description: 'Uso: Solution → Product Aware. Objetivo: Explicar por que nada funcionou antes e por que agora vai funcionar. Exemplo: “O problema nunca foi sua disciplina — foi o ciclo de cortisol desregulado.” Palavras-chave: mecanismo, gatilho, processo, sistema. Função: Dá ao público uma explicação lógica para acreditar.',
    },
    {
        value: LanguageType.CONTRAST,
        label: '🔥 4. Contraste (Choque)',
        description: 'Uso: Despertar / Educacional. Objetivo: Quebrar padrão e despertar curiosidade. Exemplo: “O erro mais caro que você comete não custa dinheiro — custa energia mental.” Estrutura: “Você acha que X... mas na verdade Y.” Função: Abre loops mentais, força atenção.',
    },
    {
        value: LanguageType.REVELATION,
        label: '🎤 5. Revelação (Confidencial)',
        description: 'Uso: Solution / Product Aware. Objetivo: Soar como insider, não vendedor. Exemplo: “Ninguém comenta isso, mas os profissionais que mais crescem fazem uma coisa em comum.” Técnica: tom de bastidor (“deixa eu te contar o que ninguém diz”). Função: Cria conexão e autoridade sutil.',
    },
    {
        value: LanguageType.STATUS,
        label: '💎 6. Status (Transformacional)',
        description: 'Uso: Product / Ultra Aware. Objetivo: Mostrar o “novo eu” que o produto entrega. Exemplo: “Não é sobre perder peso. É sobre entrar em qualquer sala e sentir que todos percebem sua presença.” Palavras-chave: finalmente, agora, poder, confiança, liberdade. Função: Move o público da lógica para o desejo.',
    },
    {
        value: LanguageType.DECISION,
        label: '⏳ 7. Decisão (Direta)',
        description: 'Uso: Ultra Aware / Urgência. Objetivo: Dar o empurrão final. Exemplo: “Clique e veja por dentro. Você vai entender em 20 segundos por que todos estão falando disso.” Curta, imperativa, sem adjetivos exagerados. Função: Gatilho de ação, fecha o ciclo.',
    },
    {
        value: LanguageType.STRUCTURED_CONVERSATIONAL,
        label: '🗣️ 8. Conversacional (Estruturada)',
        description: 'Objetivo: Fazer o espectador sentir que está ouvindo uma conversa, não um vendedor. Ideal para Mini VSLs, Reels e UGC. Combina um tom de orientação, frases curtas, vocabulário familiar e analogias do cotidiano. A chamada para ação (CTA) no final será sempre alinhada com o nível de consciência Andrômeda selecionado.',
    }
];