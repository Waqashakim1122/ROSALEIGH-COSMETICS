/**
 * build.js
 * ---------------------------------------------------------------
 * Yeh script "pages/*.template.html" ko padhta hai, unme jo
 * <!--include:component-name--> likha hai usko components/ folder
 * ki asli HTML se badal deta hai, aur us component ki .css / .js
 * file ko khud-ba-khud <head> aur body ke end mein link kar deta hai.
 *
 * ISTEMAL (USAGE):
 *   node build.js
 *
 * Jab bhi kisi component folder (components/<name>/) ke andar
 * html ya css badlo, bas dobara "node build.js" chala do — saari
 * final .html files (index.html, shop.html, etc.) khud ban jayengi.
 * Koi server / internet / npm install ki zaroorat nahi.
 * ---------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PAGES_DIR = path.join(ROOT, 'pages');
const COMPONENTS_DIR = path.join(ROOT, 'components');

const INCLUDE_RE = /<!--\s*include:([a-zA-Z0-9_-]+)\s*-->/g;

function buildPage(templateFile){
  const templatePath = path.join(PAGES_DIR, templateFile);
  let html = fs.readFileSync(templatePath, 'utf8');

  const usedComponents = [];
  html = html.replace(INCLUDE_RE, (match, name) => {
    const fragPath = path.join(COMPONENTS_DIR, name, `${name}.html`);
    if(!fs.existsSync(fragPath)){
      console.warn(`  ! Warning: component "${name}" not found (looked in ${fragPath})`);
      return match;
    }
    usedComponents.push(name);
    return fs.readFileSync(fragPath, 'utf8').trim();
  });

  // Build <link> tags for every component css that exists, in order used
  const cssLinks = [];
  usedComponents.forEach(name => {
    const cssPath = path.join(COMPONENTS_DIR, name, `${name}.css`);
    if(fs.existsSync(cssPath)){
      const rel = `components/${name}/${name}.css`;
      if(!cssLinks.includes(rel)) cssLinks.push(rel);
    }
  });
  const cssTags = cssLinks.map(href => `<link rel="stylesheet" href="${href}">`).join('\n');
  html = html.replace('<!--COMPONENT_CSS-->', cssTags);

  // Build <script> tags for every component js that exists, in order used
  const jsLinks = [];
  usedComponents.forEach(name => {
    const jsPath = path.join(COMPONENTS_DIR, name, `${name}.js`);
    if(fs.existsSync(jsPath)){
      const rel = `components/${name}/${name}.js`;
      if(!jsLinks.includes(rel)) jsLinks.push(rel);
    }
  });
  const jsTags = jsLinks.map(src => `<script src="${src}"></script>`).join('\n');
  html = html.replace('<!--COMPONENT_JS-->', jsTags);

  const outName = templateFile.replace('.template.html', '.html');
  fs.writeFileSync(path.join(ROOT, outName), html, 'utf8');
  console.log(`✓ built ${outName}  (components: ${usedComponents.join(', ')})`);
}

if(!fs.existsSync(PAGES_DIR)){
  console.error('pages/ folder not found. Run this script from inside rosaleigh-site/');
  process.exit(1);
}

fs.readdirSync(PAGES_DIR)
  .filter(f => f.endsWith('.template.html'))
  .forEach(buildPage);

console.log('\nDone! Saari pages bann gayi hain — ab unhe browser mein khol kar dekh lo.');
