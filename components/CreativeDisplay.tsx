import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { GeneratedContent, CreativeType, VoiceStyle, VoiceOption, ScriptSection } from '../types';
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
  onGenerateVariation: (customCTA?: string) => void;
  isVariationLoading: boolean;
  onGenerateImage: (prompt: string) => void;
  isImageLoading: boolean;
  imageError: string | null;
}

const SkeletonLoader: React.FC = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                <div className="h-20 bg-white/10 rounded w-full"></div>
            </div>
            <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                <div className="h-20 bg-white/10 rounded w-full"></div>
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
  onGenerateImage,
  isImageLoading,
  imageError
}) => {
  const [copied, setCopied] = useState(false);
  const [editedCTA, setEditedCTA] = useState<string>('');
  const copyButtonText = 'Copiar Texto';

  useEffect(() => {
      if (content?.structuredScript) {
          const evokeSection = content.structuredScript.find(s => s.section === 'E');
          if (evokeSection) {
              setEditedCTA(evokeSection.narration);
          } else {
              setEditedCTA('');
          }
      }
  }, [content]);
  
  // Helper to get clean full text from content, using edited CTA if available
  const getFullNarration = (): string => {
      if (content?.structuredScript) {
          return content.structuredScript.map(s => {
              if (s.section === 'E' && editedCTA) {
                  return editedCTA;
              }
              return s.narration;
          }).join(' ');
      }
      return content?.rawText || '';
  };

  const handleCopy = () => {
    const textToCopy = getFullNarration();
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
    }
  };

  const handleGenerateAudioWrapper = (textIgnored: string, voiceName: string, voiceStyle: VoiceStyle, styleHint?: VoiceOption['styleHint']) => {
      // We ignore the passed text from the child component if we have structured data, 
      // to ensure we send the clean concatenated narration with edits.
      const cleanText = getFullNarration();
      onGenerateAudio(cleanText, voiceName, voiceStyle, styleHint);
  };

  const handleVariationClick = () => {
      // Pass the edited CTA to the variation generator so it respects the user's change
      onGenerateVariation(editedCTA);
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

  const renderStructuredScript = (script: ScriptSection[]) => {
    const AIME_LABELS: Record<string, { label: string; description: string; color: string; bgColor: string; borderColor: string; }> = {
      'A': { label: 'A', description: 'Awaken (Gancho)', color: 'text-pink-300', bgColor: 'bg-pink-900/20', borderColor: 'border-pink-500/30' },
      'I': { label: 'I', description: 'Inform', color: 'text-cyan-300', bgColor: 'bg-cyan-900/20', borderColor: 'border-cyan-500/30' },
      'M': { label: 'M', description: 'Mechanism', color: 'text-green-300', bgColor: 'bg-green-900/20', borderColor: 'border-green-500/30' },
      'E': { label: 'E', description: 'Evoke (CTA)', color: 'text-purple-300', bgColor: 'bg-purple-900/20', borderColor: 'border-purple-500/30' },
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-sky-300 mb-2">Roteiro Estruturado (A.I.M.E.)</h3>
        <div className="space-y-6">
          {script.map((section, index) => {
              const aimeInfo = AIME_LABELS[section.section];
              const isAwaken = section.section === 'A';
              const isEvoke = section.section === 'E';
              
              return (
                <div key={index} className={`relative p-5 rounded-xl border ${aimeInfo?.borderColor || 'border-white/10'} ${aimeInfo?.bgColor || 'bg-white/5'} transition-all hover:bg-opacity-40`}>
                    <div className={`flex items-center gap-3 mb-3 border-b border-white/5 pb-2`}>
                        <span className={`flex-shrink-0 font-bold text-lg h-8 w-8 rounded-full flex items-center justify-center ${aimeInfo?.color} bg-black/20 border-2 ${aimeInfo?.borderColor}`}>
                            {aimeInfo?.label || section.section}
                        </span>
                        <span className={`font-bold text-base ${aimeInfo?.color}`}>
                            {aimeInfo?.description}
                        </span>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold">Narração (Áudio)</h4>
                            {isEvoke ? (
                                <textarea 
                                    value={editedCTA}
                                    onChange={(e) => setEditedCTA(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-gray-200 text-base leading-relaxed focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-y min-h-[100px]"
                                    placeholder="Edite o CTA aqui..."
                                />
                            ) : (
                                <p className="text-gray-200 text-base leading-relaxed">{section.narration}</p>
                            )}
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 h-fit">
                             <h4 className="text-xs uppercase tracking-wider text-amber-400/80 mb-1 font-semibold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                Visual Sugerido
                             </h4>
                            <p className="text-gray-400 text-sm italic">{section.visual_cue}</p>
                            
                            {/* Button to generate image for the Hook (Awaken) */}
                            {isAwaken && !content?.imageUrl && (
                                <button 
                                    onClick={() => onGenerateImage(section.visual_cue)}
                                    disabled={isImageLoading}
                                    className="mt-3 text-xs bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/30 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 w-full justify-center"
                                >
                                    {isImageLoading ? 'Gerando Visual...' : 'Gerar Imagem de Referência'}
                                </button>
                            )}
                        </div>
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
        <div className="text-center text-gray-500 py-16 flex flex-col items-center justify-center h-full">
          <div className="bg-white/5 p-4 rounded-full mb-4">
             <SparklesIcon />
          </div>
          <p className="text-lg mt-2 font-semibold text-gray-300">Seu criativo aparecerá aqui</p>
          <p className="max-w-xs text-gray-500 mt-2">Preencha os campos ao lado e clique em "Gerar Criativo" para utilizar a metodologia Andrômeda.</p>
        </div>
      );
    }
    
    return (
        <div className="space-y-8">
            {/* Image Display Section */}
            {content.imageUrl && (
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
                    <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-sky-300 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            Referência Visual (Gancho)
                        </h3>
                        <a href={content.imageUrl} download="reference-image.png" target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-white">Download</a>
                    </div>
                    <div className="relative aspect-[9/16] md:aspect-video w-full bg-gray-900 flex items-center justify-center">
                        <img src={content.imageUrl} alt="Generated Creative Reference" className="max-h-[400px] w-auto object-contain mx-auto" />
                    </div>
                </div>
            )}
            
            {imageError && (
                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {imageError}
                </div>
            )}

            <div className="space-y-4">
                {content.structuredScript ? renderStructuredScript(content.structuredScript) : (
                    <div className="whitespace-pre-wrap text-gray-300 text-base leading-relaxed bg-white/5 p-4 rounded-lg">
                        {content.rawText}
                    </div>
                )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
                 <button
                    onClick={handleVariationClick}
                    disabled={isVariationLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-indigo-300 font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-500/30 hover:border-indigo-500/50"
                >
                    {isVariationLoading ? 'Criando Variação...' : '🔄 Gerar Variação (Com CTA Editado)'}
                </button>
            </div>

            <Suspense fallback={<div className="text-center p-4 bg-white/5 rounded-lg text-sm">Carregando estúdio de áudio...</div>}>
                <AudioGenerator 
                    text={getFullNarration()} // Just passed for display/preview, actual generation uses wrapper
                    onGenerate={handleGenerateAudioWrapper}
                    isLoading={isAudioLoading}
                    audioUrl={audioUrl}
                    error={audioError}
                />
            </Suspense>
        </div>
    );
  };

  return (
    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg shadow-2xl shadow-black/20 min-h-[600px]">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400">
            Resultado
        </h2>
        {content && !isLoading && !error && (
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-indigo-900/20"
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