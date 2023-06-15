import React from "react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeHighlight = ({description}) => {
    if (!description || typeof description !== "string") {
        return null; // Return null or any fallback content if description is invalid
    }

    const regex = /```([^`]+)```/g;
    let currentIndex = 0;
    const elements = [];

    let match;
    while ((match = regex.exec(description)) !== null) {
        const code = match[1].trim();
        const language = match[1].split("\n")[0].trim().toLowerCase();

        console.log(code);
        console.log(language);

        if (currentIndex < match.index) {
            const text = description.substring(currentIndex, match.index);
            elements.push(<span key={currentIndex}>{text}</span>);
        }

        elements.push(
            <SyntaxHighlighter
                key={match.index}
                language={language}
                style={vscDarkPlus}
                className="rounded-md"
            >
                {code}
            </SyntaxHighlighter>
        );

        currentIndex = match.index + match[0].length;
    }

    if (currentIndex < description.length) {
        const text = description.substring(currentIndex);
        elements.push(<span key={currentIndex}>{text}</span>);
    }

    return <>{elements}</>;
};

export default CodeHighlight;
