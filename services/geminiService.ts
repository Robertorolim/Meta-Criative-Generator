import { GoogleGenAI, Modality, Type } from "@google/genai";
import { CreativeType, ImageSize, GeneratedContent, VoiceStyle, VoiceOption, CarouselSlide, AwarenessLevel, LanguageType } from '../types';

const getAwarenessLevelInstructions = (awarenessLevel: AwarenessLevel): string => {
    switch (awarenessLevel) {
        case AwarenessLevel.UNCONSCIOUS:
            return `
**Diretriz de Nível de Consciência (Nível 1 — Inconsciente):**
- **Objetivo:** Despertar a consciência do problema sem vender.
- **Tom:** Intrigante, provocativo, misterioso.
- **Estruturas de Gancho (Hooks):**
    - **Padrão de Interrupção:** “Você se lembra de quem você era antes de [situação atual]?” (Ex: “Você se lembra de quem você era antes de desistir do seu corpo?”). Funciona para transformação pessoal, emagrecimento, carreira.
    - **Estatística Chocante:** “[X]% das pessoas fazem [ação] sem saber que isso causa [consequência oculta]” (Ex: “87% das pessoas tomam café ao acordar sem saber que isso trava o metabolismo por 6h”). Funciona para saúde, finanças.
    - **Revelação Silenciosa:** “Existe algo que ninguém te conta sobre [área]...” (Ex: “Existe algo que ninguém te conta sobre ganhar dinheiro online...”).
    - **Comparação Temporal:** “[Área] era assim há 5 anos. Hoje é diferente. E você ainda está preso no passado.” (Ex: “Tráfego pago era assim há 5 anos...”).
    - **Pergunta Existencial:** “Se você pudesse voltar [X anos], o que mudaria?” (Ex: “Se você pudesse voltar 10 anos, o que mudaria no seu corpo?”).
    - **Observação Social:** “Repare nas pessoas ao seu redor. O que elas têm em comum?” (Ex: “Quantas estão realmente felizes com o próprio corpo?”).
    - **Inversão de Realidade:** “E se eu te dissesse que [crena comum] é o oposto do que você deveria fazer?” (Ex: “Comer menos pode ser o oposto do ideal pra emagrecer.”).
`;
        case AwarenessLevel.PROBLEM_AWARE:
            return `
**Diretriz de Nível de Consciência (Nível 2 — Consciente do Problema):**
- **Objetivo:** Educar sobre a solução e desconstruir crenças antigas.
- **Tom:** Educativo, revelador, consultivo.
- **Estruturas de Gancho (Hooks):**
    - **Causa Oculta:** “A verdadeira causa de [problema] não é [crença]. É [causa real].” (Ex: “Não é falta de força de vontade; é resistência à leptina.”).
    - **Desconstrução:** “Por que [solução antiga] não funciona mais (e o que fazer agora)” (Ex: “Por que low-carb não funciona mais...”).
    - **Ciclo Vicioso:** “Você tenta [ação], piora [problema]... o ciclo nunca acaba.” (Ex: “Dieta → desacelera metabolismo → tenta de novo → piora.”).
    - **Revelação Progressiva:** “3 sinais de que [problema] está piorando (sem você perceber)” (Ex: “3 sinais de metabolismo travado.”).
    - **Erro Comum:** “O erro que 90% comete ao tentar [resolver problema] (e como evitar)” (Ex: “O erro que 90% comete ao emagrecer.”).
    - **Teste de Auto-Diagnóstico:** “Faça este teste: você tem [problema]?” (Ex: “Resistência à insulina?”).
    - **Linha do Tempo:** “Semana 1: [sintoma]… Mês 6: [colapso]. Reconhece?” (Ex: cansaço → insônia → burnout).
`;
        case AwarenessLevel.SOLUTION_AWARE:
            return `
**Diretriz de Nível de Consciência (Nível 3 — Consciente da Solução):**
- **Objetivo:** Provar diferenciação e quebrar objeções.
- **Tom:** Confiante, factual, evidencial.
- **Estruturas de Gancho (Hooks):**
    - **Diferenciação Direta:** “A diferença entre [genérico] e [sua solução]: [diferencial]” (Ex: “Dieta comum × protocolo metabólico.”).
    - **Prova Social Numérica:** “[Nome] conseguiu [resultado] em [tempo]. Veja como.” (Ex: “Maria perdeu 14kg em 8 semanas...”).
    - **Objeção Antecipada:** “‘Mas [objeção]’ — é por isso que funciona.” (Ex: “Sem tempo pra academia.”).
    - **Comparação Lado a Lado:** “[Método A] vs [seu método]. A escolha é sua.” (Ex: restritiva × protocolo metabólico).
    - **Antes e Depois Emocional:** “Antes: [emoção ruim]. Depois: [emoção boa]. O que mudou?” (Ex: “Vergonha do biquíni” → “primeira a entrar no mar.”).
    - **Autoridade por Associação:** “Mesmo método usado por [autoridade]” (Ex: “Protocolo de atletas olímpicos (adaptado).”).
    - **Garantia Inversa:** “Se você não conseguir [resultado] em [prazo], eu [compromisso].” (Ex: “Devolvo em dobro.”).
`;
        case AwarenessLevel.PRODUCT_AWARE:
            return `
**Diretriz de Nível de Consciência (Nível 4 — Consciente do Produto):**
- **Objetivo:** Criar urgência, facilitar decisão e remover último atrito.
- **Tom:** Direto, urgente, facilitador.
- **Estruturas de Gancho (Hooks):**
    - **Escassez Real:** “[Número] vagas restantes. Depois, só em [data].”
    - **Facilitação Extrema:** “3 cliques. 2 minutos. Você começa hoje.”
    - **Custo de Oportunidade:** “Cada dia que você adia = [perda concreta].”
    - **Bônus com Prazo:** “Entre hoje e ganhe [bônus]. Amanhã volta ao normal.”
    - **Próximo Passo Óbvio:** “Você já sabe que precisa. Agora é só [ação simples].”
    - **Comparação de Investimento:** “[Preço] ÷ [tempo] = menos que [comparação diária].” (Ex: “R$297 ÷ 90 dias = R$3,30/dia (menos que um café).”).
    - **Deadline Emocional:** “Daqui a [prazo], você estará [estado futuro]. Onde?” (Ex: “Daqui a 3 meses é verão…”).
`;
        case AwarenessLevel.ULTRA_AWARE:
            return `
**Diretriz de Nível de Consciência (Nível 5 — Ultra Consciente):**
- **Objetivo:** Conversão imediata e remoção total de atrito.
- **Tom:** Ultra direto, transacional.
- **Estruturas de Gancho (Hooks):**
    - **Acesso Imediato:** “Clique. Pague. Comece agora.”
    - **Demonstração em Tempo Real:** “Veja funcionando em 60s [DEMO AO VIVO]”
    - **Chamada Direta:** “Link na bio. Clique agora.”
    - **Resultado Garantido:** “Comece hoje. Resultado em [prazo]. Ou dinheiro de volta.”
`;
        default:
            return '';
    }
};

