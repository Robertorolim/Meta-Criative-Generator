import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { GeneratedContent, CreativeType, VoiceStyle } from '../types';
import { VOICE_OPTIONS, VOICE_STYLE_OPTIONS } from '../constants';
import { generateAudio } from '../services/geminiService';

interface CreativeDisplayProps {
  content: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
  creativeType: CreativeType;
  onGenerateAudio: (text: string, voiceName: string, voiceStyle: VoiceStyle) => void;
  isAudioLoading: boolean;
  audioUrl: string | null;
  audioError: string | null;
}

const SkeletonLoader: React.FC<{ creativeType: CreativeType }> = ({ creativeType }) => {
    const isImageType = [CreativeType.IMAGE_FEED, CreativeType.IMAGE_STORIES, CreativeType.CAROUSEL].includes(creativeType);

    if (isImageType) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="w-full bg-slate-700 rounded-lg aspect-square"></div>
                <div className="h-6 bg-slate-700 rounded w-1/3 mt-4"></div>
                <div className="h-4 bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-6 bg-slate-700 rounded w-1/3 mt-6 mb-4"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
        </div>
    );
};

const AudioGenerator: React.FC<{
    text: string;
    onGenerate: (text: string, voiceName: string, voiceStyle: VoiceStyle) => void;
    isLoading: boolean;
    audioUrl: string | null;
    error: string | null;
}> = ({ text, onGenerate, isLoading, audioUrl, error }) => {
    const [selectedVoice, setSelectedVoice] = useState<string>(VOICE_OPTIONS[0].apiName);
    const [selectedStyle, setSelectedStyle] = useState<VoiceStyle>(VOICE_STYLE_OPTIONS[0].value);
    
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string|null>(null);

    const femaleVoices = VOICE_OPTIONS.filter(v => v.gender === 'female');
    const maleVoices = VOICE_OPTIONS.filter(v => v.gender === 'male');

    const selectedVoiceObject = VOICE_OPTIONS.find(v => v.apiName === selectedVoice);
    const selectedVoiceGender = selectedVoiceObject ? (selectedVoiceObject.gender === 'female' ? 'feminina' : 'masculina') : '';


    const handleGenerateClick = () => {
        onGenerate(text, selectedVoice, selectedStyle);
    };

    const handlePreview = async () => {
      setIsPreviewLoading(true);
      setPreviewError(null);
      try {
        const previewText = "Esta é uma demonstração da voz selecionada.";
        const url = await generateAudio(previewText, selectedVoice, VoiceStyle.EDUCATIONAL);
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
        <div className="mt-6 p-4 border-t-2 border-slate-700/50 bg-slate-800 rounded-b-lg">
            <h3 className="text-lg font-semibold text-sky-400 mb-4">Geração de Áudio Avançada</h3>
            
            <div className="space-y-4">
                {/* Style and Voice Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="voiceStyle" className="block text-sm font-medium text-slate-300 mb-2">
                            Estilo da Voz
                        </label>
                        <select
                            id="voiceStyle"
                            value={selectedStyle}
                            onChange={(e) => setSelectedStyle(e.target.value as VoiceStyle)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                        >
                            {VOICE_STYLE_OPTIONS.map(option => (
                               <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="voice" className="block text-sm font-medium text-slate-300 mb-2">
                            Voz Específica
                        </label>
                        <div className="flex gap-2">
                            <select
                                id="voice"
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                            >
                                <optgroup label="Vozes Femininas">
                                    {femaleVoices.map(voice => (
                                        <option key={voice.apiName} value={voice.apiName}>{voice.name}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="Vozes Masculinas">
                                    {maleVoices.map(voice => (
                                        <option key={voice.apiName} value={voice.apiName}>{voice.name}</option>
                                    ))}
                                </optgroup>
                            </select>
                            <button onClick={handlePreview} disabled={isPreviewLoading} title="Ouvir Prévia da Voz" className="p-2 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors disabled:opacity-50">
                                {isPreviewLoading ? 
                                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                                }
                            </button>
                        </div>
                        {selectedVoiceGender && (
                            <p className="text-slate-400 text-sm mt-2 italic">
                                essa voz é {selectedVoiceGender}
                            </p>
                        )}
                        {previewError && <p className="text-red-400 text-xs mt-1">{previewError}</p>}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
            
            {audioUrl && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-slate-300 mb-2">Resultado:</p>
                    <audio controls src={audioUrl} className="w-full">
                        Seu navegador não suporta o elemento de áudio.
                    </audio>
                </div>
            )}
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
  audioError
}) => {
  const [copied, setCopied] = useState(false);
  const isNarrationType = creativeType === CreativeType.UGC_VIDEO || creativeType === CreativeType.MINI_VSL;
  const copyButtonText = isNarrationType ? 'Copiar Narração' : 'Copiar Texto';
  
  const handleCopy = () => {
    if (content?.text) {
        let textToCopy = content.text;
        if (isNarrationType) {
            // Clean the narration text before copying
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
    // Reset copied state when new content is generated
    setCopied(false);
  }, [content]);

  const renderNarrationContent = (text: string) => {
    // This regex finds the AIME markers, e.g., '[A] Awaken:' or '**[I] Inform:**'
    const aimeRegex = /(?:\*{0,2})\[([AIME])\]\s*([^:]+):(?:\*{0,2})/gi;
    const parts = text.split(aimeRegex);
  
    if (parts.length <= 1) {
      const visualCueRegex = /(\([^)]+\))/g;
      return (
        <p className="whitespace-pre-wrap font-sans text-base leading-relaxed">
          {text.split(visualCueRegex).filter(part => part).map((part, index) => {
            if (part.startsWith('(') && part.endsWith(')')) {
              return <span key={index} className="text-slate-400 italic">{part}</span>;
            }
            return <span key={index} className="text-white">{part}</span>;
          })}
        </p>
      );
    }

    const visualCueRegex = /(\([^)]+\))/g;
    const renderedParts = [];

    for (let i = 1; i < parts.length; i += 3) {
        const letter = parts[i];
        const word = parts[i + 1];
        let textBlock = parts[i + 2] || '';

        const narrationParts = textBlock.split(visualCueRegex).filter(part => part);

        renderedParts.push(
            <p key={i} className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                <span className="bg-slate-700/50 text-yellow-400 font-bold p-1 rounded-md mr-2">{`[${letter}] ${word}`}</span>
                {narrationParts.map((part, j) => {
                    if (part.startsWith('(') && part.endsWith(')')) {
                        return <span key={j} className="text-slate-400 italic">{part}</span>;
                    }
                    return <span key={j} className="text-white">{part}</span>;
                })}
            </p>
        );
    }

    return <div className="space-y-4">{renderedParts}</div>;
  };


  const renderContent = () => {
    if (isLoading) {
      return <SkeletonLoader creativeType={creativeType} />;
    }

    if (error) {
      return <p className="text-red-400 bg-red-500/10 p-4 rounded-md border border-red-500/30">{error}</p>;
    }

    if (!content) {
      return (
        <div className="text-center text-slate-500 py-12 md:py-16">
          <p className="text-lg">Seu criativo aparecerá aqui.</p>
          <p>Preencha os campos e clique em "Gerar Criativo" para começar.</p>
        </div>
      );
    }
    
    return (
        <div className="bg-slate-800 rounded-lg">
            <div className="p-4 space-y-4">
                {content.imageUrl && (
                    <div>
                        <img src={content.imageUrl} alt="Criativo gerado por IA" className="rounded-lg border-2 border-slate-700 w-full" />
                    </div>
                )}
                {content.text && !isNarrationType && (
                     <div className="mt-4">
                        <h3 className="text-lg font-semibold text-sky-400 mb-2">Sugestão de Texto para Imagem</h3>
                        <p className="whitespace-pre-wrap font-sans text-base leading-relaxed bg-slate-700/50 p-3 rounded-md">{content.text}</p>
                    </div>
                )}
                {content.text && isNarrationType && renderNarrationContent(content.text)}
            </div>
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
    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-sky-300">Resultado</h2>
        {content && content.text && !isLoading && !error && (
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-1 px-3 rounded-md transition-colors disabled:opacity-50"
                disabled={copied}
            >
                <ClipboardIcon />
                {copied ? 'Copiado!' : copyButtonText}
            </button>
        )}
      </div>
      <div className="prose prose-invert max-w-none">
        {renderContent()}
      </div>
    </div>
  );
};