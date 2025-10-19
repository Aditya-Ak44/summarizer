'use client';

import { useState } from 'react';
import { FileUpload } from './components/Fileupload';
import { TextInput } from '../app/components/TextInput';
import { SummaryDisplay } from '../app/components/SummaryDisplay';
import { LoadingSpinner } from '../app/components/LoadingSpinner';

export default function Home() {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSummarize = async () => {
    if (!content.trim()) {
      setError('Please provide some content to summarize');
      return;
    }
    setShowSidebar(true);
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, summaryLength }),
      });

      if (!response.ok) throw new Error('Failed to generate summary');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullSummary = '';

      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullSummary += decoder.decode(value, { stream: true });
        setSummary(fullSummary);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSummary('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar - Input Section */}
        <div
          className={`transition-all duration-500 ease-out overflow-y-auto ${
            showSidebar ? 'w-1/2' : 'w-full'
          }`}
        >
          <div className="p-8 h-full">
            <div className="bg-white rounded-lg shadow-xl p-8 h-full flex flex-col">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                AI Content Summarizer
              </h1>
              <p className="text-gray-600 mb-8">
                Paste text, upload a file, or summarize web content instantly
              </p>

              <div className="space-y-6 flex-1">
                {/* Input Section */}
                <div className="grid grid-cols-1 gap-6">
                  <TextInput content={content} setContent={setContent} />
                  <FileUpload setContent={setContent} />
                </div>

                {/* Summary Length Selection */}
                <div className="flex items-center gap-4">
                  <label className="font-semibold text-gray-700">Summary Length:</label>
                  <div className="flex gap-2">
                    {(['short', 'medium', 'long'] as const).map((length) => (
                      <button
                        key={length}
                        onClick={() => setSummaryLength(length)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          summaryLength === length
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {length.charAt(0).toUpperCase() + length.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
              </div>

              {/* Summarize Button */}
              <button
                onClick={handleSummarize}
                disabled={loading || !content.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors mt-6"
              >
                {loading ? 'Summarizing...' : 'Summarize Content'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Summary Display */}
        {showSidebar && (
          <div className="w-1/2 bg-white border-l border-gray-200 overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="p-8 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800"></h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                >
                  ×
                </button>
              </div>

              {loading && <LoadingSpinner />}

              {summary && (
                <div className="flex-1 overflow-y-auto">
                  <SummaryDisplay summary={summary} />
                </div>
              )}

              {error && !loading && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}