const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '../src/components/modals/ReservationModal.tsx');
let s = fs.readFileSync(p, 'utf8');
s = s.replace('</motion.div>`n      </form>', '</motion.div>\n      </form>');
s = s.replace('</motion.div>`n      </form>', '</motion.div>\n      </form>');
fs.writeFileSync(p, s);
console.log('fixed reservation');
