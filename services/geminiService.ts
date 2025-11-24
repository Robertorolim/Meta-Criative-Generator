
import { GoogleGenAI, Type } from "@google/genai";
import { CreativeType, GeneratedContent, VoiceStyle, VoiceOption, AwarenessLevel, LanguageType, TargetGender } from '../types';

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- BASE INSTRUCTIONS BY LEVEL ---
const getAwarenessLevelInstructions = (awarenessLevel: AwarenessLevel): string => {
    switch (awarenessLevel) {
        case AwarenessLevel.UNCONSCIOUS:
            return `
**Nível 1: Inconsciente**
- **Objetivo:** Despertar consciência do problema sem vender nada.
- **Tom:** Intrigante, provocativo, misterioso.
- **Formato Ideal:** Reels curtos (7-15s), Stories, Headlines indiretas.
`;
        case AwarenessLevel.PROBLEM_AWARE:
            return `
**Nível 2: Consciente do Problema**
- **Objetivo:** Educar sobre solução + desconstruir crenças antigas.
- **Tom:** Educativo, revelador, consultivo.
- **Formato Ideal:** Carrossel educativo, Reels 15-30s, Copy longa.
`;
        case AwarenessLevel.SOLUTION_AWARE:
            return `
**Nível 3: Consciente da Solução**
- **Objetivo:** Provar diferenciação + quebrar objeções.
- **Tom:** Confiante, factual, baseado em evidências.
- **Formato Ideal:** Cases, depoimentos, comparações, UGC.
`;
        case AwarenessLevel.PRODUCT_AWARE:
            return `
**Nível 4: Consciente do Produto**
- **Objetivo:** Criar urgência + facilitar decisão + remover último atrito.
- **Tom:** Direto, urgente, facilitador.
- **Formato Ideal:** Stories com swipe up, Reels com CTA direto, Carrossel de oferta.
`;
        case AwarenessLevel.ULTRA_AWARE:
            return `
**Nível 5: Ultra Consciente**
- **Objetivo:** Conversão imediata + remoção total de atrito.
- **Tom:** Ultra direto, sem enrolação, transacional.
- **Formato Ideal:** Stories com link, Reels com CTA único, Anúncio direto.
`;
        default:
            return '';
    }
};

