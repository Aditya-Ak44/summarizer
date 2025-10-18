'use client';

interface TextInputProps {
  content: string;
  setContent: (content: string) => void;
}

export function TextInput({ content, setContent }: TextInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Paste Your Content
      </label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste article text, blog post, or any content here..."
        className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
      />
    </div>
  );
}