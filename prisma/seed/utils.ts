export function normalizeQuotes(text: string): string {
    return text
      .replace(/â€™/g, "’")
      .replace(/â€œ/g, "“")
      .replace(/â€�/g, "”")
      .replace(/â€“/g, "–")
      .replace(/â€”/g, "—");
  }
  
  export function parseReferences(text: string): string[] {
    const refRegex = /@([\w\s\-]+)/g;
    const matches: string[] = [];
    let match;
    while ((match = refRegex.exec(text)) !== null) {
      matches.push(match[1].trim());
    }
    return matches;
  }
  