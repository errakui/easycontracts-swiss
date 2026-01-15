"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";

interface ContractPromptProps {
  onGenerate?: (prompt: string) => void;
}

export default function ContractPrompt({ onGenerate }: ContractPromptProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const examplePrompts = [
    "Contratto freelance per web designer, 3 mesi, €3000, da remoto",
    "NDA per startup tecnologica con clausola di non concorrenza",
    "Contratto affitto appartamento 80mq a Milano, €1200/mese",
    "Accordo partnership tra due società per progetto e-commerce",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Simula chiamata AI
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    if (onGenerate) {
      onGenerate(prompt);
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="card p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-primary p-3 rounded-xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prompt AI</h2>
          <p className="text-gray-600">Descrivi il contratto che ti serve</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Es: Ho bisogno di un contratto per un freelancer web designer, durata 3 mesi, €3000, lavoro da remoto con possibilità di rinnovo..."
            disabled={isGenerating}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-500">
            {prompt.length}/500 caratteri
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 w-5 h-5 animate-spin" />
                Generazione...
              </>
            ) : (
              <>
                <Send className="mr-2 w-5 h-5" />
                Genera con AI
              </>
            )}
          </button>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            💡 Esempi di prompt:
          </p>
          <div className="space-y-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(example)}
                className="block w-full text-left text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg transition-colors"
                disabled={isGenerating}
              >
                &quot;{example}&quot;
              </button>
            ))}
          </div>
        </div>
      </form>

      <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
        <p className="text-sm text-primary-800">
          <strong>Tip:</strong> Più dettagli fornisci (importo, durata, modalità di lavoro, clausole speciali), più preciso sarà il contratto generato dall&apos;AI.
        </p>
      </div>
    </div>
  );
}

