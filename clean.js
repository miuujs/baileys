import fs from 'fs';
import path from 'path';

function cleanComments(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let result = '';
  let i = 0;
  const len = code.length;
  
  while (i < len) {
    // Handle strings (double quote, single quote, template literal)
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i];
      result += code[i];
      i++;
      while (i < len && code[i] !== quote) {
        if (code[i] === '\\') {
          result += code[i];
          i++;
        }
        if (i < len) {
          result += code[i];
          i++;
        }
      }
      if (i < len) {
        result += code[i];
        i++;
      }
      continue;
    }
    
    // Skip URLs
    if (code.substr(i, 8) === 'https://' || code.substr(i, 7) === 'http://') {
      let end = i;
      while (end < len && ![' ', '"', "'", '\n', '\r', ')'].includes(code[end])) {
        end++;
      }
      result += code.substring(i, end);
      i = end;
      continue;
    }
    
    // Check for regex (after =, (, [, {, :, comma, return, etc)
    if (code[i] === '/') {
      const context = result.trim();
      const lastChar = context[context.length - 1];
      const isRegexContext = ['=', '(', '[', '{', ':', ',', '!', '&', '|', '?', '<', '>', '+', '-', '*', '/', '%', '^', '~'].includes(lastChar) || 
                           context.endsWith('return') || 
                           context.endsWith('typeof') || 
                           context === '' ||
                           context.endsWith('(') ||
                           context.endsWith('[') ||
                           context.endsWith('{');
      
      if (isRegexContext) {
        let j = i + 1;
        let inCharClass = false;
        let foundEnd = false;
        while (j < len) {
          if (code[j] === '\\') { j += 2; continue; }
          if (code[j] === '[' && !inCharClass) { inCharClass = true; j++; continue; }
          if (code[j] === ']' && inCharClass) { inCharClass = false; j++; continue; }
          if (code[j] === '/' && !inCharClass) { foundEnd = true; break; }
          j++;
        }
        if (foundEnd) {
          while (i <= j) {
            result += code[i];
            i++;
          }
          continue;
        }
      }
    }
    
    // Remove // comments
    if (code[i] === '/' && code[i+1] === '/') {
      while (i < len && code[i] !== '\n') i++;
      continue;
    }
    
    // Remove /* */ comments
    if (code[i] === '/' && code[i+1] === '*') {
      i += 2;
      while (i < len && !(code[i] === '*' && code[i+1] === '/')) i++;
      if (i < len) i += 2;
      continue;
    }
    
    result += code[i];
    i++;
  }
  
  fs.writeFileSync(filePath, result, 'utf8');
  console.log('Cleaned:', filePath);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.js')) {
      cleanComments(fullPath);
    }
  }
}

walkDir('./src');
console.log('Done cleaning comments!');
