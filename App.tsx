import React, { useState, useCallback, useEffect } from 'react';
import { CreativeGeneratorForm } from './components/CreativeGeneratorForm';
import { CreativeDisplay } from './components/CreativeDisplay';
import { Header } from './components/Header';
import { CreativeType, GeneratedContent, VoiceStyle, VoiceOption, AwarenessLevel, LanguageType } from './types';
import { generateCreative, generateAudio, generateCreativeVariation } from './services/geminiService';
import { NICHE_OPTIONS, HOOK_OPTIONS_BY_AWARENESS, AWARENESS_LEVEL_OPTIONS, LANGUAGE_TYPE_OPTIONS } from './constants';

const App: React.FC = () => {
  const [selectedNiche, setSelectedNiche] = useState<string>(NICHE_OPTIONS[0]);
  const [customNiche, setCustomNiche] = useState<string>('');
  const [awarenessLevel, setAwarenessLevel] = useState<AwarenessLevel>(AWARENESS_LEVEL_OPTIONS[0].value);
  const [languageType, setLanguageType] = useState<LanguageType>(LANGUAGE_TYPE_OPTIONS[0].value);
  const [productDetails, setProductDetails] = useState<string>('');
  const [targetGender, setTargetGender] = useState<string>('Ambos');
  const [targetAge, setTargetAge] = useState<string>('');
  
  const initialHook = HOOK_OPTIONS_BY_AWARENESS[awarenessLevel]?.[0]?.value || '';
  const [selectedHook, setSelectedHook] = useState<string>(initialHook);
  
  const [creativeType, setCreativeType] = useState<CreativeType>(CreativeType.VIDEO_UGC);

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVariationLoading, setIsVariationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const [productDetailsHistory, setProductDetailsHistory] = useState<string[]>([]);
  const MAX_HISTORY_SIZE = 5;

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('productDetailsHistory');
      if (storedHistory) {
        setProductDetailsHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load product details history from localStorage", error);
    }
  }, []);

  const addProductToHistory = (details: string) => {
    if (!details.trim()) return;

    setProductDetailsHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(item => item !== details);
      const newHistory = [details, ...filteredHistory].slice(0, MAX_HISTORY_SIZE);
      try {
        localStorage.setItem('productDetailsHistory', JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save product details history to localStorage", error);
      }
      return newHistory;
    });
  };

  const handleGenerate = useCallback(async () => {
    const niche = selectedNiche === 'Outro' ? customNiche : selectedNiche;
    if (!niche) {
      setError('Por favor, defina um nicho para gerar o criativo.');
      return;
    }
    
    if (productDetails) {
      addProductToHistory(productDetails);
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setAudioUrl(null);
    setAudioError(null);

    try {
      const content = await generateCreative(
        niche,
        awarenessLevel,
        creativeType, 
        productDetails, 
        selectedHook,
        languageType,
        targetGender,
        targetAge,
      );
      setGeneratedContent(content);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Ocorreu um erro ao gerar o criativo. Verifique sua chave de API e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedNiche, customNiche, productDetails, selectedHook, creativeType, awarenessLevel, languageType, targetGender, targetAge]);

  const handleGenerateVariation = useCallback(async (originalText: string) => {
    const niche = selectedNiche === 'Outro' ? customNiche : selectedNiche;
    setIsVariationLoading(true);
    setError(null);
    setAudioUrl(null); // Clear previous audio
    setAudioError(null);
    try {
      const newText = await generateCreativeVariation(niche, awarenessLevel, creativeType, productDetails, selectedHook, languageType, targetGender, targetAge, originalText);
      setGeneratedContent({
        text: newText,
      });
    } catch (e: any) {
      console.error(e);
      setError(e.message ||'Ocorreu um erro ao gerar a variação. Tente novamente.');
    } finally {
      setIsVariationLoading(false);
    }
  }, [selectedNiche, customNiche, productDetails, selectedHook, creativeType, awarenessLevel, languageType, targetGender, targetAge]);

  const handleGenerateAudio = useCallback(async (text: string, voiceName: string, voiceStyle: VoiceStyle, styleHint?: VoiceOption['styleHint']) => {
    setIsAudioLoading(true);
    setAudioError(null);
    setAudioUrl(null);
    try {
      const url = await generateAudio(text, voiceName, voiceStyle, styleHint);
      setAudioUrl(url);
    } catch(e: any) {
      console.error(e);
      setAudioError(e.message || "Ocorreu um erro ao gerar o áudio. Tente novamente.");
    } finally {
      setIsAudioLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr] lg:gap-10">
          <CreativeGeneratorForm
            selectedNiche={selectedNiche}
            setSelectedNiche={setSelectedNiche}
            customNiche={customNiche}
            setCustomNiche={setCustomNiche}
            awarenessLevel={awarenessLevel}
            setAwarenessLevel={setAwarenessLevel}
            languageType={languageType}
            setLanguageType={setLanguageType}
            productDetails={productDetails}
            setProductDetails={setProductDetails}
            targetGender={targetGender}
            setTargetGender={setTargetGender}
            targetAge={targetAge}
            setTargetAge={setTargetAge}
            selectedHook={selectedHook}
            setSelectedHook={setSelectedHook}
            creativeType={creativeType}
            setCreativeType={setCreativeType}
            isLoading={isLoading}
            onGenerate={handleGenerate}
            productDetailsHistory={productDetailsHistory}
            onSelectFromHistory={setProductDetails}
          />
          <CreativeDisplay
            content={generatedContent}
            isLoading={isLoading}
            error={error}
            creativeType={creativeType}
            onGenerateAudio={handleGenerateAudio}
            isAudioLoading={isAudioLoading}
            audioUrl={audioUrl}
            audioError={audioError}
            onGenerateVariation={handleGenerateVariation}
            isVariationLoading={isVariationLoading}
          />
        </div>
      </main>
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>Gerador de Criativos para Meta Ads - Em conformidade com Projeto Andrômeda</p>
      </footer>
    </div>
  );
};

export default App;