const getLanguageTypeInstructions = (languageType: LanguageType): string => {
    switch (languageType) {
        case LanguageType.SENSORIAL:
            return `**Estilo de Linguagem: Sensorial (Imersiva)**
- **Objetivo:** Fazer o público SENTIR antes de entender.
- **Como usar:** Use palavras que evocam os 5 sentidos: cheiro, calor, peso, som, toque, contraste. Crie uma cena vívida na mente do leitor.
- **Exemplo:** "Você acorda cansado, o despertador grita, e parece que o corpo pesa o dobro. Mas não é preguiça — é sinal de algo mais profundo."`;
        case LanguageType.IDENTIFICATION:
            return `**Estilo de Linguagem: Identificação (Espelho)**
- **Objetivo:** Fazer o leitor pensar "esse sou eu!".
- **Como usar:** Use as palavras e sentimentos exatos do seu público. Reflita as frustrações deles. Use frases como "Se você sente que...", "Bem-vindo ao clube dos que...".
- **Exemplo:** "Se você sente que trabalha o dia todo e ainda assim o resultado nunca vem... bem-vindo ao clube dos que carregam o peso do mundo e recebem migalhas de retorno."`;
        case LanguageType.MECHANISM:
            return `**Estilo de Linguagem: Mecanismo (Autoridade + Revelação)**
- **Objetivo:** Explicar de forma lógica por que nada funcionou antes e por que sua solução vai funcionar.
- **Como usar:** Dê um nome ao problema ou à solução. Use palavras como: mecanismo, gatilho, processo, sistema, estrutura, fórmula. Apresente um "vilão" claro.
- **Exemplo:** "O problema nunca foi sua disciplina — foi o ciclo de cortisol desregulado. E é exatamente isso que o método [nome] ajusta de forma natural."`;
        case LanguageType.CONTRAST:
            return `**Estilo de Linguagem: Contraste (Choque Controlado)**
- **Objetivo:** Quebrar um padrão mental e despertar curiosidade.
- **Como usar:** Apresente uma crença comum e depois a inverta. Use a estrutura "Você acha que X... mas na verdade é Y." ou "O maior erro não é X... é Y.".
- **Exemplo:** "O erro mais caro que você comete todos os dias não custa dinheiro — custa energia mental."`;
        case LanguageType.REVELATION:
            return `**Estilo de Linguagem: Revelação (Confidencial)**
- **Objetivo:** Soar como um insider, não como um vendedor.
- **Como usar:** Adote um tom de "deixa eu te contar um segredo". Use frases como "O que ninguém te conta é...", "O segredo dos bastidores é...".
- **Exemplo:** "Ninguém comenta isso, mas os profissionais que mais crescem fazem uma coisa em comum — e não tem nada a ver com sorte."`;
        case LanguageType.STATUS:
            return `**Estilo de Linguagem: Status (Transformacional)**
- **Objetivo:** Focar na transformação de identidade e no "novo eu" que o produto entrega.
- **Como usar:** Fale sobre sentimentos de poder, confiança, liberdade, reconhecimento e pertencimento. Vá além do benefício funcional.
- **Exemplo:** "Não é sobre perder peso. É sobre entrar em qualquer sala e sentir que todos percebem sua presença."`;
        case LanguageType.DECISION:
            return `**Estilo de Linguagem: Decisão (Direta e Rápida)**
- **Objetivo:** Dar o empurrão final para a ação, sem ruído.
- **Como usar:** Seja direto, claro e imperativo. Remova adjetivos desnecessários. Foque no próximo passo simples.
- **Exemplo:** "Clique e veja por dentro. Você vai entender em 20 segundos por que todos estão falando disso."`;
        case LanguageType.STRUCTURED_CONVERSATIONAL:
            return `**Estilo de Linguagem: Conversacional Estruturada (Natural e Persuasiva)**
- **Objetivo:** Fazer o espectador sentir que está ouvindo uma conversa empática, não um vendedor.
- **Como usar:** Combine estas 4 camadas:
    1. **Tom de Orientação:** Use frases como "Deixa eu te explicar de um jeito simples." ou "Olha, talvez ninguém tenha te contado isso, mas...".
    2. **Frases Curtas e Respiráveis:** Evite blocos longos. Uma ideia por frase. Crie ritmo com pausas.
    3. **Vocabulário de Leitura Mental:** Use expressões que soam familiares e tocam em sensações universais (frustração, dúvida, esperança). Ex: "Sabe quando você sente que tá fazendo tudo certo, mas nada anda?".
    4. **Analogias do Cotidiano:** Transforme conceitos complexos em imagens simples. Ex: "É como tentar encher um balde furado — não importa o quanto você trabalhe, tudo escapa.".
- **IMPORTANTE:** A chamada para ação (CTA) no final do roteiro será fornecida em outra instrução. Você DEVE seguir a instrução de CTA específica, em vez de criar um "microconvite" genérico.`;
        default:
            return '';
    }
};

