import { GoogleGenAI, Modality, Type } from "@google/genai";
import { CreativeType, ImageSize, GeneratedContent, VoiceStyle, VoiceOption, CarouselSlide, AwarenessLevel } from '../types';

const getAwarenessLevelInstructions = (awarenessLevel: AwarenessLevel): string => {
    switch (awarenessLevel) {
        case AwarenessLevel.UNCONSCIOUS:
            return `
**Diretriz de Nível de Consciência (Inconsciente):**
- **Objetivo:** Despertar a pessoa para um problema que ela não sabia que tinha.
- **Abordagem:** NÃO fale do produto ou da solução. Use storytelling, ganchos de curiosidade, notícias chocantes ou controvérsias. O foco total é no DESPERTAR DO PROBLEMA. O criativo deve gerar um "clique" na mente da pessoa, fazendo-a perceber uma nova dor ou um problema oculto.
`;
        case AwarenessLevel.PROBLEM_AWARE:
            return `
**Diretriz de Nível de Consciência (Consciente do Problema):**
- **Objetivo:** Agitar o problema que a pessoa já sabe que tem.
- **Abordagem:** Demonstre profunda empatia pela dor do cliente. Aprofunde o problema, mostrando as consequências negativas de não resolvê-lo. Explique o "porquê" do problema existir, talvez introduzindo um inimigo oculto ou uma causa que a pessoa desconhecia.
`;
        case AwarenessLevel.SOLUTION_AWARE:
            return `
**Diretriz de Nível de Consciência (Consciente da Solução):**
- **Objetivo:** Posicionar seu produto/método como a melhor solução possível.
- **Abordagem:** Apresente sua solução como uma oportunidade única ou um mecanismo novo e inovador. Mostre COMO ela resolve o problema de forma diferente e mais eficaz que as outras alternativas que a pessoa já conhece. Destaque o diferencial.
`;
        case AwarenessLevel.PRODUCT_AWARE:
            return `
**Diretriz de Nível de Consciência (Consciente do Produto):**
- **Objetivo:** Convencer a pessoa de que seu produto é a escolha certa para ela.
- **Abordagem:** A pessoa já conhece seu produto, mas ainda não comprou. Quebre objeções comuns, use forte prova social (depoimentos, números), crie um senso de urgência ou escassez e reforce os benefícios e a transformação.
`;
        case AwarenessLevel.MOST_AWARE:
            return `
**Diretriz de Nível de Consciência (Consciente Total):**
- **Objetivo:** Fechar a venda agora.
- **Abordagem:** A pessoa já confia no seu produto e está pronta para comprar, só esperando a oferta certa. Faça uma oferta direta, clara e irresistível. Use descontos, bônus, frete grátis, etc. O criativo deve ser direto ao ponto, focado na oferta.
`;
        default:
            return '';
    }
};


