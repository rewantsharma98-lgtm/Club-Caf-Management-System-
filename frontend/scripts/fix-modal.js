const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '../src/components/ui/Modal.tsx');
let s = fs.readFileSync(p, 'utf8');
const mclose = '</' + 'motion.div>';
const dclose = '</' + 'div>';
s = s.replace(
  '          ' + mclose + '\n        ' + mclose + '\n      )}',
  '          ' + mclose + '\n        ' + dclose + '\n      )}'
);
fs.writeFileSync(p, s);
console.log('fixed modal');
