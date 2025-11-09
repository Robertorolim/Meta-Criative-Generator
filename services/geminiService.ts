import { GoogleGenAI, Modality, Type } from "@google/genai";
import { CreativeType, ImageSize, GeneratedContent, VoiceStyle } from '../types';

const getPrompt = (niche: string, creativeType: CreativeType, productDetails: string, callToAction: string, imageSize: ImageSize): string => {
  const basePrompt = `
    Você é um especialista em copywriting e direção de arte para Meta Ads, treinado nas mais recentes diretrizes do "Projeto Andrômeda". Sua tarefa é criar todos os componentes para um criativo de anúncio.

    **Nicho do Cliente:** ${niche}
    **Detalhes do Produto/Oferta:** ${productDetails || 'Não especificado.'}
    **Chamada para Ação (CTA) Sugerida:** ${callToAction || 'Clique em "Saiba Mais"'}
    **Tipo de Criativo:** ${creativeType}

    **Diretrizes Essenciais (Projeto Andrômeda - NÃO IGNORE):**
    1.  **Foco no Processo:** Mostre o "como", não apenas o "o quê". Evite promessas exageradas. Prefira "Descobri um método que restaurou meu metabolismo...".
    2.  **Estrutura A.I.M.E. (para o texto do anúncio):** Awaken (Despertar), Inform (Informar), Mechanism (Mecanismo), Evoke (Evocar).
    3.  **Equilíbrio:** 40% Racional/Mecanismo, 40% Emocional/História, 20% Comercial/CTA.
    4.  **Proibido Atributos Pessoais:** Não use "Você que...". Fale em primeira pessoa.
    5.  **Sem "Antes e Depois" Direto:** Evite promessas absolutas.

    **Tarefa:**
  `;

  switch (creativeType) {
    case CreativeType.UGC_VIDEO:
    case CreativeType.MINI_VSL:
      return `${basePrompt}Crie o texto completo da narração para um vídeo de no máximo 40 segundos. O tom deve ser autêntico.
      **Estrutura Obrigatória:** Estruture a narração seguindo OBRIGATÓAMENTE o framework A.I.M.E. e identifique CADA FASE com um marcador claro no início da linha, exatamente como nos exemplos: [A] Awaken:, [I] Inform:, [M] Mechanism:, [E] Evoke:.
      Para cada trecho da narração, adicione entre parênteses uma sugestão de imagem ou vídeo. Exemplo: "[A] Awaken: Eu estava cansada... (imagem de uma pessoa frustrada)".
      **IMPORTANTE:** Comece a resposta DIRETAMENTE com '[A] Awaken:'. Não adicione nenhum texto introdutorio, cabeçalho ou observação antes do roteiro.`;
    
    case CreativeType.IMAGE_FEED:
    case CreativeType.IMAGE_STORIES:
    case CreativeType.CAROUSEL:
         return `
            Você é um diretor de arte e copywriter sênior, especialista em criar anúncios de imagem de altíssima conversão para Meta Ads, seguindo as diretrizes do "Projeto Andrômeda".

            **Sua Missão:** Gerar os componentes para um anúncio de imagem. Você deve fornecer:
            1. A descrição para uma imagem de alto impacto (sem texto).
            2. O texto (copy) para ser colocado sobre essa imagem.

            **Nicho:** ${niche}
            **Detalhes do Produto/Oferta:** ${productDetails || 'Não especificado.'}
            **Chamada para Ação (CTA) OBRIGÁTORIA:** "${callToAction}"

            **Diretrizes (NÃO IGNORE):**
            *   **Descrição da Imagem:** Descreva uma imagem fotorrealista, de alta qualidade e que chame a atenção, perfeitamente alinhada ao nicho. A imagem DEVE SER GERADA SEM NENHUM TEXTO. A descrição deve ser detalhada o suficiente para uma IA de imagem criar a cena perfeitamente.
            *   **Texto para Imagem:** Crie um texto curto, poderoso e conciso para ser sobreposto na imagem. Use a estrutura AIDA (Atenção, Interesse, Desejo, Ação) de forma compacta. O texto deve estar em **Português do Brasil** e incluir a CTA "${callToAction}".
            *   **Conformidade Andrômeda:** Evite promessas exageradas, "antes e depois" e não use "você que...".

            **Formato de Saída OBRIGATÓRIO:** Responda com um único objeto JSON, com a seguinte estrutura:
            {
              "image_description": "Sua descrição detalhada da imagem aqui.",
              "image_text": "Seu texto curto para a imagem aqui."
            }
        `;
    default:
      return basePrompt;
  }
};

