import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { GeneratedContent, CreativeType, VoiceStyle, VoiceOption, CarouselSlide } from '../types';
import { VOICE_OPTIONS, VOICE_STYLE_OPTIONS } from '../constants';
import { generateAudio } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface CreativeDisplayProps {
  content: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
  creativeType: CreativeType;
  onGenerateAudio: (text: string, voiceName: string, voiceStyle: VoiceStyle, styleHint?: VoiceOption['styleHint']) => void;
  isAudioLoading: boolean;
  audioUrl: string | null;
  audioError: string | null;
  onGenerateVariation: (originalText: string) => void;
  isVariationLoading: boolean;
}

const SkeletonLoader: React.FC<{ creativeType: CreativeType }> = ({ creativeType }) => {
    const isImageType = [CreativeType.IMAGE_FEED, CreativeType.IMAGE_STORIES, CreativeType.CAROUSEL].includes(creativeType);

    if (isImageType) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="w-full bg-white/10 rounded-lg aspect-square"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-white/10 rounded w-1/3"></div>
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-5/6"></div>
            </div>
            <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-4/6"></div>
            </div>
        </div>
    );
};

const AudioGenerator: React.FC<{
    text: string;
    onGenerate: (text: string, voiceName: string, voiceStyle: VoiceStyle, styleHint?: VoiceOption['styleHint']) => void;
    isLoading: boolean;
    audioUrl: string | null;
    error: string | null;
}> = ({ text, onGenerate, isLoading, audioUrl, error }) => {
    const [selectedVoice, setSelectedVoice] = useState<string>(VOICE_OPTIONS[0].name);
    const [selectedStyle, setSelectedStyle] = useState<VoiceStyle>(VOICE_STYLE_OPTIONS[0].value);
    
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string|null>(null);

    const femaleVoices = VOICE_OPTIONS.filter(v => v.gender === 'female');
    const maleVoices = VOICE_OPTIONS.filter(v => v.gender === 'male');

    const handleGenerateClick = () => {
        const voiceOption = VOICE_OPTIONS.find(v => v.name === selectedVoice);
        if (voiceOption) {
            onGenerate(text, voiceOption.apiName, selectedStyle, voiceOption.styleHint);
        }
    };

    const handlePreview = async () => {
      setIsPreviewLoading(true);
      setPreviewError(null);
      const voiceOption = VOICE_OPTIONS.find(v => v.name === selectedVoice);
      if (!voiceOption) {
        setIsPreviewLoading(false);
        return;
      }
      try {
        const previewText = "Esta é uma demonstração da voz selecionada.";
        // Fix: Replaced non-existent VoiceStyle.EDUCATIONAL with VoiceStyle.PROFESSIONAL for the audio preview generation.
        const url = await generateAudio(previewText, voiceOption.apiName, VoiceStyle.PROFESSIONAL, voiceOption.styleHint);
        const audio = new Audio(url);
        audio.play();
      } catch (e) {
        console.error("Preview failed", e);
        setPreviewError("Falha ao gerar prévia.");
      } finally {
        setIsPreviewLoading(false);
      }
    }

    return (
        <div className="mt-6 p-5 bg-gradient-to-br from-gray-900 to-gray-800/80 rounded-xl border border-white/10 shadow-lg">
            <h3 className="text-lg font-semibold text-sky-300 mb-4">Geração de Áudio Avançada</h3>
            
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="voiceStyle" className="block text-sm font-medium text-gray-300 mb-2">
                            Estilo da Voz
                        </label>
                        <select
                            id="voiceStyle"
                            value={selectedStyle}
                            onChange={(e) => setSelectedStyle(e.target.value as VoiceStyle)}
                             className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                        >
                            {VOICE_STYLE_OPTIONS.map(option => (
                               <option key={option.value} value={option.value} className="bg-gray-800">{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="voice" className="block text-sm font-medium text-gray-300 mb-2">
                            Voz Específica
                        </label>
                        <div className="flex gap-2">
                            <select
                                id="voice"
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                            >
                                <optgroup label="Vozes Femininas">
                                    {femaleVoices.map(voice => (
                                        <option key={voice.name} value={voice.name} className="bg-gray-800">{voice.name}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="Vozes Masculinas">
                                    {maleVoices.map(voice => (
                                        <option key={voice.name} value={voice.name} className="bg-gray-800">{voice.name}</option>
                                    ))}
                                </optgroup>
                            </select>
                            <button onClick={handlePreview} disabled={isPreviewLoading} title="Ouvir Prévia da Voz" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0">
                                {isPreviewLoading ? 
                                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                                }
                            </button>
                        </div>
                        {previewError && <p className="text-red-400 text-xs mt-2">{previewError}</p>}
                    </div>
                </div>

                <button
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Gerando Áudio...
                        </>
                    ) : 'Gerar Áudio da Narração'}
                </button>
            </div>

            {error && <p className="text-red-400 mt-4 text-sm bg-red-500/10 p-3 rounded-lg">{error}</p>}
            
            {audioUrl && (
                <div className="mt-5">
                    <p className="text-sm font-medium text-gray-300 mb-2">Resultado do Áudio:</p>
                    <audio controls src={audioUrl} className="w-full">
                        Seu navegador não suporta o elemento de áudio.
                    </audio>
                </div>
            )}
        </div>
    );
};


const CarouselSlideDisplay: React.FC<{ slide: CarouselSlide, index: number }> = ({ slide, index }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(slide.text);
        setCopied(true);
    };

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="font-bold text-sky-400 mb-3">Slide {index + 1}</h3>
            <div className="space-y-4">
                <img src={slide.imageUrl} alt={`Slide ${index + 1} do carrossel`} className="rounded-lg border-2 border-white/10 w-full" />
                <div>
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-semibold text-gray-300">Texto do Slide</h4>
                         <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 text-gray-300 font-medium py-1.5 px-2.5 rounded-lg transition-colors disabled:opacity-50"
                            disabled={copied}
                        >
                            <ClipboardIcon />
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                     </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed bg-gray-900/50 p-3 rounded-lg">{slide.text}</p>
                </div>
            </div>
        </div>
    );
};

export const CreativeDisplay: React.FC<CreativeDisplayProps> = ({
  content,
  isLoading,
  error,
  creativeType,
  onGenerateAudio,
  isAudioLoading,
  audioUrl,
  audioError,
  onGenerateVariation,
  isVariationLoading,
}) => {
  const [copied, setCopied] = useState(false);
  const isNarrationType = creativeType === CreativeType.UGC_VIDEO || creativeType === CreativeType.MINI_VSL;
  const copyButtonText = isNarrationType ? 'Copiar Narração' : 'Copiar Texto';
  
  const handleCopy = () => {
    if (content?.text) {
        let textToCopy = content.text;
        if (isNarrationType) {
            const aimeRegex = /(?:\*{0,2})\[[AIME]\][^:]*:(?:\*{0,2})/gi;
            textToCopy = textToCopy.replace(aimeRegex, "");
            const visualCueRegex = /\([^)]*\)/g;
            textToCopy = textToCopy.replace(visualCueRegex, "");
            textToCopy = textToCopy.trim().replace(/\n{2,}/g, '\n');
        }
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    setCopied(false);
  }, [content]);

  const renderNarrationContent = (text: string) => {
    const aimeRegex = /(?:\*{0,2})\[([AIME])\]\s*([^:]+):(?:\*{0,2})/gi;
    const parts = text.split(aimeRegex);
  
    if (parts.length <= 1) {
      const visualCueRegex = /(\([^)]+\))/g;
      return (
        <p className="whitespace-pre-wrap text-gray-300 text-base leading-relaxed">
          {text.split(visualCueRegex).filter(part => part).map((part, index) => {
            if (part.startsWith('(') && part.endsWith(')')) {
              return <span key={index} className="text-gray-400 italic">{part}</span>;
            }
            return <span key={index}>{part}</span>;
          })}
        </p>
      );
    }

    const visualCueRegex = /(\([^)]+\))/g;
    const renderedParts = [];

    for (let i = 1; i < parts.length; i += 3) {
        const letter = parts[i];
        const word = parts[i + 1];
        let textBlock = (parts[i + 2] || '').trim();

        const narrationParts = textBlock.split(visualCueRegex).filter(part => part);

        renderedParts.push(
            <div key={i} className="relative pl-8">
              <div className="absolute left-0 top-1 h-full w-px bg-sky-500/30"></div>
              <div className="absolute left-[-9px] top-1 h-5 w-5 bg-gray-950 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-sky-400"></div>
              </div>
              <h4 className="font-semibold text-sky-400 mb-1">{`[${letter}] ${word}`}</h4>
              <p className="text-gray-300 leading-relaxed">
                  {narrationParts.map((part, j) => {
                      if (part.startsWith('(') && part.endsWith(')')) {
                          return <span key={j} className="text-gray-400 italic">{part}</span>;
                      }
                      return <span key={j}>{part}</span>;
                  })}
              </p>
            </div>
        );
    }

    return <div className="space-y-6">{renderedParts}</div>;
  };


  const renderContent = () => {
    if (isLoading) {
      return <SkeletonLoader creativeType={creativeType} />;
    }

    if (error) {
      return <p className="text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/30">{error}</p>;
    }

    if (!content) {
      return (
        <div className="text-center text-gray-500 py-16 flex flex-col items-center justify-center">
          <SparklesIcon />
          <p className="text-lg mt-4 font-semibold">Seu criativo aparecerá aqui</p>
          <p className="max-w-xs">Preencha os campos ao lado e clique em "Gerar Criativo" para começar a mágica.</p>
        </div>
      );
    }

    if (content.carouselSlides) {
        return (
            <div className="space-y-6">
                {content.carouselSlides.map((slide, index) => (
                    <CarouselSlideDisplay key={index} slide={slide} index={index} />
                ))}
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {content.imageUrl && (
                <div>
                    <img src={content.imageUrl} alt="Criativo gerado por IA" className="rounded-lg border-2 border-white/10 w-full" />
                </div>
            )}
            
            <div className="space-y-4">
                {content.text && !isNarrationType && (
                     <div>
                        <h3 className="text-lg font-semibold text-sky-300 mb-2">Sugestão de Texto para Imagem</h3>
                        <p className="whitespace-pre-wrap leading-relaxed bg-white/5 p-4 rounded-lg">{content.text}</p>
                    </div>
                )}
                {content.text && isNarrationType && renderNarrationContent(content.text)}
            </div>

            {content.text && (
                <div className="pt-6 border-t border-white/10">
                    <button
                        onClick={() => onGenerateVariation(content.text!)}
                        disabled={isVariationLoading || creativeType === CreativeType.CAROUSEL}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold py-2.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-indigo-500/40"
                        title={creativeType === CreativeType.CAROUSEL ? "Variações não disponíveis para carrossel" : ""}
                    >
                        {isVariationLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Criando Variação...
                            </>
                        ) : `Gerar Variação ${isNarrationType ? 'da Narração' : 'do Texto'}`}
                    </button>
                </div>
            )}
            {isNarrationType && content.text && (
                <AudioGenerator 
                    text={content.text}
                    onGenerate={onGenerateAudio}
                    isLoading={isAudioLoading}
                    audioUrl={audioUrl}
                    error={audioError}
                />
            )}
        </div>
    );
  };

  return (
    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg shadow-2xl shadow-black/20 min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400">Resultado</h2>
        {content && content.text && !content.carouselSlides && !isLoading && !error && (
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 text-gray-300 font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
                disabled={copied}
            >
                <ClipboardIcon />
                {copied ? 'Copiado!' : copyButtonText}
            </button>
        )}
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};