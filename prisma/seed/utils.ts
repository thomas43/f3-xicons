// @ts-nocheck

function normalizeQuotes(text: string): string {
    return text
    .replace(/\u2018|\u2019|\u201A|\uFFFD/g, "'") // smart single quotes and fallback
    .replace(/\u201C|\u201D|\u201E/g, '"')       // smart double quotes
    .replace(/\u02C6/g, '^')
    .replace(/\u2039/g, '<')
    .replace(/\u203A/g, '>')
    .replace(/\u02DC/g, ' ')
    .replace(/\u00A0/g, ' ')                    // non-breaking space
    .replace(/â€™/g, "'")                       // common mojibake: apostrophe
    .replace(/â€œ|â€�/g, '"')                   // common mojibake: double quotes
    .replace(/â€“/g, '-')                       // en dash
    .replace(/â€”/g, '--')                      // em dash
    .replace(/â€¦/g, '...')                     // ellipsis
    .replace(/Ã©/g, 'é')                        // accented chars
    .replace(/Ã/g, 'à');                        // etc — add more as needed
  }
  
  function parseReferences(text: string): string[] {
    const refRegex = /@([\w\s\-]+)/g;
    const matches: string[] = [];
    let match;
    while ((match = refRegex.exec(text)) !== null) {
      matches.push(match[1].trim());
    }
    return matches;
  }
  
  module.exports = {
    normalizeQuotes,
    parseReferences
  };