import React, { useState, useCallback } from 'react';
import { CreativeGeneratorForm } from './components/CreativeGeneratorForm';
import { CreativeDisplay } from './components/CreativeDisplay';
import { Header } from './components/Header';
import { CreativeType, ImageSize, GeneratedContent, VoiceStyle } from './types';
import { generateCreative, generateAudio } from './services/geminiService';
import { NICHE_OPTIONS, CTA_OPTIONS } from './constants';

const App: React.FC = () => {
  const [selectedNiche, setSelectedNiche] = useState<string>(NICHE_OPTIONS[0]);
  const [customNiche, setCustomNiche] = useState<string>('');
  const [productDetails, setProductDetails] = useState<string>('');
  const [callToAction, setCallToAction] = useState<string>(CTA_OPTIONS[0]);
  const [creativeType, setCreativeType] = useState<CreativeType>(CreativeType.UGC_VIDEO);
  const [imageSize, setImageSize] = useState<ImageSize>('1:1');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);


  const handleGenerate = useCallback(async () => {
    const niche = selectedNiche === 'Outro' ? customNiche : selectedNiche;
    if (!niche) {
      setError('Por favor, defina um nicho para gerar o criativo.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setAudioUrl(null);
    setAudioError(null);

    try {
      const content = await generateCreative(niche, creativeType, productDetails, callToAction, imageSize);
      setGeneratedContent(content);
    } catch (e) {
      console.error(e);
      setError('Ocorreu um erro ao gerar o criativo. Verifique sua chave de API e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedNiche, customNiche, productDetails, callToAction, creativeType, imageSize]);

  const handleGenerateAudio = useCallback(async (text: string, voiceName: string, voiceStyle: VoiceStyle) => {
    setIsAudioLoading(true);
    setAudioError(null);
    setAudioUrl(null);
    try {
      const url = await generateAudio(text, voiceName, voiceStyle);
      setAudioUrl(url);
    } catch(e) {
      console.error(e);
      setAudioError("Ocorreu um erro ao gerar o áudio. Tente novamente.");
    } finally {
      setIsAudioLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <CreativeGeneratorForm
            selectedNiche={selectedNiche}
            setSelectedNiche={setSelectedNiche}
            customNiche={customNiche}
            setCustomNiche={setCustomNiche}
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
          />
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Gerador de Criativos para Meta Ads - Em conformidade com Projeto Andrômeda</p>
      </footer>
    </div>
  );
};

export default App;