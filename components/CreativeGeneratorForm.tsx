
import React, { useEffect } from 'react';
import { CreativeType, AwarenessLevel, LanguageType, TargetGender } from '../types';
import { CREATIVE_TYPE_OPTIONS, NICHE_OPTIONS, HOOK_OPTIONS_BY_AWARENESS, AWARENESS_LEVEL_OPTIONS, LANGUAGE_TYPE_OPTIONS, GENDER_OPTIONS, AGE_OPTIONS, CTA_OPTIONS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';

interface CreativeGeneratorFormProps {
  selectedNiche: string;
  setSelectedNiche: (niche: string) => void;
  customNiche: string;
  setCustomNiche: (niche: string) => void;
  targetGender: TargetGender;
  setTargetGender: (gender: TargetGender) => void;
  targetAge: string;
  setTargetAge: (age: string) => void;
  awarenessLevel: AwarenessLevel;
  setAwarenessLevel: (level: AwarenessLevel) => void;
  languageType: LanguageType;
  setLanguageType: (type: LanguageType) => void;
  productDetails: string;
  setProductDetails: (details: string) => void;
  selectedHook: string;
  setSelectedHook: (hook: string) => void;
  creativeType: CreativeType;
  setCreativeType: (type: CreativeType) => void;
  selectedCTA: string;
  setSelectedCTA: (cta: string) => void;
  customCTA: string;
  setCustomCTA: (cta: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
  productDetailsHistory: string[];
  onSelectFromHistory: (details: string) => void;
}

const FormSection: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <fieldset className="border-t border-white/10 pt-6">
        <legend className="text-base font-semibold text-gray-200 mb-4">
            <span className="bg-sky-500/20 text-sky-300 text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center mr-3 float-left">{number}</span>
            {title}
        </legend>
        <div className="space-y-4 pl-10">
            {children}
        </div>
    </fieldset>
);

export const CreativeGeneratorForm: React.FC<CreativeGeneratorFormProps> = ({
  selectedNiche,
  setSelectedNiche,
  customNiche,
  setCustomNiche,
  targetGender,
  setTargetGender,
  targetAge,
  setTargetAge,
  awarenessLevel,
  setAwarenessLevel,
  languageType,
  setLanguageType,
  productDetails,
  setProductDetails,
  selectedHook,
  setSelectedHook,
  creativeType,
  setCreativeType,
  selectedCTA,
  setSelectedCTA,
  customCTA,
  setCustomCTA,
  isLoading,
  onGenerate,
  productDetailsHistory,
  onSelectFromHistory,
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };
  
  const selectedAwarenessDescription = AWARENESS_LEVEL_OPTIONS.find(opt => opt.value === awarenessLevel)?.description;
  const selectedLanguageDescription = LANGUAGE_TYPE_OPTIONS.find(opt => opt.value === languageType)?.description;
  
  const availableHooks = HOOK_OPTIONS_BY_AWARENESS[awarenessLevel] || [];

  useEffect(() => {
    // When awareness level changes, update the selected hook to the first available one for the new level.
    const newHooks = HOOK_OPTIONS_BY_AWARENESS[awarenessLevel] || [];
    if (newHooks.length > 0 && newHooks[0].value !== selectedHook) {
        setSelectedHook(newHooks[0].value);
    }
  }, [awarenessLevel, setSelectedHook, selectedHook]);


  return (
    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg lg:sticky top-28 self-start shadow-2xl shadow-black/20">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400">Defina seu Criativo</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <FormSection number={1} title="Nicho e Público Alvo">
            <div className="space-y-4">
                <div>
                    <label htmlFor="niche" className="block text-xs font-medium text-gray-400 mb-1">Nicho de Mercado</label>
                    <select
                        id="niche"
                        value={selectedNiche}
                        onChange={(e) => setSelectedNiche(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    >
                        {NICHE_OPTIONS.map((niche) => (
                        <option key={niche} value={niche} className="bg-gray-800">
                            {niche}
                        </option>
                        ))}
                    </select>
                </div>

                {selectedNiche === 'Outro' && (
                    <input
                    type="text"
                    id="customNiche"
                    value={customNiche}
                    onChange={(e) => setCustomNiche(e.target.value)}
                    placeholder="Ex: Criptomoedas para iniciantes"
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    required
                    />
                )}

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="gender" className="block text-xs font-medium text-gray-400 mb-1">Gênero</label>
                        <select
                            id="gender"
                            value={targetGender}
                            onChange={(e) => setTargetGender(e.target.value as TargetGender)}
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none transition"
                        >
                            {GENDER_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-gray-800">{opt.label}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="age" className="block text-xs font-medium text-gray-400 mb-1">Faixa Etária</label>
                        <select
                            id="age"
                            value={targetAge}
                            onChange={(e) => setTargetAge(e.target.value)}
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none transition"
                        >
                             {AGE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt} className="bg-gray-800">{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </FormSection>

        <FormSection number={2} title="Nível de Consciência">
            <select
                id="awarenessLevel"
                value={awarenessLevel}
                onChange={(e) => setAwarenessLevel(e.target.value as AwarenessLevel)}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            >
                {AWARENESS_LEVEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                        {option.label}
                    </option>
                ))}
            </select>
            {selectedAwarenessDescription && (
                <div className="mt-2 text-xs text-gray-400 bg-white/5 p-3 rounded-md border border-white/10">
                    <p>{selectedAwarenessDescription}</p>
                </div>
            )}
        </FormSection>

        <FormSection number={3} title="Tipo de Linguagem">
            <select
                id="languageType"
                value={languageType}
                onChange={(e) => setLanguageType(e.target.value as LanguageType)}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            >
                {LANGUAGE_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                        {option.label}
                    </option>
                ))}
            </select>
            {selectedLanguageDescription && (
                <div className="mt-2 text-xs text-gray-400 bg-white/5 p-3 rounded-md border border-white/10">
                    <p>{selectedLanguageDescription}</p>
                </div>
            )}
        </FormSection>

        <FormSection number={4} title="Detalhes do Produto/Oferta">
            <textarea
                id="productDetails"
                value={productDetails}
                onChange={(e) => setProductDetails(e.target.value)}
                placeholder="Ex: Produto em cápsulas, garantia de 30 dias, composto por Cúrcuma e Gengibre..."
                rows={4}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            />
            {productDetailsHistory.length > 0 && (
                <div className="pt-2">
                <p className="text-xs text-gray-400 mb-2">Usar detalhes anteriores:</p>
                <div className="flex flex-wrap gap-2">
                    {productDetailsHistory.map((details, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => onSelectFromHistory(details)}
                        className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 text-xs font-medium px-3 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                        title={details}
                    >
                        {details.length > 30 ? `${details.substring(0, 30)}...` : details}
                    </button>
                    ))}
                </div>
                </div>
            )}
        </FormSection>
        
        <FormSection number={5} title="Estrutura do Criativo / Gancho">
          <select
            id="hook"
            value={selectedHook}
            onChange={(e) => setSelectedHook(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
          >
            {availableHooks.map((hook) => (
              <option key={hook.value} value={hook.value} className="bg-gray-800">
                {hook.label}
              </option>
            ))}
          </select>
        </FormSection>
        
        <FormSection number={6} title="Formato do Criativo">
            <div className="grid grid-cols-1 gap-4">
                <select
                id="creativeType"
                value={creativeType}
                onChange={(e) => setCreativeType(e.target.value as CreativeType)}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                >
                {CREATIVE_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                    </option>
                ))}
                </select>
            </div>
        </FormSection>

        <FormSection number={7} title="Chamada para Ação (CTA)">
            <div className="space-y-4">
                 <div>
                    <label htmlFor="cta" className="block text-xs font-medium text-gray-400 mb-1">Escolha a CTA</label>
                    <select
                        id="cta"
                        value={selectedCTA}
                        onChange={(e) => setSelectedCTA(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    >
                        {CTA_OPTIONS.map((cta) => (
                        <option key={cta} value={cta} className="bg-gray-800">
                            {cta}
                        </option>
                        ))}
                    </select>
                </div>
                {selectedCTA === 'Outro (Personalizado)' && (
                    <div>
                        <label htmlFor="customCTA" className="block text-xs font-medium text-gray-400 mb-1">Sua CTA Personalizada</label>
                        <input
                        type="text"
                        id="customCTA"
                        value={customCTA}
                        onChange={(e) => setCustomCTA(e.target.value)}
                        placeholder="Ex: Clique para falar no WhatsApp agora!"
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                        required
                        />
                    </div>
                )}
            </div>
        </FormSection>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-sky-500"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando...
            </>
          ) : (
            <>
              <SparklesIcon />
              Gerar Criativo
            </>
          )}
        </button>
      </form>
    </div>
  );
};
