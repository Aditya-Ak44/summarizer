'use client';

interface SummaryDisplayProps {
    summary: string;
}

export function SummaryDisplay({ summary }: SummaryDisplayProps) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(summary);
        alert('Summary copied to clipboard!');
    };
    const renderFormattedSummary = () => {
        const lines = summary.split('\n');
        const elements = [];
        let currentParagraph: string[] = [];

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            if (trimmedLine === '') {
                if (currentParagraph.length > 0) {
                    elements.push(
                        <p key={`p-${index}`} className="text-gray-700 leading-relaxed mb-4">
                            {currentParagraph.join(' ')}
                        </p>
                    );
                    currentParagraph = [];
                }
            } else if (trimmedLine.match(/^\*\*.*\*\*$/)) {
                if (currentParagraph.length > 0) {
                    elements.push(
                        <p key={`p-${index}`} className="text-gray-700 leading-relaxed mb-4">
                            {currentParagraph.join(' ')}
                        </p>
                    );
                    currentParagraph = [];
                }

                const headingText = trimmedLine.replace(/\*\*/g, '');
                elements.push(
                    <h3 key={`h-${index}`} className="text-lg font-bold text-gray-800 mt-4 mb-3">
                        {headingText}
                    </h3>
                );
            } else if (trimmedLine.match(/^[-•*]\s/) || trimmedLine.match(/^\d+\.\s/)) {
                if (currentParagraph.length > 0) {
                    elements.push(
                        <p key={`p-${index}`} className="text-gray-700 leading-relaxed mb-4">
                            {currentParagraph.join(' ')}
                        </p>
                    );
                    currentParagraph = [];
                }

                const bulletText = trimmedLine.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '');
                elements.push(
                    <li key={`li-${index}`} className="text-gray-700 leading-relaxed ml-6 mb-2">
                        {bulletText}
                    </li>
                );
            } else {
                currentParagraph.push(trimmedLine);
            }
        });

        if (currentParagraph.length > 0) {
            elements.push(
                <p key={`p-final`} className="text-gray-700 leading-relaxed">
                    {currentParagraph.join(' ')}
                </p>
            );
        }

        return elements;
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-800">Summary</h2>
                <button
                    onClick={copyToClipboard}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    📋 Copy
                </button>
            </div>
            <div className="prose prose-sm max-w-none">
                <ul className="list-disc space-y-1">
                    {renderFormattedSummary()}
                </ul>
            </div>
        </div>
    );
}