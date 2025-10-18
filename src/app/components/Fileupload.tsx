'use client';

import { ChangeEvent } from 'react';

interface FileUploadProps {
  setContent: (content: string) => void;
}

export function FileUpload({ setContent }: FileUploadProps) {
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setContent(text);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Or Upload a File
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer">
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".txt,.pdf,.md"
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="text-gray-600">
            <p className="font-semibold">📁 Choose File</p>
            <p className="text-sm">TXT, PDF, or Markdown</p>
          </div>
        </label>
      </div>
    </div>
  );
}