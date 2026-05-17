const fs = require('fs');
const path = require('path');
const hero = path.join(__dirname, '../src/components/home/Hero.tsx');
const lines = fs.readFileSync(hero, 'utf8').split(/\r?\n/);
lines[101] = '      </div>';
fs.writeFileSync(hero, lines.join('\n'));
console.log('hero line 102 fixed');