const getPrompt = (niche: string, awarenessLevel: AwarenessLevel, creativeType: CreativeType, productDetails: string, callToAction: string, imageSize: ImageSize, carouselSlidesCount: number): string => {
  const awarenessInstructions = getAwarenessLevelInstructions(awarenessLevel);
  const basePrompt = `
    Você é um especialista em copywriting e direção de arte para Meta Ads, treinado nas mais recentes diretrizes do "Projeto Andrômeda". Sua tarefa é criar todos os componentes para um criativo de anúncio.

    **Nicho do Cliente:** ${niche}
    **Nível de Consciência do Público:** ${awarenessLevel}
    **Detalhes do Produto/Oferta:** ${productDetails || 'Não especificado.'}
    **Chamada para Ação (CTA) Sugerida:** ${callToAction || 'Clique em "Saiba Mais"'}
    **Tipo de Criativo:** ${creativeType}

    **Instrução Crítica:** TODO o conteúdo gerado (narração, textos, descrições de imagem) DEVE OBRIGATORIAMENTE se basear e incorporar os "Detalhes do Produto/Oferta" fornecidos. Este é o elemento central do criativo. Se os detalhes não forem especificados, use seu conhecimento sobre o nicho.

    ${awarenessInstructions}

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
         return `
            Você é um diretor de arte e copywriter sênior, especialista em criar anúncios de imagem de altíssima conversão para Meta Ads, seguindo as diretrizes do "Projeto Andrômeda".

            **Sua Missão:** Gerar os componentes para um anúncio de imagem. Você deve fornecer:
            1. A descrição para uma imagem de alto impacto (sem texto).
            2. O texto (copy) para ser colocado sobre essa imagem.

            **Nicho:** ${niche}
            **Nível de Consciência do Público:** ${awarenessLevel}
            **Detalhes do Produto/Oferta:** ${productDetails || 'Não especificado.'}
            **Chamada para Ação (CTA) OBRIGÁTORIA:** "${callToAction}"

            **Instrução Crítica:** A descrição da imagem e o texto para a imagem DEVEM OBRIGATORIAMENTE se basear e incorporar os "Detalhes do Produto/Oferta". Este é o elemento central do criativo. Se os detalhes não forem especificados, use seu conhecimento sobre o nicho.

            ${awarenessInstructions}

            **Diretrizes (NÃO IGNORE):**
            *   **Descrição da Imagem:** Descreva uma imagem fotorrealista, de alta qualidade e que chame a atenção, perfeitamente alinhada ao nicho e ao nível de consciência. A imagem DEVE SER GERADA SEM NENHUM TEXTO. A descrição deve ser detalhada o suficiente para uma IA de imagem criar a cena perfeitamente.
            *   **Texto para Imagem:** Crie um texto curto, poderoso e conciso para ser sobreposto na imagem. Use a estrutura AIDA (Atenção, Interesse, Desejo, Ação) de forma compacta e alinhada ao nível de consciência. O texto deve estar em **Português do Brasil** e incluir a CTA "${callToAction}".
            *   **Conformidade Andrômeda:** Evite promessas exageradas, "antes e depois" e não use "você que...".

            **Formato de Saída OBRIGATÓRIO:** Responda com um único objeto JSON, com a seguinte estrutura:
            {
              "image_description": "Sua descrição detalhada da imagem aqui.",
              "image_text": "Seu texto curto para a imagem aqui."
            }
        `;
    case CreativeType.CAROUSEL:
        return `
            Você é um diretor de arte e copywriter sênior, especialista em criar anúncios de carrossel de altíssima conversão para Meta Ads, seguindo as diretrizes do "Projeto Andrômeda".

            **Sua Missão:** Gerar os componentes para um anúncio de carrossel com ${carouselSlidesCount} slides. Você deve fornecer:
            1. Uma descrição para a imagem de CADA slide.
            2. O texto (copy) para ser colocado sobre a imagem de CADA slide.

            **Nicho:** ${niche}
            **Nível de Consciência do Público:** ${awarenessLevel}
            **Detalhes do Produto/Oferta:** ${productDetails || 'Não especificado.'}
            **Chamada para Ação (CTA) OBRIGÁTORIA:** "${callToAction}" (Inclua a CTA no texto do último slide).

            **Instrução Crítica:** A descrição e o texto de CADA slide DEVEM OBRIGATORIAMENTE se basear e incorporar os "Detalhes do Produto/Oferta". Este é o elemento central do criativo. Se os detalhes não forem especificados, use seu conhecimento sobre o nicho.

            ${awarenessInstructions}

            **Diretrizes (NÃO IGNORE):**
            *   **Descrição da Imagem:** Para cada slide, descreva uma imagem fotorrealista e de alta qualidade. As imagens devem contar uma micro-história ou apresentar diferentes benefícios/ângulos do produto, sempre respeitando o nível de consciência. AS IMAGENS DEVEM SER GERADAS SEM NENHUM TEXTO.
            *   **Texto para Imagem:** Para cada slide, crie um texto curto e impactante. A soma dos textos deve seguir uma narrativa lógica e alinhada ao nível de consciência. O último slide deve conter a CTA.
            *   **Conformidade Andrômeda:** Evite promessas exageradas, "antes e depois" e não use "você que...".

            **Formato de Saída OBRIGATÓRIO:** Responda com um único objeto JSON, com a seguinte estrutura:
            {
              "slides": [
                { "image_description": "Descrição detalhada para o slide 1.", "image_text": "Texto curto para o slide 1." },
                { "image_description": "Descrição detalhada para o slide 2.", "image_text": "Texto curto para o slide 2." }
              ]
            }
        `;
    default:
      return basePrompt;
  }
};

const getVariationPrompt = (niche: string, awarenessLevel: AwarenessLevel, creativeType: CreativeType, productDetails: string, callToAction: string, originalText: string): string => {
    const awarenessInstructions = getAwarenessLevelInstructions(awarenessLevel);
    const basePrompt = `
      Você é um especialista em copywriting para Meta Ads, treinado nas diretrizes do "Projeto Andrômeda".
      Sua tarefa é criar uma VARIAÇÃO de um texto de anúncio já existente, mantendo o mesmo nicho, oferta e nível de consciência, mas mudando a abordagem ou o ângulo.

      **Nicho do Cliente:** ${niche}
      **Nível de Consciência do Público:** ${awarenessLevel}
      **Detalhes do Produto/Oferta:** ${productDetails || 'Não especificado.'}
      **Chamada para Ação (CTA) Sugerida:** ${callToAction || 'Clique em "Saiba Mais"'}
      **Tipo de Criativo:** ${creativeType}

      **Instrução Crítica:** A nova variação DEVE OBRIGATORIAMENTE continuar se baseando e incorporando os "Detalhes do Produto/Oferta" fornecidos.

      ${awarenessInstructions}

      **Texto Original para ser variado:**
      ---
      ${originalText}
      ---
    `;

    switch (creativeType) {
        case CreativeType.UGC_VIDEO:
        case CreativeType.MINI_VSL:
            return `${basePrompt}
              **Sua Tarefa:** Crie uma narração completamente NOVA, mas com o mesmo objetivo e nível de consciência do texto original. Explore um gancho diferente, uma dor diferente, ou uma nova perspectiva.
              **Estrutura Obrigatória:** Mantenha a estrutura A.I.M.E. e identifique CADA FASE: [A] Awaken:, [I] Inform:, [M] Mechanism:, [E] Evoke:.
              **IMPORTANTE:** Comece a resposta DIRETAMENTE com '[A] Awaken:'. Não adicione nenhum texto introdutório.
            `;
        case CreativeType.IMAGE_FEED:
        case CreativeType.IMAGE_STORIES:
            return `${basePrompt}
              **Sua Tarefa:** Crie uma NOVA versão do texto para ser sobreposto na imagem. O novo texto deve ser conciso, poderoso, manter a CTA "${callToAction}" e respeitar o nível de consciência. Tente uma abordagem diferente da original.
              **Formato de Saída OBRIGATÓRIO:** Responda com um único objeto JSON, com a seguinte estrutura:
              {
                "image_text": "Sua NOVA variação de texto para a imagem aqui."
              }
            `;
        case CreativeType.CAROUSEL:
            // This should be disabled in the UI, but we safeguard it here.
            return "A variação de carrosséis não é suportada.";
        default:
            return "Crie uma variação do texto fornecido.";
    }
};

const generateSingleImage = async (
    ai: GoogleGenAI,
    description: string,
    imageSize: ImageSize,
    productImageBase64: string | null,
    productImageMimeType: string | null
): Promise<string> => {
    let imageGenPrompt: string;
    const parts: any[] = [];

    if (productImageBase64 && productImageMimeType) {
        imageGenPrompt = `Integre a imagem do produto fornecida nesta cena, seguindo a descrição: "${description}". A integração deve ser 100% fotorrealista. **É crucial que o produto mantenha suas proporções e tamanho realistas.** Por exemplo, um frasco de gotas deve ter o tamanho de um frasco de gotas na vida real, não o tamanho de uma garrafa. A imagem final deve ter proporção ${imageSize} e qualidade de anúncio profissional.`;
        parts.push({
            inlineData: {
                data: productImageBase64,
                mimeType: productImageMimeType,
            }
        });
        parts.push({ text: imageGenPrompt });
    } else {
        imageGenPrompt = `${description}. Proporção da imagem: ${imageSize}. Estilo fotorrealista, alta qualidade, sem nenhum texto.`;
        parts.push({ text: imageGenPrompt });
    }

    const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: parts },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const imagePart = imageResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (imagePart?.inlineData) {
        const base64ImageBytes: string = imagePart.inlineData.data;
        return `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
    }

    throw new Error("A geração da imagem falhou.");
};


