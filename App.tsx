
import React, { useState, useCallback, useEffect } from 'react';
import { CreativeGeneratorForm } from './components/CreativeGeneratorForm';
import { CreativeDisplay } from './components/CreativeDisplay';
import { Header } from './components/Header';
import { CreativeType, GeneratedContent, VoiceStyle, VoiceOption, AwarenessLevel, LanguageType, TargetGender } from './types';
import { generateCreative, generateAudio, generateCreativeVariation } from './services/geminiService';
import { NICHE_OPTIONS, HOOK_OPTIONS_BY_AWARENESS, AWARENESS_LEVEL_OPTIONS, LANGUAGE_TYPE_OPTIONS, AGE_OPTIONS, CTA_OPTIONS } from './constants';

const App: React.FC = () => {
  const [selectedNiche, setSelectedNiche] = useState<string>(NICHE_OPTIONS[0]);
  const [customNiche, setCustomNiche] = useState<string>('');
  const [targetGender, setTargetGender] = useState<TargetGender>(TargetGender.BOTH);
  const [targetAge, setTargetAge] = useState<string>(AGE_OPTIONS[1]); // Default to 25-34
  
  const [awarenessLevel, setAwarenessLevel] = useState<AwarenessLevel>(AWARENESS_LEVEL_OPTIONS[0].value);
  const [languageType, setLanguageType] = useState<LanguageType>(LANGUAGE_TYPE_OPTIONS[0].value);
  const [productDetails, setProductDetails] = useState<string>('');
  
  const initialHook = HOOK_OPTIONS_BY_AWARENESS[awarenessLevel]?.[0]?.value || '';
  const [selectedHook, setSelectedHook] = useState<string>(initialHook);
  
  const [creativeType, setCreativeType] = useState<CreativeType>(CreativeType.VIDEO_UGC);
  
  const [selectedCTA, setSelectedCTA] = useState<string>(CTA_OPTIONS[0]);
  const [customCTA, setCustomCTA] = useState<string>('');

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
    const cta = selectedCTA === 'Outro (Personalizado)' ? customNiche : selectedCTA; // Note: Using customNiche variable logic for customCTA below
    const finalCTA = selectedCTA === 'Outro (Personalizado)' ? customCTA : selectedCTA;

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
        targetGender,
        targetAge,
        awarenessLevel,
        creativeType, 
        productDetails, 
        selectedHook,
        languageType,
        finalCTA
      );
      setGeneratedContent(content);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Ocorreu um erro ao gerar o criativo. Verifique sua chave de API e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedNiche, customNiche, targetGender, targetAge, productDetails, selectedHook, creativeType, awarenessLevel, languageType, selectedCTA, customCTA]);

  const handleGenerateVariation = useCallback(async (originalText: string) => {
    const niche = selectedNiche === 'Outro' ? customNiche : selectedNiche;
    const finalCTA = selectedCTA === 'Outro (Personalizado)' ? customCTA : selectedCTA;

    setIsVariationLoading(true);
    setError(null);
    setAudioUrl(null); // Clear previous audio
    setAudioError(null);
    try {
      const newText = await generateCreativeVariation(
        niche, 
        targetGender, 
        targetAge, 
        awarenessLevel, 
        creativeType, 
        productDetails, 
        selectedHook, 
        languageType, 
        originalText,
        finalCTA
      );
      setGeneratedContent(prevContent => ({
        ...prevContent!,
        text: newText,
      }));
    } catch (e: any) {
      console.error(e);
      setError(e.message ||'Ocorreu um erro ao gerar a variação. Tente novamente.');
    } finally {
      setIsVariationLoading(false);
    }
  }, [selectedNiche, customNiche, targetGender, targetAge, productDetails, selectedHook, creativeType, awarenessLevel, languageType, selectedCTA, customCTA]);

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
            targetGender={targetGender}
            setTargetGender={setTargetGender}
            targetAge={targetAge}
            setTargetAge={setTargetAge}
            awarenessLevel={awarenessLevel}
            setAwarenessLevel={setAwarenessLevel}
            languageType={languageType}
            setLanguageType={setLanguageType}
            productDetails={productDetails}
            setProductDetails={setProductDetails}
            selectedHook={selectedHook}
            setSelectedHook={setSelectedHook}
            creativeType={creativeType}
            setCreativeType={setCreativeType}
            selectedCTA={selectedCTA}
            setSelectedCTA={setSelectedCTA}
            customCTA={customCTA}
            setCustomCTA={setCustomCTA}
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
