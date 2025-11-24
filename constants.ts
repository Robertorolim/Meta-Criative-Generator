
import { CreativeType, VoiceStyle, VoiceOption, AwarenessLevel, LanguageType, TargetGender } from './types';

export const CREATIVE_TYPE_OPTIONS: { value: CreativeType; label: string }[] = [
  { value: CreativeType.VIDEO_UGC, label: 'Vídeo UGC (Reels/Stories)' },
  { value: CreativeType.MINI_VSL, label: 'Mini VSL (40 segundos)' },
];

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
    'Clique em Saiba Mais',
    'Clique no botão abaixo',
    'Acesse o Link na Bio',
    'Comente "EU QUERO"',
    'Envie um Direct',
    'Inscreva-se Agora',
    'Garanta sua Vaga',
    'Compre Agora',
    'Compartilhe esse vídeo',
    'Salve para ver depois',
    'Outro (Personalizado)'
];

export const GENDER_OPTIONS: { value: TargetGender; label: string }[] = [
    { value: TargetGender.BOTH, label: 'Ambos / Unissex' },
    { value: TargetGender.FEMALE, label: 'Feminino' },
    { value: TargetGender.MALE, label: 'Masculino' },
];

export const AGE_OPTIONS: string[] = [
    '18-24 anos (Gen Z)',
    '25-34 anos (Jovens Adultos)',
    '35-44 anos (Adultos)',
    '45-54 anos (Meia Idade)',
    '55-64 anos (Seniores)',
    '65+ anos',
    'Todas as idades',
];

export const HOOK_OPTIONS_BY_AWARENESS: Record<AwarenessLevel, { value: string; label: string }[]> = {
  [AwarenessLevel.UNCONSCIOUS]: [
    { value: 'Padrão de Interrupção', label: '#1 Padrão de Interrupção' },
    { value: 'Estatística Chocante', label: '#2 Estatística Chocante' },
    { value: 'Revelação Silenciosa', label: '#3 Revelação Silenciosa' },
    { value: 'Comparação Temporal', label: '#4 Comparação Temporal' },
    { value: 'Pergunta Existencial', label: '#5 Pergunta Existencial' },
    { value: 'Observação Social', label: '#6 Observação Social' },
    { value: 'Inversão de Realidade', label: '#7 Inversão de Realidade' },
  ],
  [AwarenessLevel.PROBLEM_AWARE]: [
    { value: 'Causa Oculta', label: '#8 Causa Oculta' },
    { value: 'Desconstrução', label: '#9 Desconstrução' },
    { value: 'Ciclo Vicioso', label: '#10 Ciclo Vicioso' },
    { value: 'Revelação Progressiva', label: '#11 Revelação Progressiva' },
    { value: 'Erro Comum', label: '#12 Erro Comum' },
    { value: 'Teste de Auto-Diagnóstico', label: '#13 Teste de Auto-Diagnóstico' },
    { value: 'Linha do Tempo', label: '#14 Linha do Tempo' },
  ],
  [AwarenessLevel.SOLUTION_AWARE]: [
    { value: 'Diferenciação Direta', label: '#15 Diferenciação Direta' },
    { value: 'Prova Social Numérica', label: '#16 Prova Social Numérica' },
    { value: 'Objeção Antecipada', label: '#17 Objeção Antecipada' },
    { value: 'Comparação Lado a Lado', label: '#18 Comparação Lado a Lado' },
    { value: 'Antes e Depois Emocional', label: '#19 Antes e Depois Emocional' },
    { value: 'Autoridade por Associação', label: '#20 Autoridade por Associação' },
    { value: 'Garantia Inversa', label: '#21 Garantia Inversa' },
  ],
  [AwarenessLevel.PRODUCT_AWARE]: [
    { value: 'Escassez Real', label: '#22 Escassez Real' },
    { value: 'Facilitação Extrema', label: '#23 Facilitação Extrema' },
    { value: 'Custo de Oportunidade', label: '#24 Custo de Oportunidade' },
    { value: 'Bônus com Prazo', label: '#25 Bônus com Prazo' },
    { value: 'Próximo Passo Óbvio', label: '#26 Próximo Passo Óbvio' },
    { value: 'Comparação de Investimento', label: '#27 Comparação de Investimento' },
    { value: 'Deadline Emocional', label: '#28 Deadline Emocional' },
  ],
  [AwarenessLevel.ULTRA_AWARE]: [
    { value: 'Acesso Imediato', label: '#29 Acesso Imediato' },
    { value: 'Demonstração em Tempo Real', label: '#30 Demonstração em Tempo Real' },
    { value: 'Chamada Direta', label: '#31 Chamada Direta' },
    { value: 'Resultado Garantido', label: '#32 Resultado Garantido' },
  ],
};


export const VOICE_STYLE_OPTIONS: { value: VoiceStyle; label: string }[] = [
    { value: VoiceStyle.ENTHUSIASTIC, label: 'Entusiasmado/Energético' },
    { value: VoiceStyle.CALM, label: 'Calmo/Confiante' },
    { value: VoiceStyle.PROFESSIONAL, label: 'Profissional/Explicativo' },
    { value: VoiceStyle.EMPATHETIC, label: 'Empático/Conversacional' },
    { value: VoiceStyle.NARRATIVE, label: 'Narrativo/Contação de Histórias' },
];

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
        label: 'Nível 1: Inconsciente',
        description: 'Objetivo: Despertar consciência do problema sem vender. Tom: Intrigante, provocativo, misterioso. Formato: Reels curtos (7-15s), Stories.',
    },
    {
        value: AwarenessLevel.PROBLEM_AWARE,
        label: 'Nível 2: Consciente do Problema',
        description: 'Objetivo: Educar sobre solução + desconstruir crenças. Tom: Educativo, revelador, consultivo. Formato: Carrossel educativo, Reels 15-30s.',
    },
    {
        value: AwarenessLevel.SOLUTION_AWARE,
        label: 'Nível 3: Consciente da Solução',
        description: 'Objetivo: Provar diferenciação + quebrar objeções. Tom: Confiante, factual, baseado em evidências. Formato: Cases, depoimentos, comparações.',
    },
    {
        value: AwarenessLevel.PRODUCT_AWARE,
        label: 'Nível 4: Consciente do Produto',
        description: 'Objetivo: Criar urgência + facilitar decisão. Tom: Direto, urgente, facilitador. Formato: Stories swipe up, Reels CTA direto.',
    },
    {
        value: AwarenessLevel.ULTRA_AWARE,
        label: 'Nível 5: Ultra Consciente',
        description: 'Objetivo: Conversão imediata + remoção de atrito. Tom: Ultra direto, transacional. Formato: Link direto, "Clique agora".',
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
    }
];
