import React, { useEffect, useState, useRef } from 'react';
import { CreativeType, ImageSize, AwarenessLevel, LanguageType } from '../types';
import { CREATIVE_TYPE_OPTIONS, NICHE_OPTIONS, HOOK_OPTIONS_BY_AWARENESS, IMAGE_SIZE_OPTIONS, AWARENESS_LEVEL_OPTIONS, LANGUAGE_TYPE_OPTIONS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';

interface CreativeGeneratorFormProps {
  selectedNiche: string;
  setSelectedNiche: (niche: string) => void;
  customNiche: string;
  setCustomNiche: (niche: string) => void;
  awarenessLevel: AwarenessLevel;
  setAwarenessLevel: (level: AwarenessLevel) => void;
  languageType: LanguageType;
  setLanguageType: (type: LanguageType) => void;
  productDetails: string;
  setProductDetails: (details: string) => void;
  targetGender: string;
  setTargetGender: (gender: string) => void;
  targetAge: string;
  setTargetAge: (age: string) => void;
  selectedHook: string;
  setSelectedHook: (hook: string) => void;
  creativeType: CreativeType;
  setCreativeType: (type: CreativeType) => void;
  imageSize: ImageSize;
  setImageSize: (size: ImageSize) => void;
  isLoading: boolean;
  onGenerate: () => void;
  productDetailsHistory: string[];
  onSelectFromHistory: (details: string) => void;
  carouselSlidesCount: number;
  setCarouselSlidesCount: (count: number) => void;
  productImageFile: File | null;
  setProductImageFile: (file: File | null) => void;
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
  awarenessLevel,
  setAwarenessLevel,
  languageType,
  setLanguageType,
  productDetails,
  setProductDetails,
  targetGender,
  setTargetGender,
  targetAge,
  setTargetAge,
  selectedHook,
  setSelectedHook,
  creativeType,
  setCreativeType,
  imageSize,
  setImageSize,
  isLoading,
  onGenerate,
  productDetailsHistory,
  onSelectFromHistory,
  carouselSlidesCount,
  setCarouselSlidesCount,
  productImageFile,
  setProductImageFile,
}) => {
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };
  
  const isImageType = [CreativeType.IMAGEM_UNICA, CreativeType.CARROSSEL].includes(creativeType);
  const sizeOptions = IMAGE_SIZE_OPTIONS[creativeType] || [];
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


  useEffect(() => {
    if (isImageType && sizeOptions.length > 0 && !sizeOptions.find(opt => opt.value === imageSize)) {
        setImageSize(sizeOptions[0].value);
    }
  }, [creativeType, isImageType, sizeOptions, setImageSize, imageSize]);

  useEffect(() => {
    if (productImageFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProductImagePreview(reader.result as string);
        };
        reader.readAsDataURL(productImageFile);
    } else {
        setProductImagePreview(null);
    }
  }, [productImageFile]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImageFile(file);
    }
  };

  const removeProductImage = () => {
      setProductImageFile(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  };


  return (
    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg lg:sticky top-28 self-start shadow-2xl shadow-black/20">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400">Defina seu Criativo</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <FormSection number={1} title="Nicho de Mercado">
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
        </FormSection>

        <FormSection number={2} title="Público-Alvo">
            <div>
                <label htmlFor="targetGender" className="block text-sm font-medium text-gray-300 mb-2">Gênero</label>
                <select
                    id="targetGender"
                    value={targetGender}
                    onChange={(e) => setTargetGender(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                >
                    <option value="Ambos" className="bg-gray-800">Ambos</option>
                    <option value="Homem" className="bg-gray-800">Homem</option>
                    <option value="Mulher" className="bg-gray-800">Mulher</option>
                </select>
            </div>
            <div>
                <label htmlFor="targetAge" className="block text-sm font-medium text-gray-300 mb-2">Idade</label>
                <input
                    type="text"
                    id="targetAge"
                    value={targetAge}
                    onChange={(e) => setTargetAge(e.target.value)}
                    placeholder="Ex: 25-34"
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                />
            </div>
        </FormSection>

        <FormSection number={3} title="Nível de Consciência">
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

        <FormSection number={4} title="Tipo de Linguagem">
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

        <FormSection number={5} title="Detalhes do Produto/Oferta">
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
        
        <FormSection number={6} title="Estrutura do Criativo / Gancho">
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
        
        <FormSection number={7} title="Formato do Criativo">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                id="creativeType"
                value={creativeType}
                onChange={(e) => setCreativeType(e.target.value as CreativeType)}
                className={`w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition ${!isImageType ? 'sm:col-span-2' : ''}`}
                >
                {CREATIVE_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                    </option>
                ))}
                </select>
            {isImageType && sizeOptions.length > 0 && (
                    <select
                        id="imageSize"
                        value={imageSize}
                        onChange={(e) => setImageSize(e.target.value as ImageSize)}
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    >
                        {sizeOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-gray-800">
                                {option.label}
                            </option>
                        ))}
                    </select>
            )}
            {creativeType === CreativeType.CARROSSEL && (
                 <div className="sm:col-span-2">
                     <label htmlFor="carouselSlides" className="block text-sm font-medium text-gray-300 mb-2">Nº de Slides do Carrossel</label>
                     <input
                        type="number"
                        id="carouselSlides"
                        value={carouselSlidesCount}
                        onChange={(e) => setCarouselSlidesCount(parseInt(e.target.value, 10))}
                        min="2"
                        max="5"
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                     />
                 </div>
            )}
            </div>
             {isImageType && (
                <div className="mt-4">
                    <label htmlFor="productImage" className="block text-sm font-medium text-gray-300 mb-2">Imagem do Produto (Opcional)</label>
                    <input
                        type="file"
                        id="productImage"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/webp"
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-500/20 file:text-sky-300 hover:file:bg-sky-500/30 transition"
                    />
                    {productImagePreview && (
                        <div className="mt-4 relative w-32 h-32">
                            <img src={productImagePreview} alt="Prévia do produto" className="rounded-lg object-cover w-full h-full" />
                            <button
                                type="button"
                                onClick={removeProductImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold"
                                title="Remover Imagem"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                </div>
            )}
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