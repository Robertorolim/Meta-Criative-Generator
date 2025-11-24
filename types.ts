
export enum CreativeType {
  VIDEO_UGC = 'Vídeo UGC (Reels/Stories)',
  MINI_VSL = 'Mini VSL (40 segundos)',
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

export enum TargetGender {
  MALE = 'Masculino',
  FEMALE = 'Feminino',
  BOTH = 'Ambos / Unissex',
}

export interface GeneratedContent {
  text: string;
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
