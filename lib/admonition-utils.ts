export function transformAdmonitions(markdown: string): string {
  const lines = markdown.split('\n');
  const result: string[] = [];
  
  let inAdmonition = false;
  let currentAdmonitionType = '';
  let currentAdmonitionTitle = '';
  
  // Regex to match the start of an admonition: !!! type "Title" or !!! type
  const startRegex = /^!!!\s+([a-zA-Z0-9_-]+)(?:\s+"(.*?)")?\s*$/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (inAdmonition) {
      // Check if line is indented (4 spaces or tab) or empty
      const isIndented = line.startsWith('    ') || line.startsWith('\t');
      const isEmpty = line.trim() === '';
      
      if (isIndented || isEmpty) {
        // Remove indentation (first 4 spaces or 1 tab)
        let contentLine = line;
        if (isIndented) {
          contentLine = line.replace(/^(    |\t)/, '');
        }
        result.push(contentLine);
      } else {
        // End of admonition
        result.push('');
        result.push('</Admonition>');
        result.push('');
        inAdmonition = false;
        // Process current line as normal
        // Check if it's a new admonition immediately?
        const match = line.match(startRegex);
        if (match) {
          inAdmonition = true;
          currentAdmonitionType = match[1];
          currentAdmonitionTitle = match[2] || '';
          
          result.push('');
          result.push(`<Admonition type="${currentAdmonitionType}" title="${currentAdmonitionTitle}">`);
          result.push('');
        } else {
          result.push(line);
        }
      }
    } else {
      const match = line.match(startRegex);
      if (match) {
        inAdmonition = true;
        currentAdmonitionType = match[1];
        currentAdmonitionTitle = match[2] || '';
        
        result.push('');
        result.push(`<Admonition type="${currentAdmonitionType}" title="${currentAdmonitionTitle}">`);
        result.push('');
      } else {
        result.push(line);
      }
    }
  }
  
  // Close any open admonition at the end
  if (inAdmonition) {
    result.push('');
    result.push('</Admonition>');
  }
  
  return result.join('\n');
}
