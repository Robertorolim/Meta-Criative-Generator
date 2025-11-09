import React, { useEffect } from 'react';
import { CreativeType, ImageSize } from '../types';
import { CREATIVE_TYPE_OPTIONS, NICHE_OPTIONS, CTA_OPTIONS, IMAGE_SIZE_OPTIONS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';

interface CreativeGeneratorFormProps {
  selectedNiche: string;
  setSelectedNiche: (niche: string) => void;
  customNiche: string;
  setCustomNiche: (niche: string) => void;
  productDetails: string;
  setProductDetails: (details: string) => void;
  callToAction: string;
  setCallToAction: (cta: string) => void;
  creativeType: CreativeType;
  setCreativeType: (type: CreativeType) => void;
  imageSize: ImageSize;
  setImageSize: (size: ImageSize) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

export const CreativeGeneratorForm: React.FC<CreativeGeneratorFormProps> = ({
  selectedNiche,
  setSelectedNiche,
  customNiche,
  setCustomNiche,
  productDetails,
  setProductDetails,
  callToAction,
  setCallToAction,
  creativeType,
  setCreativeType,
  imageSize,
  setImageSize,
  isLoading,
  onGenerate,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };
  
  const isImageType = [CreativeType.IMAGE_FEED, CreativeType.IMAGE_STORIES, CreativeType.CAROUSEL].includes(creativeType);
  const sizeOptions = IMAGE_SIZE_OPTIONS[creativeType] || [];

  useEffect(() => {
    // Reset image size to the first available option when creative type changes
    if (isImageType && sizeOptions.length > 0) {
        setImageSize(sizeOptions[0].value);
    }
  }, [creativeType, isImageType, sizeOptions, setImageSize]);


  return (
    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 lg:sticky top-24 self-start">
      <h2 className="text-xl font-semibold mb-6 text-sky-300">Defina seu Criativo</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="niche" className="block text-sm font-medium text-slate-300 mb-2">
            1. Qual o seu nicho?
          </label>
          <select
            id="niche"
            value={selectedNiche}
            onChange={(e) => setSelectedNiche(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
          >
            {NICHE_OPTIONS.map((niche) => (
              <option key={niche} value={niche}>
                {niche}
              </option>
            ))}
          </select>
        </div>

        {selectedNiche === 'Outro' && (
          <div>
            <label htmlFor="customNiche" className="block text-sm font-medium text-slate-300 mb-2">
              Digite seu nicho
            </label>
            <input
              type="text"
              id="customNiche"
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="Ex: Criptomoedas para iniciantes"
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="productDetails" className="block text-sm font-medium text-slate-300 mb-2">
            2. Detalhes do Produto/Oferta
          </label>
          <textarea
            id="productDetails"
            value={productDetails}
            onChange={(e) => setProductDetails(e.target.value)}
            placeholder="Ex: Produto em cápsulas, garantia de 30 dias, composto por Cúrcuma e Gengibre..."
            rows={4}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
          />
        </div>
        
        <div>
          <label htmlFor="callToAction" className="block text-sm font-medium text-slate-300 mb-2">
            3. Qual a sua Chamada para Ação (CTA)?
          </label>
          <select
            id="callToAction"
            value={callToAction}
            onChange={(e) => setCallToAction(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
          >
            {CTA_OPTIONS.map((cta) => (
              <option key={cta} value={cta}>
                {cta}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="creativeType" className="block text-sm font-medium text-slate-300 mb-2">
              4. Tipo de criativo?
            </label>
            <select
              id="creativeType"
              value={creativeType}
              onChange={(e) => setCreativeType(e.target.value as CreativeType)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            >
              {CREATIVE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {isImageType && sizeOptions.length > 0 && (
            <div>
                 <label htmlFor="imageSize" className="block text-sm font-medium text-slate-300 mb-2">
                    5. Tamanho da Imagem
                </label>
                <select
                    id="imageSize"
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value as ImageSize)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                >
                    {sizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
          )}
        </div>


        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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