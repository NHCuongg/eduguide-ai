const fs = require('fs');
const path = require('path');

function stripComments(content) {
    const regex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
    return content.replace(regex, (match, stringLiteral, comment) => {
        if (stringLiteral) return stringLiteral;
        if (comment) {
            // retain compiler/linter directives
            if (comment.includes('eslint-disable') || comment.includes('@ts-') || comment.includes('prettier-ignore')) {
                return comment;
            }
            // remove others securely
            if (comment.startsWith('/*')) {
                const newlines = comment.match(/\n/g);
                return newlines ? newlines.join('') : ''; // preserve line structure
            }
            return '';
        }
        return match;
    });
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const newContent = stripComments(content);
            if (content !== newContent) {
                // condense multiple blank lines caused by removed comments into a single empty line
                const cleanedContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
                fs.writeFileSync(fullPath, cleanedContent, 'utf8');
                console.log(`Cleaned: ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, '../src'));
