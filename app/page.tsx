'use client';
import { useState } from "react";

export default function Home() {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || 'Failed to get baby step');
      }

      if (data.error) {
        throw new Error(data.error);
      }
      
      setSolution(data.solution);
    } catch (error: any) {
      console.error('Error details:', error);
      setSolution(`An error occurred: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-2">BabyStepper</h1>
          <p className="text-gray-600 mb-6">Generate small, actionable steps to address problems, prevent issues, or test new concepts.</p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="problem" className="block text-sm font-medium mb-2">
                What would you like to work on?
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                id="problem"
                name="problem"
                className="w-full p-3 border border-gray-300 rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="Describe your situation or challenge (e.g., 'I want to improve team communication' or 'We need to reduce customer complaints')..."
                required
                aria-label="Problem or situation description"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {isLoading ? 'Generating Baby Step...' : 'Generate Baby Step'}
            </button>
          </form>
          
          <div className="mt-8 p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-2">Your Next Baby Step</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-gray-600">
                {solution || 'Your actionable baby step will appear here...'}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