// --- HOOK SPECIFIC TEMPLATES ---
const HOOK_TEMPLATES: Record<string, string> = {
    // Nível 1
    'Padrão de Interrupção': `
    - **Fórmula:** "Você se lembra de quem você era antes de [situação atual]?"
    - **Quando usar:** Produtos de transformação pessoal, emagrecimento, carreira.
    - **Por que funciona:** Cria nostalgia emocional sem mencionar o problema diretamente.
    `,
    'Estatística Chocante': `
    - **Fórmula:** "[X]% das pessoas fazem [ação] sem saber que isso causa [consequência oculta]"
    - **Quando usar:** Nicho saúde, finanças, tecnologia.
    - **Por que funciona:** Gera curiosidade + medo de estar fazendo errado.
    `,
    'Revelação Silenciosa': `
    - **Fórmula:** "Existe algo que ninguém te conta sobre [área da vida]..."
    - **Quando usar:** Qualquer nicho com informação privilegiada.
    - **Por que funciona:** Desperta sensação de estar perdendo informação importante.
    `,
    'Comparação Temporal': `
    - **Fórmula:** "[Área] era assim há 5 anos. Hoje é completamente diferente. E você ainda está preso no passado."
    - **Quando usar:** Mercados em rápida evolução (marketing digital, tecnologia).
    - **Por que funciona:** Cria urgência + medo de ficar para trás.
    `,
    'Pergunta Existencial': `
    - **Fórmula:** "Se você pudesse voltar [X anos] atrás, o que você mudaria?"
    - **Quando usar:** Produtos de desenvolvimento pessoal, finanças, saúde.
    - **Por que funciona:** Força reflexão sobre arrependimentos sem ser agressivo.
    `,
    'Observação Social': `
    - **Fórmula:** "Repare nas pessoas ao seu redor. O que elas têm em comum?"
    - **Quando usar:** Quando quer fazer o público observar padrões sociais.
    - **Por que funciona:** Ativa observação + comparação social automática.
    `,
    'Inversão de Realidade': `
    - **Fórmula:** "E se eu te dissesse que [crença comum] é exatamente o oposto do que você deveria fazer?"
    - **Quando usar:** Quando sua solução contradiz senso comum.
    - **Por que funciona:** Quebra padrão mental + gera curiosidade extrema.
    `,

    // Nível 2
    'Causa Oculta': `
    - **Fórmula:** "A verdadeira causa de [problema] não é o que você pensa. É [causa real]."
    - **Quando usar:** Quando precisa redirecionar compreensão do problema.
    - **Por que funciona:** Alivia culpa + apresenta novo vilão (que você resolve).
    `,
    'Desconstrução': `
    - **Fórmula:** "Por que [solução antiga] não funciona mais (e o que fazer agora)"
    - **Quando usar:** Mercados saturados com soluções antigas.
    - **Por que funciona:** Invalida competição + posiciona você como atualizado.
    `,
    'Ciclo Vicioso': `
    - **Fórmula:** "Você tenta [ação], mas piora [problema]. Aí tenta de novo, e piora mais. O ciclo nunca acaba."
    - **Quando usar:** Quando o problema se auto-perpetua.
    - **Por que funciona:** Explica frustração + justifica necessidade de nova abordagem.
    `,
    'Revelação Progressiva': `
    - **Fórmula:** "3 sinais de que [problema] está piorando (mesmo você sem perceber)"
    - **Quando usar:** Quando quer intensificar urgência do problema.
    - **Por que funciona:** Lista = estrutura fácil + promessa de diagnóstico.
    `,
    'Erro Comum': `
    - **Fórmula:** "O erro que 90% comete ao tentar resolver [problema] (e como evitar)"
    - **Quando usar:** Quando existe erro frequente e previsível.
    - **Por que funciona:** Estatística alta = "não sou só eu" + promessa de atalho.
    `,
    'Teste de Auto-Diagnóstico': `
    - **Fórmula:** "Faça este teste: Você tem [problema específico]?"
    - **Quando usar:** Para engajar interativamente o público.
    - **Por que funciona:** Interatividade + medo de ter algo não diagnosticado.
    `,
    'Linha do Tempo': `
    - **Fórmula:** "Semana 1: [sintoma]. Semana 4: [piora]. Mês 6: [colapso]. Reconhece esse padrão?"
    - **Quando usar:** Problemas que pioram progressivamente.
    - **Por que funciona:** Mostra progressão + cria senso de urgência temporal.
    `,

    // Nível 3
    'Diferenciação Direta': `
    - **Fórmula:** "A diferença entre [solução genérica] e [sua solução]: [diferencial único]"
    - **Quando usar:** Quando tem diferencial claro e tangível.
    - **Por que funciona:** Comparação direta = fácil de processar.
    `,
    'Prova Social Numérica': `
    - **Fórmula:** "[Nome] conseguiu [resultado específico] em [tempo]. Veja como."
    - **Quando usar:** Quando tem cases com resultados mensuráveis.
    - **Por que funciona:** Resultado concreto + pessoa real = crível.
    `,
    'Objeção Antecipada': `
    - **Fórmula:** "'Mas [objeção comum]' — é exatamente por isso que funciona."
    - **Quando usar:** Quando sabe a principal objeção do mercado.
    - **Por que funciona:** Transforma objeção em vantagem = quebra padrão.
    `,
    'Comparação Lado a Lado': `
    - **Fórmula:** "[Método A]: [resultado ruim]. [Seu método]: [resultado bom]. A escolha é sua."
    - **Quando usar:** Quando seu método tem vantagem clara.
    - **Por que funciona:** Contraste visual + sensação de controle (escolha).
    `,
    'Antes e Depois Emocional': `
    - **Fórmula:** "Antes: [estado emocional ruim]. Depois: [transformação emocional]. O que mudou?"
    - **Quando usar:** Quando transformação emocional é tão importante quanto física.
    - **Por que funciona:** Emoção > número em muitos nichos.
    `,
    'Autoridade por Associação': `
    - **Fórmula:** "O mesmo método usado por [autoridade/instituição reconhecida]"
    - **Quando usar:** Quando seu método tem respaldo científico/profissional.
    - **Por que funciona:** Empresta credibilidade de fonte confiável.
    `,
    'Garantia Inversa': `
    - **Fórmula:** "Se você NÃO conseguir [resultado] em [prazo], eu [comprometimento extremo]"
    - **Quando usar:** Quando tem alta confiança no método.
    - **Por que funciona:** Inverte risco completamente = quebra última objeção.
    `,

    // Nível 4
    'Escassez Real': `
    - **Fórmula:** "[Número] vagas restantes. Depois disso, só em [data futura]."
    - **Quando usar:** Quando tem limitação real (turma, estoque, tempo).
    - **Por que funciona:** Escassez legítima = urgência sem desconfiança.
    `,
    'Facilitação Extrema': `
    - **Fórmula:** "3 cliques. 2 minutos. Você começa hoje."
    - **Quando usar:** Quando processo de compra/início é simples.
    - **Por que funciona:** Remove objeção de "é complicado demais".
    `,
    'Custo de Oportunidade': `
    - **Fórmula:** "Cada dia que você adia = [perda concreta que se acumula]"
    - **Quando usar:** Quando adiar tem custo mensurável.
    - **Por que funciona:** Visualiza perda contínua = dor de não agir.
    `,
    'Bônus com Prazo': `
    - **Fórmula:** "Entre hoje e ganhe [bônus específico]. Amanhã, volta ao normal."
    - **Quando usar:** Quando tem bônus legítimo de tempo limitado.
    - **Por que funciona:** Incentivo positivo + prazo claro.
    `,
    'Próximo Passo Óbvio': `
    - **Fórmula:** "Você já sabe que precisa. Agora é só [ação simples]."
    - **Quando usar:** Para público que já demonstrou interesse.
    - **Por que funciona:** Elimina necessidade de re-convencer.
    `,
    'Comparação de Investimento': `
    - **Fórmula:** "[Preço] ÷ [dias/meses] = menos que [comparação diária]"
    - **Quando usar:** Quando preço parece alto à primeira vista.
    - **Por que funciona:** Fracionamento = preço parece insignificante.
    `,
    'Deadline Emocional': `
    - **Fórmula:** "Daqui a [prazo], você vai estar [estado futuro]. A pergunta é: onde?"
    - **Quando usar:** Para criar senso de urgência temporal.
    - **Por que funciona:** Projeta futuro + força escolha consciente.
    `,

    // Nível 5
    'Acesso Imediato': `
    - **Fórmula:** "Clique. Pague. Comece agora."
    - **Quando usar:** Remarketing, público ultra quente.
    - **Por que funciona:** Zero enrolação = respeita quem já decidiu.
    `,
    'Demonstração em Tempo Real': `
    - **Fórmula:** "Veja funcionando em 60 segundos [DEMO AO VIVO]"
    - **Quando usar:** Produtos digitais com demo/preview possível.
    - **Por que funciona:** Prova visual instantânea = última objeção eliminada.
    `,
    'Chamada Direta': `
    - **Fórmula:** "Link na bio. Clique agora."
    - **Quando usar:** Stories, posts de conversão direta.
    - **Por que funciona:** Comando claro = remove dúvida sobre o que fazer.
    `,
    'Resultado Garantido': `
    - **Fórmula:** "Comece hoje. Resultado em [prazo]. Ou dinheiro de volta."
    - **Quando usar:** Quando tem garantia forte.
    - **Por que funciona:** Tríade: ação + prazo + segurança.
    `,
};

