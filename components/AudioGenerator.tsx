import React, { useState } from 'react';
import { VoiceStyle, VoiceOption } from '../types';
import { VOICE_OPTIONS, VOICE_STYLE_OPTIONS } from '../constants';
import { generateAudio } from '../services/geminiService';

interface AudioGeneratorProps {
    text: string;
    onGenerate: (text: string, voiceName: string, voiceStyle: VoiceStyle, styleHint?: VoiceOption['styleHint']) => void;
    isLoading: boolean;
    audioUrl: string | null;
    error: string | null;
}

const AudioGenerator: React.FC<AudioGeneratorProps> = ({ text, onGenerate, isLoading, audioUrl, error }) => {
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

export default AudioGenerator;