export const generateCreative = async (
    niche: string, 
    awarenessLevel: AwarenessLevel,
    creativeType: CreativeType, 
    productDetails: string, 
    callToAction: string, 
    imageSize: ImageSize,
    carouselSlidesCount: number,
    productImageBase64: string | null,
    productImageMimeType: string | null
): Promise<GeneratedContent> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = getPrompt(niche, awarenessLevel, creativeType, productDetails, callToAction, imageSize, carouselSlidesCount);
    
    const isImageType = [CreativeType.IMAGE_FEED, CreativeType.IMAGE_STORIES, CreativeType.CAROUSEL].includes(creativeType);

    if (!isImageType) {
        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let responseText = textResponse.text;
        const scriptStartIndex = responseText.search(/(?:\*{0,2})\[A]\s*Awaken:/i);
        if (scriptStartIndex > 0) {
            responseText = responseText.substring(scriptStartIndex);
        }

        return { text: responseText, imageUrl: null };
    }

    if(creativeType === CreativeType.CAROUSEL) {
         const planResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        slides: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    image_description: { type: Type.STRING },
                                    image_text: { type: Type.STRING },
                                }
                            }
                        }
                    }
                }
            },
        });
        
        let plan;
        try {
            plan = JSON.parse(planResponse.text.trim());
        } catch {
            throw new Error("A IA retornou um plano de carrossel inválido. Tente novamente.");
        }
        
        if (!plan.slides || !Array.isArray(plan.slides)) {
             throw new Error("A IA não conseguiu gerar o plano para o carrossel.");
        }

        const generatedSlides: CarouselSlide[] = await Promise.all(
            plan.slides.map(async (slide: { image_description: string, image_text: string }, index: number) => {
                // Only use the product image for the first slide (index 0) if it exists
                const useProductImage = index === 0 && productImageBase64 && productImageMimeType;
                const imageUrl = await generateSingleImage(
                    ai, 
                    slide.image_description, 
                    imageSize, 
                    useProductImage ? productImageBase64 : null, 
                    useProductImage ? productImageMimeType : null
                );
                return { text: slide.image_text, imageUrl };
            })
        );
        
        return { text: '', imageUrl: null, carouselSlides: generatedSlides };
    }


    // Logic for single image types (Feed, Stories)
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

    const imageUrl = await generateSingleImage(ai, image_description, imageSize, productImageBase64, productImageMimeType);

    return { text: image_text, imageUrl };
};

