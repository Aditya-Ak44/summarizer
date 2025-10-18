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

  const handleSummarize = async () => {
    if (!content.trim()) {
      setError('Please provide some content to summarize');
      return;
    }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Content Summarizer
          </h1>
          <p className="text-gray-600 mb-8">
            Paste text, upload a file, or summarize web content instantly
          </p>

          <div className="space-y-6">
            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Summarize Button */}
            <button
              onClick={handleSummarize}
              disabled={loading || !content.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Summarizing...' : 'Summarize Content'}
            </button>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && <LoadingSpinner />}

            {/* Summary Display */}
            {summary && <SummaryDisplay summary={summary} />}
          </div>
        </div>
      </div>
    </div>
  );
}