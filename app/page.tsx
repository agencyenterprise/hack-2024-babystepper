'use client';
import { Inter, Merriweather } from 'next/font/google';
import { useState, useRef, useEffect } from "react";

const inter = Inter({ subsets: ['latin'] });
const merriweather = Merriweather({ 
  weight: ['400', '700'],
  style: ['italic'],
  subsets: ['latin'] 
});

export default function Home() {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (solution && resultRef.current) {
      resultRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [solution]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate solution');
      }

      const data = await response.json();
      setSolution(data.solution);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate a solution. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(solution);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className={`flex-grow w-full px-4 pt-16 pb-2 sm:pt-24 ${inter.className} overflow-x-hidden`}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-8 mb-16">
            <div>
              <img
                src="https://i.postimg.cc/0yVxcp77/baby-stepper.png"
                alt="BabyStepper Logo"
                className="w-[120px] h-[120px] mx-auto"
              />
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <h1 className={`${merriweather.className} text-[#2D3436] text-center text-[48px] leading-[48px] tracking-[-1.2px]`}>
                BabyStepper
              </h1>
              <p className="text-[var(--color-text-secondary)] text-xl leading-relaxed text-center max-w-xl">
                Feeling stuck? Take a baby step right now to tackle it!
              </p>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-8">
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your challenge..."
              className="w-full h-40 p-4 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] bg-white border border-[var(--color-border)] rounded-lg resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              required
            />

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white rounded-[9999px] bg-gradient-to-t from-[#2D3436] to-[#636E72] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D3436] transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  'Generate Baby Step'
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {solution && (
            <div 
              ref={resultRef}
              className="mt-16 rounded-lg bg-gradient-to-b from-white to-[#FEF6EE]"
            >
              <div className="p-8 space-y-6">
                <h2 className={`${merriweather.className} text-[#2D3436] text-center text-[24px] italic font-normal leading-[32px] tracking-[-0.6px]`}>
                  Your Next Baby Step
                </h2>
                <p className="text-[var(--color-text-primary)] text-lg leading-relaxed whitespace-pre-wrap">
                  {solution}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] bg-white border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]"
                  >
                    {isCopied ? (
                      <>
                        <svg className="w-4 h-4 mr-2 stroke-current" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2 stroke-current" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-[var(--color-text-secondary)] mt-8 mb-0 py-1">
        Made with ❤️ by{' '}
        <a 
          href="https://ae.studio/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[var(--color-text-primary)] hover:text-[#EEB160] transition-colors duration-200"
        >
          AE Studio
        </a>
      </footer>
    </div>
  );
}
