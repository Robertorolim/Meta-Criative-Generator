import { GoogleGenAI, Modality, Type, Schema } from "@google/genai";
import { CreativeType, GeneratedContent, VoiceStyle, VoiceOption, AwarenessLevel, LanguageType, ScriptSection } from '../types';

const getAwarenessLevelInstructions = (awarenessLevel: AwarenessLevel): string => {
    switch (awarenessLevel) {
        case AwarenessLevel.UNCONSCIOUS:
            return `**Nível 1 — Inconsciente:** Despertar consciência sem vender. Hooks: Padrão de Interrupção, Estatística Chocante, Inversão de Realidade.`;
        case AwarenessLevel.PROBLEM_AWARE:
            return `**Nível 2 — Consciente do Problema:** Educar e desconstruir crenças. Hooks: Causa Oculta, Ciclo Vicioso, Erro Comum.`;
        case AwarenessLevel.SOLUTION_AWARE:
            return `**Nível 3 — Consciente da Solução:** Provar diferenciação. Hooks: Comparação Lado a Lado, Prova Social Numérica, Objeção Antecipada.`;
        case AwarenessLevel.PRODUCT_AWARE:
            return `**Nível 4 — Consciente do Produto:** Urgência e facilitação. Hooks: Escassez Real, Facilitação Extrema, Deadline Emocional.`;
        case AwarenessLevel.ULTRA_AWARE:
            return `**Nível 5 — Ultra Consciente:** Conversão imediata. Hooks: Acesso Imediato, Resultado Garantido.`;
        default: return '';
    }
};

const getLanguageTypeInstructions = (languageType: LanguageType): string => {
    return `**Estilo de Linguagem: ${languageType}**. Mantenha o tom estritamente alinhado a este estilo. Se for Sensorial, use os 5 sentidos. Se for Identificação, use espelhamento. Se for Conversacional, use frases curtas e naturais.`;
};

const getCTAInstructions = (awarenessLevel: AwarenessLevel, customCTA?: string): string => {
    if (customCTA && customCTA.trim() !== "") {
        return `CTA Rule: MANDATORY Use exactly this text for the 'E' (Evoke) section narration: "${customCTA}". Do not change it, do not translate it. Copy it exactly.`;
    }
    // Simplified for JSON context
    if (awarenessLevel === AwarenessLevel.UNCONSCIOUS) return "CTA Rule: CTA leve: engajamento ou seguir.";
    if (awarenessLevel === AwarenessLevel.ULTRA_AWARE) return "CTA Rule: CTA agressiva: compra imediata.";
    return "CTA Rule: CTA moderada: saber mais ou link na bio.";
};


const SCRIPT_SCHEMA: Schema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            section: {
                type: Type.STRING,
                enum: ["A", "I", "M", "E"],
                description: "The A.I.M.E section identifier."
            },
            narration: {
                type: Type.STRING,
                description: "The spoken script for this section. First person (I/My) for UGC."
            },
            visual_cue: {
                type: Type.STRING,
                description: "Detailed visual description for the camera/scene."
            }
        },
        required: ["section", "narration", "visual_cue"]
    }
};

export const generateCreative = async (
    niche: string, 
    awarenessLevel: AwarenessLevel,
    creativeType: CreativeType, 
    productDetails: string, 
    hook: string,
    languageType: LanguageType,
    targetGender: string,
    targetAge: string,
    customCTA?: string,
): Promise<GeneratedContent> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
You are an elite copywriter for Meta Ads (Andromeda Framework).
Your task is to generate a structured ad script in JSON format.

Target Audience: ${targetGender}, ${targetAge || 'General'}.
Niche: ${niche}.
Awareness: ${awarenessLevel}.
Language: ${languageType}.
Hook: "${hook}".
Product: ${productDetails}.
Format: ${creativeType}.

${getAwarenessLevelInstructions(awarenessLevel)}
${getLanguageTypeInstructions(languageType)}
${getCTAInstructions(awarenessLevel, customCTA)}