export const generateCreativeVariation = async (niche: string, awarenessLevel: AwarenessLevel, creativeType: CreativeType, productDetails: string, callToAction: string, imageSize: ImageSize, originalText: string): Promise<string> => {
    if (creativeType === CreativeType.CAROUSEL) {
        throw new Error("A geração de variação não é suportada para o formato Carrossel.");
    }

    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = getVariationPrompt(niche, awarenessLevel, creativeType, productDetails, callToAction, originalText);
    const isImageType = [CreativeType.IMAGE_FEED, CreativeType.IMAGE_STORIES].includes(creativeType);

    if (!isImageType) {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    }

    // For image types, we only need a new text
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    image_text: { type: Type.STRING },
                }
            }
        },
    });
    
    const responseText = response.text.trim();
    try {
        const parsed = JSON.parse(responseText);
        if (parsed.image_text) {
            return parsed.image_text;
        }
        throw new Error("A resposta da IA não continha 'image_text'.");
    } catch {
        throw new Error("A IA retornou um formato de variação inválido. Tente novamente.");
    }
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
        case VoiceStyle.ENTHUSIASTIC:
            return 'Gere o áudio a seguir com um tom entusiasmado, energético e persuasivo, com um ritmo mais rápido e dinâmico para criar excitação.';
        case VoiceStyle.CALM:
            return 'Gere o áudio a seguir com um tom calmo, claro e confiante, com um ritmo moderado para transmitir segurança e credibilidade.';
        case VoiceStyle.PROFESSIONAL:
            return 'Gere o áudio a seguir com um tom profissional, formal e direto, com um ritmo firme e claro para focar na objetividade e autoridade.';
        case VoiceStyle.EMPATHETIC:
            return 'Gere o áudio a seguir com um tom empático, acolhedor e genuíno, como se estivesse conversando com um amigo, para criar conexão.';
        case VoiceStyle.NARRATIVE:
            return 'Gere o áudio a seguir com um tom emocional e envolvente, com ritmo e entonação variáveis para refletir os momentos da história.';
        default:
            return '';
    }
}

const getStyleHintInstruction = (hint?: VoiceOption['styleHint']): string => {
    switch (hint) {
        case 'calm': return 'Fale de forma especialmente calma, clara e confiante.';
        case 'energetic': return 'Fale com mais energia, entusiasmo e um tom um pouco mais agudo.';
        case 'friendly': return 'Use um tom mais amigável, pessoal e conversacional, como se estivesse falando com um amigo.';
        default: return '';
    }
}

export const generateAudio = async (text: string, voiceName: string, voiceStyle: VoiceStyle, styleHint?: VoiceOption['styleHint']): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const styleInstruction = getStyleInstruction(voiceStyle);
    const hintInstruction = getStyleHintInstruction(styleHint);
    
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

    const textForTTS = `${styleInstruction} ${hintInstruction}\n\n${narrationOnly}`; 

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