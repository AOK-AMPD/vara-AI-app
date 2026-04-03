const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const dirs = ['components', 'context', 'hooks', 'views'];

dirs.forEach(dirName => {
  const targetDir = path.join(__dirname, 'src', dirName);
  if (fs.existsSync(targetDir)) {
    walk(targetDir).forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      if (!content.startsWith("'use client'") && !content.startsWith('"use client"')) {
        fs.writeFileSync(file, "'use client';\n\n" + content);
      }
    });
  }
});

console.log('Added use client directives');