const getCTAInstructions = (awarenessLevel: AwarenessLevel): string => {
    switch (awarenessLevel) {
        case AwarenessLevel.UNCONSCIOUS:
            return "Termine com uma chamada para ação (CTA) extremamente leve e indireta, focada em engajamento e não em venda. Use variações. Exemplos: 'Me siga para descobrir mais sobre isso', 'Comente o que você acha', 'Toque aqui se isso fez sentido para você'.";
        case AwarenessLevel.PROBLEM_AWARE:
            return "Termine com uma CTA focada em aprofundar o conhecimento sobre o problema ou a categoria da solução. Use variações. Exemplos: 'Toque para descobrir os 3 erros mais comuns', 'Comente EU QUERO para receber um diagnóstico rápido', 'Siga para entender a verdadeira causa do problema'.";
        case AwarenessLevel.SOLUTION_AWARE:
            return "Termine com uma CTA que direcione para a prova ou diferenciação da sua solução. Use variações. Exemplos: 'Veja o passo a passo no link da bio', 'Toque para ver o estudo de caso completo', 'Acesse o link para comparar os métodos'.";
        case AwarenessLevel.PRODUCT_AWARE:
            return "Termine com uma CTA clara e direta, focada em facilitar a decisão e criar urgência. Use variações. Exemplos: 'Toque no link da bio para garantir sua vaga', 'Comece hoje clicando no link abaixo', 'Acesse o site para ver os bônus disponíveis só hoje'.";
        case AwarenessLevel.ULTRA_AWARE:
            return "Termine com uma CTA ultra direta e transacional, removendo qualquer atrito. Use variações. Exemplos: 'Clique no link da bio para comprar agora', 'Toque aqui para acesso imediato', 'Últimas unidades no link da bio'.";
        default:
            return "Termine com uma chamada para ação leve e apropriada para o nível de consciência.";
    }
};