const getLanguageTypeInstructions = (languageType: LanguageType): string => {
    switch (languageType) {
        case LanguageType.SENSORIAL:
            return `**Estilo de Linguagem: Sensorial (Imersiva)**. Use palavras que evocam os 5 sentidos. Exemplo: "Você acorda cansado, o despertador grita, e parece que o corpo pesa o dobro."`;
        case LanguageType.IDENTIFICATION:
            return `**Estilo de Linguagem: Identificação (Espelho)**. Use frases como "Se você sente que...", "Bem-vindo ao clube dos que...".`;
        case LanguageType.MECHANISM:
            return `**Estilo de Linguagem: Mecanismo (Autoridade)**. Use palavras como: mecanismo, gatilho, processo, sistema.`;
        case LanguageType.CONTRAST:
            return `**Estilo de Linguagem: Contraste (Choque)**. Estrutura: "Você acha que X... mas na verdade é Y."`;
        case LanguageType.REVELATION:
            return `**Estilo de Linguagem: Revelação (Confidencial)**. Adote um tom de "deixa eu te contar um segredo".`;
        case LanguageType.STATUS:
            return `**Estilo de Linguagem: Status (Transformacional)**. Fale sobre sentimentos de poder, confiança, liberdade.`;
        case LanguageType.DECISION:
            return `**Estilo de Linguagem: Decisão (Direta)**. Seja direto, claro e imperativo. Sem adjetivos exagerados.`;
        default:
            return '';
    }
};

