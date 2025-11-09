import { CreativeType, ImageSize, VoiceStyle } from './types';

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
  'Ver como funciona',
  'Quero saber mais',
  'Assista a demonstração',
  'Entenda o método',
  'Descubra o segredo',
  'Acompanhe a história',
  'Toque para continuar',
  'Clique no link agora',
];

export const VOICE_STYLE_OPTIONS: { value: VoiceStyle; label: string }[] = [
    { value: VoiceStyle.PROMOTIONAL, label: 'Promocional/Publicitário' },
    { value: VoiceStyle.EDUCATIONAL, label: 'Educacional/Explicativo' },
    { value: VoiceStyle.NARRATIVE, label: 'Narrativo/Contação de Histórias' },
    { value: VoiceStyle.RELAXING, label: 'Relaxante/Meditativo' },
    { value: VoiceStyle.JOURNALISTIC, label: 'Notícias/Jornalístico' },
];

// Lista de vozes revisada e organizada, usando vozes oficiais do Gemini para garantir compatibilidade e gênero correto.
const femaleVoices: { name: string; apiName: string, gender: 'male' | 'female' }[] = [
    { name: 'Kore - Clara e calma, ideal para narrações', apiName: 'Kore', gender: 'female' },
];

const maleVoices: { name: string; apiName: string, gender: 'male' | 'female' }[] = [
    { name: 'Zephyr - Amigável e confiável, versátil', apiName: 'Zephyr', gender: 'male' },
    { name: 'Puck - Jovem e dinâmico, ótimo para anúncios', apiName: 'Puck', gender: 'male' },
    { name: 'Charon - Profunda e séria, ideal para documentários', apiName: 'Charon', gender: 'male' },
    { name: 'Fenrir - Forte e assertiva, para mensagens de impacto', apiName: 'Fenrir', gender: 'male' },
];


export const VOICE_OPTIONS: { name: string; apiName: string, gender: 'male' | 'female' }[] = [
  ...femaleVoices,
  ...maleVoices,
];