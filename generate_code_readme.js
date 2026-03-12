const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const outputFile = path.join(rootDir, 'ALL_CODE.md');

// Directories and files to ignore
const ignoreDirs = ['node_modules', '.git', 'dist', 'build', 'public', 'assets', '.npm', '.vscode'];
const ignoreFiles = ['package-lock.json', 'ALL_CODE.md', 'generate_code_readme.js', '.DS_Store'];
const ignoreExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.mp4'];

let markdownContent = '# Full Project Source Code\n\nThis file contains the complete source code for all text-based files in the project.\n\n';

function walkDir(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (let entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        const relativePath = path.relative(rootDir, fullPath);

        if (entry.isDirectory()) {
            if (!ignoreDirs.includes(entry.name)) {
                walkDir(fullPath);
            }
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (!ignoreFiles.includes(entry.name) && !ignoreExtensions.includes(ext)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    let language = ext.replace('.', '');
                    if (language === 'jsx') language = 'javascript';
                    if (language === 'js') language = 'javascript';
                    
                    markdownContent += `## File: \`${relativePath}\`\n\n`;
                    markdownContent += `\`\`\`${language}\n${content}\n\`\`\`\n\n`;
                    markdownContent += `---\n\n`;
                } catch (err) {
                    console.error(`Could not read file ${relativePath}:`, err);
                }
            }
        }
    }
}

console.log('Generating ALL_CODE.md...');
walkDir(rootDir);
fs.writeFileSync(outputFile, markdownContent);
console.log('Successfully generated ALL_CODE.md');
