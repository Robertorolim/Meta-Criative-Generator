export enum CreativeType {
  VIDEO_UGC = 'Vídeo UGC (Reels/Stories)',
  MINI_VSL = 'Mini VSL (40 segundos)',
  IMAGEM_UNICA = 'Imagem Única (Feed/Stories)',
  CARROSSEL = 'Carrossel (Educativo/Oferta)',
}

export enum AwarenessLevel {
  UNCONSCIOUS = 'Inconsciente',
  PROBLEM_AWARE = 'Consciente do Problema',
  SOLUTION_AWARE = 'Consciente da Solução',
  PRODUCT_AWARE = 'Consciente do Produto',
  ULTRA_AWARE = 'Ultra Consciente',
}

export enum LanguageType {
  SENSORIAL = 'LINGUAGEM SENSORIAL (Imersiva)',
  IDENTIFICATION = 'LINGUAGEM DE IDENTIFICAÇÃO (Espelho)',
  MECHANISM = 'LINGUAGEM DE MECANISMO (Autoridade + Revelação)',
  CONTRAST = 'LINGUAGEM DE CONTRASTE (Choque Controlado)',
  REVELATION = 'LINGUAGEM DE REVELAÇÃO (Confidencial)',
  STATUS = 'LINGUAGEM DE STATUS (Transformacional)',
  DECISION = 'LINGUAGEM DE DECISÃO (Direta, Rápida, Sem Ruído)',
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