const getPrompt = (niche: string, awarenessLevel: AwarenessLevel, creativeType: CreativeType, productDetails: string, hook: string, languageType: LanguageType, imageSize: ImageSize, carouselSlidesCount: number): string => {
  const awarenessInstructions = getAwarenessLevelInstructions(awarenessLevel);
  const languageInstructions = getLanguageTypeInstructions(languageType);
  const ctaInstructions = getCTAInstructions(awarenessLevel);
  const basePrompt = `
    Você é um copywriter de elite e diretor de arte para Meta Ads, especialista no framework "Projeto Andrômeda". Sua missão é criar um criativo de anúncio perfeitamente calibrado para o público.

    **Nicho do Cliente:** ${niche}
    **Nível de Consciência do Público:** ${awarenessLevel}
    **Tipo de Linguagem:** ${languageType}
    **Estrutura de Gancho (Hook) Selecionada:** "${hook}"
    **Detalhes do Produto/Oferta:** ${productDetails || 'Não especificado.'}
    **Tipo de Criativo:** ${creativeType}

    **Diretriz Mestra:** O criativo DEVE ser construído em torno da **Estrutura de Gancho (Hook) Selecionada** e usar o **Tipo de Linguagem** especificado.

    ${awarenessInstructions}

    ${languageInstructions}

    **Lembrete crítico (Anti-bloqueio Andromeda):**
    1. **Foco Absoluto no Nível:** Nunca misture ganchos ou CTAs de níveis de consciência diferentes. O criativo deve ser 100% focado no nível de consciência selecionado.
    2. **Sem Atributos Pessoais:** Não use "Você que...". Fale na primeira pessoa ou de forma impessoal.
    3. **Processo > Promessa:** Mostre o "como", não apenas o "o quê". Evite promessas exageradas.
    4. **Sem "Antes e Depois" Direto:** Foque na transformação emocional ou de processo.

    **Tarefa:**
  `;

  switch (creativeType) {
    case CreativeType.VIDEO_UGC:
      return `${basePrompt}
      Crie o roteiro completo (narração e sugestões visuais) para um vídeo de até 45 segundos. O tom deve ser autêntico.
      
      **Estrutura A.I.M.E. Obrigatória:**
      O roteiro DEVE ser estruturado usando o framework A.I.M.E. e o gancho selecionado. Use as marcações [A], [I], [M], [E] para identificar cada seção:
      - **[A] Awaken:** A provocação inicial. DEVE incorporar o gancho "${hook}".
      - **[I] Inform:** Eduque sobre o problema de forma concisa.
      - **[M] Mechanism:** Apresente o mecanismo único ou a causa real do problema.
      - **[E] Evoke:** Evoque uma emoção e termine com uma chamada para ação (CTA). **A CTA DEVE seguir esta regra estrita:** ${ctaInstructions}

      Para cada trecho da narração, adicione entre parênteses uma sugestão de imagem ou vídeo. Exemplo: "[A] Você se lembra de quem era antes de desistir do seu corpo? (imagem de uma pessoa frustrada com o reflexo)".
      
      **IMPORTANTE:** Comece a resposta DIRETAMENTE com a primeira linha da narração, já com a marcação [A]. Não adicione nenhum texto introdutório, cabeçalho ou observação antes do roteiro.`;
    
    case CreativeType.MINI_VSL:
      return `${basePrompt}
      Crie o roteiro completo (narração e sugestões visuais) para uma Mini VSL de 40 segundos. O tom deve ser direto, persuasivo e focado na conversão.
      
      **Estrutura A.I.M.E. Obrigatória:**
      O roteiro DEVE ser estruturado usando o framework A.I.M.E. e o gancho selecionado. Use as marcações [A], [I], [M], [E] para identificar cada seção:
      - **[A] Awaken:** A provocação inicial. DEVE incorporar o gancho "${hook}". Seja rápido e direto.
      - **[I] Inform:** Eduque sobre o problema, agitando a dor de forma concisa.
      - **[M] Mechanism:** Apresente o mecanismo único ou a solução de forma clara e como a grande novidade.
      - **[E] Evoke:** Evoque o desejo pela solução e termine com uma chamada para ação (CTA) clara e direta. **A CTA DEVE seguir esta regra estrita:** ${ctaInstructions}

      Para cada trecho da narração, adicione entre parênteses uma sugestão de visual (pode ser texto na tela, animações simples, ou cenas de banco de imagens). Exemplo: "[A] Você já se sentiu preso em um ciclo vicioso? (Texto 'Ciclo Vicioso' aparece na tela com um efeito de loop)".
      
      **IMPORTANTE:** Comece a resposta DIRETAMENTE com a primeira linha da narração, já com a marcação [A]. Não adicione nenhum texto introdutório, cabeçalho ou observação antes do roteiro.`;

    case CreativeType.IMAGEM_UNICA:
         return `
            ${basePrompt}
            **Sua Missão:** Gerar os componentes para um anúncio de imagem. Você deve fornecer:
            1. A descrição para uma imagem de alto impacto (sem texto).
            2. O texto (headline/copy) para ser colocado sobre essa imagem.
            
            **Diretrizes Específicas:**
            *   **Descrição da Imagem:** Descreva uma imagem fotorrealista e de alta qualidade que traduza visualmente o conceito do gancho "${hook}". A imagem deve ser a representação visual do gancho.
            *   **Texto para Imagem:** Crie um texto curto e poderoso que execute a estrutura do gancho "${hook}" de forma direta e concisa.

            **Formato de Saída OBRIGATÓRIO:** Responda com um único objeto JSON, com a seguinte estrutura:
            {
              "image_description": "Sua descrição detalhada da imagem aqui, baseada no hook.",
              "image_text": "Seu texto curto para a imagem aqui, aplicando o hook."
            }
        `;
    case CreativeType.CARROSSEL:
        return `
            ${basePrompt}
             **Sua Missão:** Gerar os componentes para um anúncio de carrossel com ${carouselSlidesCount} slides. Você deve fornecer:
            1. Uma descrição para a imagem de CADA slide.
            2. O texto (copy) para ser colocado sobre a imagem de CADA slide.

            **Diretrizes Específicas:**
            *   **Narrativa do Carrossel:** O carrossel deve contar uma micro-história ou apresentar um argumento progressivo. O primeiro slide DEVE aplicar o gancho "${hook}". Os slides seguintes devem desenvolver a ideia, respeitando o nível de consciência. O último slide deve ter uma chamada para ação clara.
            *   **Descrição das Imagens:** Descreva imagens fotorrealistas que sigam a narrativa do carrossel.
            *   **Textos dos Slides:** Crie textos curtos e impactantes para cada slide.

            **Formato de Saída OBRIGATÓRIO:** Responda com um único objeto JSON, com a seguinte estrutura:
            {
              "slides": [
                { "image_description": "Descrição para o slide 1, aplicando o hook '${hook}'.", "image_text": "Texto para o slide 1, aplicando o hook '${hook}'." },
                { "image_description": "Descrição para o slide 2.", "image_text": "Texto para o slide 2." }
              ]
            }
        `;
    default:
      return basePrompt;
  }
};

