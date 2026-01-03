const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, '../data/blogs');
const outputFile = path.join(__dirname, '../data/blogs.json');

// Read all blog JSON files
const blogFiles = fs.readdirSync(blogsDir).filter(file => file.endsWith('.json'));

const blogs = blogFiles.map(file => {
  const content = fs.readFileSync(path.join(blogsDir, file), 'utf8');
  return JSON.parse(content);
}).sort((a, b) => parseInt(a.id) - parseInt(b.id));

// Write consolidated blogs.json
fs.writeFileSync(outputFile, JSON.stringify({ blogs }, null, 2));

console.log(`Consolidated ${blogs.length} blog posts into blogs.json`);
