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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header Section */}
        <div className="text-center sm:text-left mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            BabyStepper
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Generate small, actionable steps to address problems, prevent issues, or test new concepts.
          </p>
        </div>

        {/* Main Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div>
            <label 
              htmlFor="problem" 
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              What would you like to work on?
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              id="problem"
              name="problem"
              className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[160px] resize-y transition-colors duration-200"
              placeholder="Describe your situation or challenge (e.g., 'I want to improve team communication' or 'We need to reduce customer complaints')..."
              required
              aria-label="Problem or situation description"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Generating Baby Step...
              </>
            ) : (
              'Generate Baby Step'
            )}
          </button>
        </form>

        {/* Results Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Your Next Baby Step
          </h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-slate-200 border-t-blue-600"></div>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap text-slate-600 text-lg">
                {solution || 'Your actionable baby step will appear here...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