export const generateCreative = async (niche: string, creativeType: CreativeType, productDetails: string, callToAction: string, imageSize: ImageSize): Promise<GeneratedContent> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = getPrompt(niche, creativeType, productDetails, callToAction, imageSize);
    
    const isImageType = [CreativeType.IMAGE_FEED, CreativeType.IMAGE_STORIES, CreativeType.CAROUSEL].includes(creativeType);

    if (!isImageType) {
        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let responseText = textResponse.text;
        // Find the start of the actual script to remove any introductory text from the AI
        const scriptStartIndex = responseText.search(/(?:\*{0,2})\[A]\s*Awaken:/i);
        if (scriptStartIndex > 0) {
            responseText = responseText.substring(scriptStartIndex);
        }

        return { text: responseText, imageUrl: null };
    }

    // Step 1: Generate the plan (description and text)
    const planResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    image_description: { type: Type.STRING },
                    image_text: { type: Type.STRING },
                }
            }
        },
    });

    const planText = planResponse.text.trim();
    let plan;
    try {
        plan = JSON.parse(planText);
    } catch {
        throw new Error("A IA retornou um formato de plano inválido. Tente novamente.");
    }

    const { image_description, image_text } = plan;

    if (!image_description || !image_text) {
        throw new Error("A IA não conseguiu gerar o plano para a imagem.");
    }

    // Step 2: Generate the image from the description
    const imageGenPrompt = `${image_description}. Proporção da imagem: ${imageSize}. Estilo fotorrealista, alta qualidade, sem nenhum texto.`;

    const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imageGenPrompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    let imageUrl: string | null = null;
    const imagePart = imageResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (imagePart?.inlineData) {
        const base64ImageBytes: string = imagePart.inlineData.data;
        imageUrl = `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
    }

    if (!imageUrl) {
        throw new Error("A geração da imagem falhou.");
    }

    return { text: image_text, imageUrl };
};

// Helper to decode base64
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Helper to create a WAV file from raw PCM data
function createWavBlobFromPcm(base64Pcm: string): Blob {
    const pcmData = decode(base64Pcm);
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const headerSize = 44;
    
    const buffer = new ArrayBuffer(headerSize + pcmData.length);
    const view = new DataView(buffer);

    // RIFF header
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + pcmData.length, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    
    // "fmt " sub-chunk
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
    view.setUint16(20, 1, true); // Audio format (1 for PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // Byte rate
    view.setUint16(32, numChannels * (bitsPerSample / 8), true); // Block align
    view.setUint16(34, bitsPerSample, true);

    // "data" sub-chunk
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, pcmData.length, true);

    // Copy PCM data
    new Uint8Array(buffer, headerSize).set(pcmData);

    return new Blob([buffer], { type: 'audio/wav' });
}

const getStyleInstruction = (style: VoiceStyle): string => {
    switch (style) {
        case VoiceStyle.EDUCATIONAL:
            return 'Gere o áudio a seguir com um tom profissional, calmo, claro e autoritário, e um ritmo moderado para facilitar a compreensão.';
        case VoiceStyle.PROMOTIONAL:
            return 'Gere o áudio a seguir com um tom entusiasmado, energético e persuasivo, e um ritmo dinâmico para destacar os benefícios.';
        case VoiceStyle.NARRATIVE:
            return 'Gere o áudio a seguir com um tom emocional e envolvente, com ritmo e entonação variáveis para refletir os momentos da história.';
        case VoiceStyle.RELAXING:
            return 'Gere o áudio a seguir com um tom suave, gentil e tranquilizador, e um ritmo lento e constante para induzir calma.';
        case VoiceStyle.JOURNALISTIC:
            return 'Gere o áudio a seguir com um tom formal, imparcial e direto, e um ritmo firme e claro para focar na objetividade.';
        default:
            return '';
    }
}

export const generateAudio = async (text: string, voiceName: string, voiceStyle: VoiceStyle): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const styleInstruction = getStyleInstruction(voiceStyle);
    
    let narrationOnly = text;

    // Step 1: Split the text by A.I.M.E. markers to isolate narration blocks.
    const narrationBlocks = narrationOnly.split(/\s*\*{0,2}\[[AIME]\][^\n:]+:\s*\*{0,2}/gi);

    // Step 2: Join the blocks, filtering out any empty strings that might result from the split.
    narrationOnly = narrationBlocks.filter(block => block.trim() !== "").join("\n");

    // Step 3: Remove visual cues in parentheses (e.g., "(Vídeo da pessoa...)")
    narrationOnly = narrationOnly.replace(/\([^)]+\)/g, "");
    
    // Step 4: Remove any remaining markdown characters.
    narrationOnly = narrationOnly.replace(/[\*_`#]/g, "");

    // Step 5: Trim and consolidate whitespace into single spaces for a clean input.
    narrationOnly = narrationOnly.trim().replace(/\s+/g, ' ');

    if (!narrationOnly) {
        throw new Error("Não foi encontrado texto narrável para gerar o áudio.");
    }

    const textForTTS = `${styleInstruction}\n\n${narrationOnly}`; 

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: textForTTS }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName },
                },
            },
        },
    });
    
    // Check for block reasons
    if (response.candidates?.[0]?.finishReason && response.candidates[0].finishReason !== 'STOP') {
        const reason = response.candidates[0].finishReason;
        const message = `A geração de áudio foi bloqueada. Motivo: ${reason}. Isso pode ocorrer por políticas de segurança do conteúdo.`;
        throw new Error(message);
    }
    
    const audioPart = response.candidates?.[0]?.content?.parts?.[0];

    if (audioPart?.inlineData?.data) {
        const base64Audio = audioPart.inlineData.data;
        const wavBlob = createWavBlobFromPcm(base64Audio);
        return URL.createObjectURL(wavBlob);
    }

    throw new Error("A geração do áudio falhou. A resposta da API não continha dados de áudio válidos.");
};