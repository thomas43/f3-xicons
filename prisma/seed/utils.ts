// @ts-nocheck

function normalizeQuotes(text: string): string {
    return text
    // Replace common mojibake sequences
    .replace(/â€™/g, "'")     // apostrophe
    .replace(/â€œ|â€�/g, '"') // quotes
    .replace(/â€“/g, '-')     // en dash
    .replace(/â€”/g, '--')    // em dash
    .replace(/â€¦/g, '...')   // ellipsis
    .replace(/Ã©/g, 'é')
    .replace(/Ã/g, 'à')

    // Replace junk characters like � (U+FFFD)
    .replace(/\uFFFD/g, '')   // unknown replacement char
    .replace(/[ï¿½]+/g, '')   // additional garbage

    // Replace smart quotes
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')

    // Other substitutions
    .replace(/\u02C6/g, '^')
    .replace(/\u2039/g, '<')
    .replace(/\u203A/g, '>')
    .replace(/\u02DC/g, ' ')
    .replace(/\u00A0/g, ' ') // non-breaking space

    .trim();
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