const getPrompt = (niche: string, targetGender: TargetGender, targetAge: string, awarenessLevel: AwarenessLevel, creativeType: CreativeType, productDetails: string, hook: string, languageType: LanguageType, specificCTA: string): string => {
  const awarenessInstructions = getAwarenessLevelInstructions(awarenessLevel);
  const languageInstructions = getLanguageTypeInstructions(languageType);
  const hookDetails = HOOK_TEMPLATES[hook] || `Gancho: ${hook}`;
  
  const basePrompt = `
    Você é um copywriter de elite e diretor de arte para Meta Ads (Projeto Andrômeda).
    
    **DADOS DEMOGRÁFICOS (CRÍTICO):**
    - **Nicho:** ${niche}
    - **Gênero do Alvo:** ${targetGender}. (Adapte pronomes, gírias e dores especificamente para ${targetGender}).
    - **Faixa Etária:** ${targetAge}. (Use vocabulário adequado para esta idade).
    
    **CONTEXTO:**
    - **Nível de Consciência:** ${awarenessLevel}
    - **Linguagem:** ${languageType}
    - **Produto:** ${productDetails || 'Genérico'}
    
    ${awarenessInstructions}
    ${languageInstructions}

    **ESTRATÉGIA DE GANCHO ESCOLHIDA (${hook}):**
    ${hookDetails}
    
    **IMPORTANTE:** Utilize a fórmula do gancho acima EXATAMENTE como descrita, adaptando apenas para o nicho e produto. Respeite o "Por que funciona".

    **REGRAS:**
    1. Foco total no Nível de Consciência.
    2. Sem "Antes e Depois" direto (evite bloqueios).
    3. Sem texto introdutório. Retorne APENAS o JSON.
  `;

  // VIDEO UGC / MINI VSL
  return `${basePrompt}
    **Tarefa:** Criar roteiro de vídeo (${creativeType}).
    
    **ESTRUTURA A.I.M.E. OBRIGATÓRIA:**
    Use as tags [A], [I], [M], [E] no início de cada parágrafo de texto.
    - [A] Awaken: Gancho "${hook}" (Use a fórmula acima).
    - [I] Inform: Problema/Dor.
    - [M] Mechanism: Solução/Mecanismo.
    - [E] Evoke: Emoção + CTA.
      * TEXTO DA NARRAÇÃO (FALADO): Use EXATAMENTE esta frase: "${specificCTA}"
      * VISUAL (DESCRIÇÃO): OBRIGATÓRIO incluir entre parênteses uma descrição visual para o encerramento (Ex: Logo animada, Produto em close, Dedo clicando no botão, Swipe Up).

    **Saída:** JSON estrito com campo "text". O texto deve conter as tags [A]... e descrições visuais entre parênteses.
    Exemplo de formato de string no JSON: "[A] Texto do gancho... (visual sugerido) \n\n ... [E] ${specificCTA} (Visual final impactante)"
  `;
};

export const generateCreative = async (
  niche: string,
  targetGender: TargetGender,
  targetAge: string,
  awarenessLevel: AwarenessLevel,
  creativeType: CreativeType,
  productDetails: string,
  hook: string,
  languageType: LanguageType,
  cta: string
): Promise<GeneratedContent> => {
  
  const prompt = getPrompt(niche, targetGender, targetAge, awarenessLevel, creativeType, productDetails, hook, languageType, cta);
  
  const parts: any[] = [{ text: prompt }];

  try {
      const response = await genAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts },
          config: {
              responseMimeType: 'application/json',
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      text: { type: Type.STRING, description: "O roteiro completo no formato A.I.M.E." },
                  }
              }
          }
      });

      const jsonText = response.text;
      if (!jsonText) throw new Error("Resposta vazia da IA");
      
      return JSON.parse(jsonText) as GeneratedContent;

  } catch (error: any) {
      console.error("Erro Gemini:", error);
      throw new Error(`Falha na geração: ${error.message}`);
  }
};

