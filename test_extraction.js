
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function dedent(str) {
    const lines = str.split('\n');
    if (lines.length > 0 && lines[0].trim() === '') lines.shift();
    if (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();

    let minIndent = Infinity;
    for (const line of lines) {
      if (line.trim().length > 0) {
        const indent = line.search(/\S/);
        if (indent !== -1 && indent < minIndent) {
          minIndent = indent;
        }
      }
    }
    if (minIndent === Infinity) return str.trim();
    return lines.map(line => (line.length >= minIndent ? line.slice(minIndent) : line)).join('\n').trim();
}

const filePath = '/Users/clementbraun/Nsi-app/content/2/exercices_types_python.md';
const fileContent = fs.readFileSync(filePath, 'utf-8');
const { data, content } = matter(fileContent);

const sectionRegex = /<ExerciseSection[^>]*id="([^"]*)"[^>]*label="([^"]*)"[^>]*>([\s\S]*?)<\/ExerciseSection>/g;

let match;
while ((match = sectionRegex.exec(content)) !== null) {
    const id = match[1];
    const rawContent = match[3];
    
    console.log(`--- Section: ${id} ---`);
    
    const verificationRegex = /<Verification>([\s\S]*?)<\/Verification>/;
    const verificationMatch = rawContent.match(verificationRegex);
    
    if (verificationMatch) {
        let verificationCode = dedent(verificationMatch[1]);
        console.log("Raw verification code extracted:");
        console.log(verificationCode);
        
        verificationCode = verificationCode
              .replace(/^```python\s*\n?/, '') 
              .replace(/^```\s*\n?/, '')       
              .replace(/\n?```\s*$/, '')       
              .trim();
              
        console.log("Processed verification code:");
        console.log(verificationCode);
    } else {
        console.log("No verification block found.");
    }
}
