export enum CreativeType {
  UGC_VIDEO = 'Vídeo UGC (Narração)',
  MINI_VSL = 'Mini VSL (Narração)',
  IMAGE_FEED = 'Imagem para Feed (com Geração de Imagem)',
  IMAGE_STORIES = 'Imagem para Stories (com Geração de Imagem)',
  CAROUSEL = 'Carrossel (com Geração de Imagem)',
}

export type ImageSize = '1:1' | '4:5' | '9:16';

export interface GeneratedContent {
  text: string;
  imageUrl: string | null;
}

export enum VoiceStyle {
  EDUCATIONAL = 'Educacional/Explicativo',
  PROMOTIONAL = 'Promocional/Publicitário',
  NARRATIVE = 'Narrativo/Contação de Histórias',
  RELAXING = 'Relaxante/Meditativo',
  JOURNALISTIC = 'Notícias/Jornalístico',
}