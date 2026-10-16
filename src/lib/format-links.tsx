import React from "react";

/**
 * Utility per formattare testo semplice rendendo cliccabili sia gli URL normali (https://...)
 * sia i link in formato Markdown ([Etichetta](https://...)), aprendoli in una nuova scheda.
 */
export function formatWithLinks(
  str?: string | null,
  linkColorClass: string = "text-primary-600 hover:text-primary-700 underline font-semibold break-all"
): React.ReactNode {
  if (!str) return null;

  // Regex per catturare Markdown link [label](url) oppure URL plain https?://...
  const combinedRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)|(https?:\/\/[^\s<]+)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combinedRegex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      elements.push(str.substring(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // [Label](url)
      const label = match[1];
      const url = match[2];
      elements.push(
        <a
          key={`md-link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkColorClass}
        >
          {label} <span className="text-xs inline-block ml-0.5">↗</span>
        </a>
      );
    } else if (match[3]) {
      // Plain URL
      let url = match[3];
      let trailing = "";
      const trailMatch = url.match(/([.,;:!?)]+)$/);
      if (trailMatch) {
        trailing = trailMatch[1];
        url = url.substring(0, url.length - trailing.length);
      }
      elements.push(
        <React.Fragment key={`plain-link-${match.index}`}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkColorClass}
          >
            {url} <span className="text-xs inline-block ml-0.5">↗</span>
          </a>
          {trailing}
        </React.Fragment>
      );
    }

    lastIndex = combinedRegex.lastIndex;
  }

  if (lastIndex < str.length) {
    elements.push(str.substring(lastIndex));
  }

  return <>{elements}</>;
}