Framework A.I.M.E. is MANDATORY:
- A (Awaken): The Hook.
- I (Inform): Agitate problem/context.
- M (Mechanism): The solution/method.
- E (Evoke): Emotion + Call to Action.

Output must be a JSON array of objects with keys: section, narration, visual_cue.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Generate the creative script now.",
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: SCRIPT_SCHEMA,
            temperature: 0.7, 
        },
    });

    if (response.text) {
        try {
            const structuredScript = JSON.parse(response.text) as ScriptSection[];
            return { structuredScript };
        } catch (e) {
            console.error("JSON Parse error", e);
            return { rawText: response.text }; // Fallback
        }
    }
    throw new Error("No content generated");
};

export const generateCreativeVariation = async (
    niche: string, 
    awarenessLevel: AwarenessLevel, 
    creativeType: CreativeType, 
    productDetails: string, 
    hook: string, 
    languageType: LanguageType, 
    targetGender: string, 
    targetAge: string, 
    originalText: string,
    customCTA?: string
): Promise<GeneratedContent> => {
     // We pass the customCTA to ensure the variation respects the user's edit
     return generateCreative(niche, awarenessLevel, creativeType, productDetails, hook, languageType, targetGender, targetAge, customCTA);
};

export const generateReferenceImage = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const improvedPrompt = `Cinematic photography, vertical 9:16 aspect ratio, high quality, advertising style. ${prompt}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: improvedPrompt,
        config: {
           // responseMimeType not supported for image gen on this model in this way, it returns parts
        }
    });

    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("Failed to generate image");
};


// Audio Helpers
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function createWavBlobFromPcm(base64Pcm: string): Blob {
    const pcmData = decode(base64Pcm);
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const headerSize = 44;
    
    const buffer = new ArrayBuffer(headerSize + pcmData.length);
    const view = new DataView(buffer);

    view.setUint32(0, 0x52494646, false); 
    view.setUint32(4, 36 + pcmData.length, true);
    view.setUint32(8, 0x57415645, false); 
    view.setUint32(12, 0x666d7420, false); 
    view.setUint16(20, 1, true); 
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); 
    view.setUint16(32, numChannels * (bitsPerSample / 8), true); 
    view.setUint16(34, bitsPerSample, true);
    view.setUint32(36, 0x64617461, false); 
    view.setUint32(40, pcmData.length, true);
    new Uint8Array(buffer, headerSize).set(pcmData);

    return new Blob([buffer], { type: 'audio/wav' });
}

const getStyleInstruction = (style: VoiceStyle): string => {
    switch (style) {
        case VoiceStyle.ENTHUSIASTIC: return 'Tom entusiasmado, energético e persuasivo.';
        case VoiceStyle.CALM: return 'Tom calmo, claro e confiante.';
        case VoiceStyle.PROFESSIONAL: return 'Tom profissional, formal e direto.';
        case VoiceStyle.EMPATHETIC: return 'Tom empático, acolhedor e genuíno.';
        case VoiceStyle.NARRATIVE: return 'Tom emocional e envolvente de storytelling.';
        default: return '';
    }
}

const getStyleHintInstruction = (hint?: VoiceOption['styleHint']): string => {
    switch (hint) {
        case 'calm': return 'Fale de forma especialmente calma.';
        case 'energetic': return 'Fale com mais energia.';
        case 'friendly': return 'Use um tom amigável.';
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
    
    // Text is assumed to be cleaned narration at this point
    const textForTTS = `${styleInstruction} ${hintInstruction}\n\n${text}`; 

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
    
    const audioPart = response.candidates?.[0]?.content?.parts?.[0];
    if (audioPart?.inlineData?.data) {
        const wavBlob = createWavBlobFromPcm(audioPart.inlineData.data);
        return URL.createObjectURL(wavBlob);
    }

    throw new Error("A geração do áudio falhou.");
};