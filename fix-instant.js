const fs = require('fs');
const path = require('path');

let count = 0;
function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (file.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const updated = content.replace(/^export const instant = false;\r?\n/gm, '');
      if (content !== updated) {
        fs.writeFileSync(full, updated);
        console.log('Updated:', full);
        count++;
      }
    }
  }
}

walk('./app');
console.log(`\n✅ Total: ${count} files updated`);