export const generateCreativeVariation = async (
    niche: string,
    targetGender: TargetGender,
    targetAge: string,
    awarenessLevel: AwarenessLevel,
    creativeType: CreativeType,
    productDetails: string,
    hook: string,
    languageType: LanguageType,
    originalText: string,
    cta: string
): Promise<string> => {
    const hookDetails = HOOK_TEMPLATES[hook] || `Gancho: ${hook}`;
    const prompt = `
    ATUE COMO COPYWRITER SENIOR.
    
    CONTEXTO:
    Você gerou este criativo para o nicho ${niche}, gênero ${targetGender}, idade ${targetAge}:
    "${originalText}"
    
    GANCHO OBRIGATÓRIO:
    ${hookDetails}

    CTA OBRIGATÓRIA:
    "${cta}"
    
    TAREFA:
    Crie uma VARIAÇÃO deste criativo. Mantenha a estrutura A.I.M.E. e a ESTRUTURA DO GANCHO acima, mas mude a abordagem criativa, o tom ou os exemplos.
    
    REGRAS PARA SEÇÃO [E] EVOKE:
    1. Texto falado: Deve ser EXATAMENTE: "${cta}".
    2. Visual: DEVE incluir uma descrição visual entre parênteses (ex: Logo, Seta apontando, etc).
    
    FORMATO:
    Retorne APENAS um JSON com a propriedade "text" contendo o novo roteiro/texto.
    `;

    try {
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });
        const json = JSON.parse(response.text || '{}');
        return json.text || "Erro ao gerar variação.";
    } catch (error) {
        throw new Error("Erro ao variar criativo.");
    }
};

// --- AUDIO GENERATION & WAV CONVERSION HELPERS ---

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeWAV(samples: Int16Array, sampleRate: number = 24000, numChannels: number = 1): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 2 * numChannels, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  // Write PCM samples
  for (let i = 0; i < samples.length; i++) {
    view.setInt16(44 + i * 2, samples[i], true);
  }

  return buffer;
}

export const generateAudio = async (text: string, voiceName: string, voiceStyle: VoiceStyle, styleHint?: VoiceOption['styleHint']): Promise<string> => {
    // 1. Limpeza rigorosa do texto para o modelo de áudio
    const cleanText = text
        .replace(/\[[A-Z]\]/g, '')    // Remove tags [A], [I], [M], [E]
        .replace(/\([^)]*\)/g, '')    // Remove sugestões visuais entre parênteses (ex: imagem de...)
        .replace(/\*\*/g, '')         // Remove negrito Markdown
        .replace(/\*/g, '')           // Remove itálico Markdown
        .replace(/#/g, '')            // Remove headers
        .replace(/\s+/g, ' ')         // Remove espaços duplos
        .trim();

    if (!cleanText) throw new Error("Texto para áudio está vazio.");

    // 2. Engenharia de Prompt para Estilo (Critical for TTS)
    // O modelo espera instruções de estilo antes do texto.
    let styleInstruction = "";
    if (styleHint) {
        styleInstruction = `Say in a ${styleHint} tone: `;
    } else {
        // Fallback baseado no enum
        switch (voiceStyle) {
            case VoiceStyle.ENTHUSIASTIC: styleInstruction = "Say energetically: "; break;
            case VoiceStyle.CALM: styleInstruction = "Say calmly: "; break;
            case VoiceStyle.PROFESSIONAL: styleInstruction = "Say professionally: "; break;
            case VoiceStyle.EMPATHETIC: styleInstruction = "Say with empathy: "; break;
            case VoiceStyle.NARRATIVE: styleInstruction = "Narrate clearly: "; break;
        }
    }

    const finalPrompt = `${styleInstruction}"${cleanText}"`;

    try {
        // 3. Chamada ao Modelo TTS
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts', // Modelo correto
            contents: {
                parts: [{ text: finalPrompt }]
            },
            config: {
                responseModalities: ['AUDIO'], // Obrigatório ser array de string
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: voiceName
                        }
                    }
                }
            }
        });

        const audioPart = response.candidates?.[0]?.content?.parts?.[0];
        
        if (!audioPart || !audioPart.inlineData || !audioPart.inlineData.data) {
             throw new Error("Nenhum dado de áudio retornado pela API.");
        }

        // 4. Decodificação e Encapsulamento WAV
        const base64String = audioPart.inlineData.data;
        const binaryString = atob(base64String);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // O Gemini retorna PCM 24kHz 16-bit mono (normalmente)
        // Precisamos converter raw PCM para Int16Array para o cabeçalho WAV
        const pcmData = new Int16Array(bytes.buffer);
        
        const wavBuffer = encodeWAV(pcmData, 24000, 1); // Adiciona cabeçalho WAV
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        
        return URL.createObjectURL(blob);

    } catch (error: any) {
        console.error("Erro na geração de áudio:", error);
        throw new Error("Falha ao gerar áudio. Verifique se o texto não é muito longo ou contém caracteres inválidos.");
    }
};
