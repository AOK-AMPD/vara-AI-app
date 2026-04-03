const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules')) {
        results = results.concat(walk(file));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

walk(path.join(__dirname, 'src')).forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('react-router-dom')) return;
  
  content = content.replace(/import \{([^}]*)\} from 'react-router-dom';/g, (match, imports) => {
    let nextImports = [];
    let res = '';
    
    if (imports.includes('useNavigate')) {
      nextImports.push('useRouter');
      content = content.replace(/useNavigate\(\)/g, 'useRouter()');
      content = content.replace(/navigate\(/g, 'router.push(');
      content = content.replace(/const navigate =/g, 'const router =');
    }
    if (imports.includes('useLocation')) nextImports.push('usePathname');
    if (imports.includes('useSearchParams')) nextImports.push('useSearchParams');
    
    if (imports.includes('Link')) {
      res += "import Link from 'next/link';\n";
    }
    
    if (nextImports.length > 0) {
      res += `import { ${nextImports.join(', ')} } from 'next/navigation';\n`;
    }
    
    return res;
  });
  
  content = content.replace(/useLocation\(\)/g, 'usePathname()');
  // Need to handle layout and App, but those might be special.
  
  fs.writeFileSync(file, content);
});
