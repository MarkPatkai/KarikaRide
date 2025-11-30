const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src', 'app');
const TRANSLATIONS_DIR = path.join(__dirname, '..', 'src', 'assets', 'i18n');
const LANGUAGES = ['en', 'hu', 'de', 'es', 'fr', 'ru'];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (entry.isFile() && (fullPath.endsWith('.html') || fullPath.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractTextsFromHtml(content) {
  const texts = new Set();
  const textRegex = />\s*([^<>{}\n]+?)\s*</g;
  const attrRegex = /\b(?:label|title|placeholder|alt|aria-label)="([^"{][^"]*?)"/g;

  let match;
  while ((match = textRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (isTranslatable(text)) {
      texts.add(text);
    }
  }

  while ((match = attrRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (isTranslatable(text)) {
      texts.add(text);
    }
  }

  return Array.from(texts);
}

function extractTextsFromTs(content) {
  const texts = new Set();
  const stringRegex = /(['"])([^'"\n]*?[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+[^'"\n]*?)\1/g;
  let match;
  while ((match = stringRegex.exec(content)) !== null) {
    const text = match[2].trim();
    if (isTranslatable(text)) {
      texts.add(text);
    }
  }
  return Array.from(texts);
}

function isTranslatable(text) {
  if (!text) return false;
  if (text.length <= 1) return false;
  if (text.startsWith('{{') || text.includes('| transloco')) return false;
  if (/^[#{}]/.test(text)) return false;
  if (/[<>]/.test(text)) return false;
  if (/\s{2,}/.test(text)) return false;
  if (/https?:\/\//.test(text)) return false;
  if (/^\w+\.\w+/.test(text)) return false;
  return true;
}

function loadTranslations() {
  const files = {};
  LANGUAGES.forEach(lang => {
    const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);
    files[lang] = {
      path: filePath,
      data: JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    };
  });
  return files;
}

function getNested(obj, parts) {
  return parts.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function setNested(obj, parts, value) {
  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      current[part] = i === parts.length - 1 ? value : {};
    }
    current = current[part];
  }
}

function generateKey(filePath, text) {
  const relative = path.relative(path.join(__dirname, '..', 'src'), filePath);
  const base = relative.replace(/\.[^.]+$/, '').replace(/[\/]/g, '.');
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40) || 'text';
  return `${base}.${slug}`;
}

function updateTranslations(translations, key, text) {
  const parts = key.split('.');
  LANGUAGES.forEach(lang => {
    const existing = getNested(translations[lang].data, parts);
    if (existing === undefined) {
      const value = lang === 'en' ? text : '';
      setNested(translations[lang].data, parts, value);
    }
  });
}

function main() {
  const translations = loadTranslations();
  const files = walk(ROOT);
  const missing = [];

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const texts = file.endsWith('.html')
      ? extractTextsFromHtml(content)
      : extractTextsFromTs(content);

    texts.forEach(text => {
      const key = generateKey(file, text);
      missing.push({ file: path.relative(path.join(__dirname, '..'), file), key, text });
      updateTranslations(translations, key, text);
    });
  });

  LANGUAGES.forEach(lang => {
    fs.writeFileSync(translations[lang].path, JSON.stringify(translations[lang].data, null, 2));
  });

  fs.writeFileSync(
    path.join(__dirname, '..', 'translation-missing.json'),
    JSON.stringify(missing, null, 2)
  );

  const components = Array.from(new Set(missing.map(entry => entry.file)));
  console.log('Missing translation entries created:', missing.length);
  console.log('Components with missing translations:');
  components.forEach(component => console.log(`- ${component}`));
}

main();
