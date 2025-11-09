import React, { useState, useCallback, useEffect } from 'react';
import { CreativeGeneratorForm } from './components/CreativeGeneratorForm';
import { CreativeDisplay } from './components/CreativeDisplay';
import { Header } from './components/Header';
// Fix: Import VoiceOption to correctly type the styleHint parameter.
import { CreativeType, ImageSize, GeneratedContent, VoiceStyle, VoiceOption, AwarenessLevel } from './types';
import { generateCreative, generateAudio, generateCreativeVariation } from './services/geminiService';
import { NICHE_OPTIONS, CTA_OPTIONS, AWARENESS_LEVEL_OPTIONS } from './constants';

const App: React.FC = () => {
  const [selectedNiche, setSelectedNiche] = useState<string>(NICHE_OPTIONS[0]);
  const [customNiche, setCustomNiche] = useState<string>('');
  const [awarenessLevel, setAwarenessLevel] = useState<AwarenessLevel>(AWARENESS_LEVEL_OPTIONS[0].value);
  const [productDetails, setProductDetails] = useState<string>('');
  const [callToAction, setCallToAction] = useState<string>(CTA_OPTIONS[0]);
  const [creativeType, setCreativeType] = useState<CreativeType>(CreativeType.UGC_VIDEO);
  const [imageSize, setImageSize] = useState<ImageSize>('1:1');
  const [carouselSlidesCount, setCarouselSlidesCount] = useState<number>(3);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);

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
      let productImageBase64: string | null = null;
      let productImageMimeType: string | null = null;
      
      if (productImageFile) {
        const promise = new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            productImageBase64 = result.split(',')[1];
            productImageMimeType = result.split(',')[0].split(':')[1].split(';')[0];
            resolve();
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(productImageFile);
        });
        await promise;
      }

      const content = await generateCreative(
        niche,
        awarenessLevel,
        creativeType, 
        productDetails, 
        callToAction, 
        imageSize,
        creativeType === CreativeType.CAROUSEL ? carouselSlidesCount : 1,
        productImageBase64,
        productImageMimeType
      );
      setGeneratedContent(content);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Ocorreu um erro ao gerar o criativo. Verifique sua chave de API e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedNiche, customNiche, productDetails, callToAction, creativeType, imageSize, carouselSlidesCount, productImageFile, awarenessLevel]);

  const handleGenerateVariation = useCallback(async (originalText: string) => {
    const niche = selectedNiche === 'Outro' ? customNiche : selectedNiche;
    setIsVariationLoading(true);
    setError(null);
    setAudioUrl(null); // Clear previous audio
    setAudioError(null);
    try {
      const newText = await generateCreativeVariation(niche, awarenessLevel, creativeType, productDetails, callToAction, imageSize, originalText);
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
  }, [selectedNiche, customNiche, productDetails, callToAction, creativeType, imageSize, awarenessLevel]);

  // Fix: Correctly type the styleHint parameter to match the expected type in generateAudio.
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
            productDetails={productDetails}
            setProductDetails={setProductDetails}
            callToAction={callToAction}
            setCallToAction={setCallToAction}
            creativeType={creativeType}
            setCreativeType={setCreativeType}
            imageSize={imageSize}
            setImageSize={setImageSize}
            isLoading={isLoading}
            onGenerate={handleGenerate}
            productDetailsHistory={productDetailsHistory}
            onSelectFromHistory={setProductDetails}
            carouselSlidesCount={carouselSlidesCount}
            setCarouselSlidesCount={setCarouselSlidesCount}
            productImageFile={productImageFile}
            setProductImageFile={setProductImageFile}
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