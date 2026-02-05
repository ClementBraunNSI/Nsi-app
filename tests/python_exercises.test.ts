
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { execSync } from 'child_process';

function dedent(str: string): string {
    const lines = str.split('\n');
    // Remove first empty line if present
    if (lines.length > 0 && lines[0].trim() === '') lines.shift();
    // Remove last empty line if present
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

function cleanCodeBlock(code: string): string {
    return code
        .replace(/^```python\s*\n?/, '')
        .replace(/^```\s*\n?/, '')
        .replace(/\n?```\s*$/, '')
        .trim();
}

const FILES_TO_TEST = [
    '/Users/clementbraun/Nsi-app/content/particuliers/romeo/listes-comprehension-exercices.md'
];

describe('Verification des fiches d\'exercices', () => {
    FILES_TO_TEST.forEach(filePath => {
        const fileName = path.basename(filePath);
        
        describe(fileName, () => {
            if (!fs.existsSync(filePath)) {
                it('should exist', () => {
                    expect(fs.existsSync(filePath)).toBe(true);
                });
                return;
            }

            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { content } = matter(fileContent);

            // Regex to find ExerciseSection
            const sectionRegex = /<ExerciseSection[^>]*id="([^"]*)"[^>]*label="([^"]*)"[^>]*>([\s\S]*?)<\/ExerciseSection>/g;
            
            let match;
            const sections: { id: string, content: string }[] = [];
            while ((match = sectionRegex.exec(content)) !== null) {
                sections.push({ id: match[1], content: match[3] });
            }

            if (sections.length === 0) {
                it('should have exercise sections', () => {
                    expect(sections.length).toBeGreaterThan(0);
                });
            }

            sections.forEach(section => {
                it(`Section ${section.id}: should pass verification`, () => {
                    const correctionRegex = /<Correction>([\s\S]*?)<\/Correction>/;
                    const verificationRegex = /<Verification>([\s\S]*?)<\/Verification>/;

                    const correctionMatch = section.content.match(correctionRegex);
                    const verificationMatch = section.content.match(verificationRegex);

                    expect(correctionMatch, 'Correction block missing').not.toBeNull();
                    expect(verificationMatch, 'Verification block missing').not.toBeNull();

                    if (correctionMatch && verificationMatch) {
                        const correctionCode = cleanCodeBlock(dedent(correctionMatch[1]));
                        const verificationCode = cleanCodeBlock(dedent(verificationMatch[1]));

                        const fullCode = `${correctionCode}\n\n# --- VERIFICATION ---\n${verificationCode}`;
                        
                        try {
                            // Run python code using child_process
                            // Use python3 or python depending on env. Assuming python3 for modern envs.
                            execSync('python3 -c "' + fullCode.replace(/"/g, '\\"') + '"', { 
                                stdio: 'pipe',
                                encoding: 'utf-8' 
                            });
                        } catch (error: any) {
                            console.error(`Error in section ${section.id}:`, error.stderr || error.message);
                            throw new Error(`Python verification failed for section ${section.id}: ${error.stderr || error.message}`);
                        }
                    }
                });
            });
        });
    });
});
