export enum CreativeType {
  UGC_VIDEO = 'Vídeo UGC (Narração)',
  MINI_VSL = 'Mini VSL (Narração)',
  IMAGE_FEED = 'Imagem para Feed (com Geração de Imagem)',
  IMAGE_STORIES = 'Imagem para Stories (com Geração de Imagem)',
  CAROUSEL = 'Carrossel (com Geração de Imagem)',
}

export enum AwarenessLevel {
  UNCONSCIOUS = 'Inconsciente',
  PROBLEM_AWARE = 'Consciente do Problema',
  SOLUTION_AWARE = 'Consciente da Solução',
  PRODUCT_AWARE = 'Consciente do Produto',
  MOST_AWARE = 'Consciente Total',
}

export type ImageSize = '1:1' | '4:5' | '9:16';

export interface CarouselSlide {
  text: string;
  imageUrl: string;
}

export interface GeneratedContent {
  text: string;
  imageUrl: string | null;
  carouselSlides?: CarouselSlide[];
}

export enum VoiceStyle {
  ENTHUSIASTIC = 'Entusiasmado/Energético',
  CALM = 'Calmo/Confiante',
  PROFESSIONAL = 'Profissional/Explicativo',
  EMPATHETIC = 'Empático/Conversacional',
  NARRATIVE = 'Narrativo/Contação de Histórias',
}

export interface VoiceOption {
  name: string;
  apiName: string;
  gender: 'male' | 'female';
  styleHint?: 'calm' | 'energetic' | 'friendly';
}