const getVariationPrompt = (niche: string, awarenessLevel: AwarenessLevel, creativeType: CreativeType, productDetails: string, hook: string, languageType: LanguageType, originalText: string): string => {
    const awarenessInstructions = getAwarenessLevelInstructions(awarenessLevel);
    const languageInstructions = getLanguageTypeInstructions(languageType);
    return `
      Você é um copywriter de elite especialista no framework "Projeto Andrômeda".
      Sua tarefa é criar uma VARIAÇÃO de um texto de anúncio, mantendo o mesmo nicho, oferta, nível de consciência e, mais importante, a mesma ESTRUTURA DE GANCHO e TIPO DE LINGUAGEM.

      **Nicho:** ${niche}
      **Nível de Consciência:** ${awarenessLevel}
      **Detalhes da Oferta:** ${productDetails || 'Não especificado.'}
      **Tipo de Criativo:** ${creativeType}
      **Estrutura de Gancho (Hook) a ser mantida:** "${hook}"
      **Tipo de Linguagem a ser mantida:** ${languageType}

      **Diretrizes do Nível de Consciência (para referência):**
      ${awarenessInstructions}

      **Diretrizes do Tipo de Linguagem (para referência):**
      ${languageInstructions}

      **Texto Original para ser variado:**
      ---
      ${originalText}
      ---
      
      **Sua Tarefa:**
      Crie uma nova versão do texto que AINDA utilize a estrutura de gancho "${hook}" e o tipo de linguagem "${languageType}", mas com uma abordagem, ângulo ou exemplo diferente. Seja criativo, mas não mude os fundamentos.

      **Formato de Saída:**
      - Para vídeos, retorne apenas o novo roteiro (narração e sugestões visuais). Se o original usava a estrutura A.I.M.E., a variação também deve usar. Comece diretamente com a primeira linha da narração.
      - Para imagens ou carrosséis, retorne um único objeto JSON com a chave "image_text" (para imagem única) ou "slides" (para carrossel), contendo o(s) novo(s) texto(s).
    `;
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
    hook: string,
    languageType: LanguageType,
    imageSize: ImageSize,
    carouselSlidesCount: number,
    productImageBase64: string | null,
    productImageMimeType: string | null
): Promise<GeneratedContent> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = getPrompt(niche, awarenessLevel, creativeType, productDetails, hook, languageType, imageSize, carouselSlidesCount);
    
    if ([CreativeType.VIDEO_UGC, CreativeType.MINI_VSL].includes(creativeType)) {
        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return { text: textResponse.text, imageUrl: null };
    }

    if(creativeType === CreativeType.CARROSSEL) {
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


    // Logic for single image types (IMAGEM_UNICA)
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

export const generateCreativeVariation = async (niche: string, awarenessLevel: AwarenessLevel, creativeType: CreativeType, productDetails: string, hook: string, languageType: LanguageType, imageSize: ImageSize, originalText: string): Promise<string> => {
    if (creativeType === CreativeType.CARROSSEL) {
        throw new Error("A geração de variação não é suportada para o formato Carrossel.");
    }

    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = getVariationPrompt(niche, awarenessLevel, creativeType, productDetails, hook, languageType, originalText);
    
    if ([CreativeType.VIDEO_UGC, CreativeType.MINI_VSL].includes(creativeType)) {
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

    // Step 1: Remove AIME tags like [A], [I], etc.
    narrationOnly = narrationOnly.replace(/\[[A-Z]\]/g, '');

    // Step 2: Remove visual cues in parentheses (e.g., "(Vídeo da pessoa...)")
    narrationOnly = narrationOnly.replace(/\([^)]+\)/g, "");
    
    // Step 3: Remove any markdown characters.
    narrationOnly = narrationOnly.replace(/[\*_`#]/g, "");

    // Step 4: Trim and consolidate whitespace into single spaces for a clean input.
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