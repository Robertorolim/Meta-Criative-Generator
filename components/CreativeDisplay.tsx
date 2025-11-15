import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { GeneratedContent, CreativeType, VoiceStyle, VoiceOption } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

// Lazy load the AudioGenerator component
const AudioGenerator = lazy(() => import('./AudioGenerator'));


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

const SkeletonLoader: React.FC = () => {
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
  const copyButtonText = 'Copiar Narração';
  
  const handleCopy = () => {
    if (content?.text) {
        let textToCopy = content.text;
        // Clean visual cues and AIME tags for easier pasting
        textToCopy = textToCopy.replace(/\([^)]*\)/g, "");
        textToCopy = textToCopy.replace(/\[[A-Z]\]/g, '');
        textToCopy = textToCopy.trim().replace(/\s+/g, ' ');
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
    const AIME_LABELS: Record<string, { label: string; description: string; color: string; bgColor: string; borderColor: string; }> = {
      '[A]': { label: 'A', description: 'Awaken', color: 'text-pink-300', bgColor: 'bg-pink-900/50', borderColor: 'border-pink-500/50' },
      '[I]': { label: 'I', description: 'Inform', color: 'text-cyan-300', bgColor: 'bg-cyan-900/50', borderColor: 'border-cyan-500/50' },
      '[M]': { label: 'M', description: 'Mechanism', color: 'text-green-300', bgColor: 'bg-green-900/50', borderColor: 'border-green-500/50' },
      '[E]': { label: 'E', description: 'Evoke', color: 'text-purple-300', bgColor: 'bg-purple-900/50', borderColor: 'border-purple-500/50' },
    };

    const visualCueRegex = /(\([^)]+\))/g;
    const aimeTagRegex = /(\[[AIME]\])/g;
    const parts = text.split(aimeTagRegex).filter(part => part && part.trim() !== '');

    // Fallback for when AIME tags are not present in the response
    if (parts.length <= 1 || !parts.some(p => p.match(/^\[[AIME]\]$/))) {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-sky-300 mb-2">Roteiro (Narração e Visuais)</h3>
            <div className="whitespace-pre-wrap text-gray-300 text-base leading-relaxed bg-white/5 p-4 rounded-lg">
              {text.split(visualCueRegex).filter(part => part).map((part, index) => {
                if (part.startsWith('(') && part.endsWith(')')) {
                  return <span key={index} className="text-amber-400 italic">{part}</span>;
                }
                return <span key={index}>{part}</span>;
              })}
            </div>
          </div>
        );
    }
    
    const structuredSections: { aimeTag: string; content: string }[] = [];
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].match(/^\[[AIME]\]$/) && parts[i+1]) {
            structuredSections.push({ aimeTag: parts[i], content: parts[i + 1] });
            i++; // Skip the content part
        }
    }
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-sky-300 mb-2">Roteiro Estruturado (A.I.M.E.)</h3>
        <div className="space-y-6">
          {structuredSections.map((section, index) => {
              const aimeInfo = AIME_LABELS[section.aimeTag];
              if (!aimeInfo) return null;

              return (
                <div key={index} className={`p-4 rounded-lg border ${aimeInfo.borderColor} ${aimeInfo.bgColor}`}>
                    <div className={`flex items-center gap-3 mb-3`}>
                        <span className={`flex-shrink-0 font-bold text-lg h-8 w-8 rounded-full flex items-center justify-center ${aimeInfo.color} bg-white/5 border-2 ${aimeInfo.borderColor}`}>
                            {aimeInfo.label}
                        </span>
                        <span className={`font-bold text-lg ${aimeInfo.color}`}>
                            {aimeInfo.description}
                        </span>
                    </div>
                    <div className="whitespace-pre-wrap text-gray-300 text-base leading-relaxed pl-1">
                      {section.content.split(visualCueRegex).filter(part => part).map((part, partIndex) => {
                          if (part.startsWith('(') && part.endsWith(')')) {
                            return <span key={partIndex} className="text-amber-400 italic">{part}</span>;
                          }
                          return <span key={partIndex}>{part.trim()} </span>;
                      })}
                    </div>
                </div>
              )
          })}
        </div>
      </div>
    );
  };


  const renderContent = () => {
    if (isLoading) {
      return <SkeletonLoader />;
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
    
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {content.text && renderNarrationContent(content.text)}
            </div>

            {content.text && (
                <div className="pt-6 border-t border-white/10">
                    <button
                        onClick={() => onGenerateVariation(content.text!)}
                        disabled={isVariationLoading}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold py-2.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-indigo-500/40"
                    >
                        {isVariationLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Criando Variação...
                            </>
                        ) : 'Gerar Variação do Roteiro'}
                    </button>
                </div>
            )}
            {content.text && (
                 <Suspense fallback={<div className="text-center p-8 text-gray-400">Carregando gerador de áudio...</div>}>
                    <AudioGenerator 
                        text={content.text}
                        onGenerate={onGenerateAudio}
                        isLoading={isAudioLoading}
                        audioUrl={audioUrl}
                        error={audioError}
                    />
                </Suspense>
            )}
        </div>
    );
  };

  return (
    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg shadow-2xl shadow-black/20 min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400">Resultado</h2>
        {content && content.text && !isLoading && !error && (
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