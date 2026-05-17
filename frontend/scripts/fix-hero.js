const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/components/home/Hero.tsx');
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
// Line 44 (index 43): close video wrapper div
if (lines[43]?.includes('motion.div')) lines[43] = '      </div>';
// Line 102 (index 101): close content wrapper div
if (lines[101]?.includes('motion.div')) lines[101] = '      </div>';
fs.writeFileSync(file, lines.join('\n'));
console.log('fixed');
