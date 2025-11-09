import { CreativeType, ImageSize, VoiceStyle, VoiceOption, AwarenessLevel } from './types';

export const CREATIVE_TYPE_OPTIONS: { value: CreativeType; label: string }[] = [
  { value: CreativeType.UGC_VIDEO, label: 'Vídeo UGC (Narração)' },
  { value: CreativeType.MINI_VSL, label: 'Mini VSL (Narração)' },
  { value: CreativeType.IMAGE_FEED, label: 'Imagem para Feed (Gera Imagem)' },
  { value: CreativeType.IMAGE_STORIES, label: 'Imagem para Stories (Gera Imagem)' },
  { value: CreativeType.CAROUSEL, label: 'Carrossel de Imagens (Gera Imagem)' },
];

export const IMAGE_SIZE_OPTIONS: Record<CreativeType, { value: ImageSize; label: string }[]> = {
    [CreativeType.IMAGE_FEED]: [
        { value: '1:1', label: 'Quadrado (1:1)' },
        { value: '4:5', label: 'Vertical (4:5)' },
    ],
    [CreativeType.IMAGE_STORIES]: [
        { value: '9:16', label: 'Stories (9:16)' },
    ],
    [CreativeType.CAROUSEL]: [
        { value: '1:1', label: 'Quadrado (1:1)' },
    ],
    [CreativeType.UGC_VIDEO]: [],
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

export const CTA_OPTIONS: string[] = [
  'Descubra como funciona',
  'Veja o que acontece quando seu corpo reage',
  'Entenda o mecanismo natural',
  'Saiba o que realmente bloqueia seus resultados',
  'Assista à demonstração detalhada',
  'Conheça o segredo por trás do método',
  'Acompanhe o passo a passo completo',
  'Toque para ver a explicação',
  'Desvende o protocolo por dentro',
  'Clique para entender a lógica',
  'Veja como o método funciona na prática',
  'Descubra o erro que todos cometem',
];

export const VOICE_STYLE_OPTIONS: { value: VoiceStyle; label: string }[] = [
    { value: VoiceStyle.ENTHUSIASTIC, label: 'Entusiasmado/Energético' },
    { value: VoiceStyle.CALM, label: 'Calmo/Confiante' },
    { value: VoiceStyle.PROFESSIONAL, label: 'Profissional/Explicativo' },
    { value: VoiceStyle.EMPATHETIC, label: 'Empático/Conversacional' },
    { value: VoiceStyle.NARRATIVE, label: 'Narrativo/Contação de Histórias' },
];

// Lista de vozes revisada e organizada, usando vozes oficiais do Gemini para garantir compatibilidade e gênero correto.
const femaleVoices: VoiceOption[] = [
    { name: 'Kore - Clara e calma', apiName: 'Kore', gender: 'female', styleHint: 'calm' },
    { name: 'Kore - Animada e enérgica', apiName: 'Kore', gender: 'female', styleHint: 'energetic' },
    { name: 'Kore - Amigável e conversacional', apiName: 'Kore', gender: 'female', styleHint: 'friendly' },
];

const maleVoices: VoiceOption[] = [
    { name: 'Zephyr - Amigável e confiável, versátil', apiName: 'Zephyr', gender: 'male' },
    { name: 'Puck - Jovem e dinâmico, ótimo para anúncios', apiName: 'Puck', gender: 'male' },
    { name: 'Charon - Profunda e séria, ideal para documentários', apiName: 'Charon', gender: 'male' },
    { name: 'Fenrir - Forte e assertiva, para mensagens de impacto', apiName: 'Fenrir', gender: 'male' },
];


export const VOICE_OPTIONS: VoiceOption[] = [
  ...femaleVoices,
  ...maleVoices,
];

export const AWARENESS_LEVEL_OPTIONS: { value: AwarenessLevel; label: string; description: string }[] = [
    {
        value: AwarenessLevel.UNCONSCIOUS,
        label: 'Inconsciente',
        description: 'Foco em DESPERTAR o problema. Usar histórias, curiosidade e ganchos fortes. Não falar do produto ou solução diretamente.',
    },
    {
        value: AwarenessLevel.PROBLEM_AWARE,
        label: 'Consciente do Problema',
        description: 'Foco em AGITAR a dor. Mostrar empatia, aprofundar as consequências do problema e explicar o "porquê" dele existir.',
    },
    {
        value: AwarenessLevel.SOLUTION_AWARE,
        label: 'Consciente da Solução',
        description: 'Apresentar seu produto como um MECANISMO ÚNICO e uma nova oportunidade. Mostrar como ele resolve o problema de forma diferente.',
    },
    {
        value: AwarenessLevel.PRODUCT_AWARE,
        label: 'Consciente do Produto',
        description: 'Foco em quebrar OBJEÇÕES. Usar prova social, reforçar benefícios e criar um senso de urgência para convencer quem já conhece o produto.',
    },
    {
        value: AwarenessLevel.MOST_AWARE,
        label: 'Consciente Total',
        description: 'Fazer uma OFERTA DIRETA e irresistível. Para público que já confia no produto e só precisa de um bom motivo para comprar agora.',
    }
];