const fs = require('fs');
const path = require('path');

const webDir = path.join(__dirname, '../web');
const files = fs.readdirSync(webDir);
const htmlFiles = files.filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(webDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'No Title';

  // Extract all IDs
  const idRegex = /id="([^"]+)"/g;
  const ids = [];
  let match;
  while ((match = idRegex.exec(content)) !== null) {
    if (!ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }

  // Extract headings (h1, h2, h3)
  const headingRegex = /<h[1-3][^>]*>([^<]+)<\/h[1-3]>/gi;
  const headings = [];
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text && !headings.includes(text)) {
      headings.push(text);
    }
  }

  console.log(`=========================================`);
  console.log(`File: ${file}`);
  console.log(`Title: ${title}`);
  console.log(`Headings: ${headings.slice(0, 5).join(' | ')}`);
  console.log(`IDs: ${ids.slice(0, 10).join(', ')}`);
});
