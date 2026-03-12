const fs = require('fs');
const html = fs.readFileSync('C:/Users/scott/AAC-Board/index.html', 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.log('No script tag found'); process.exit(1); }
const js = m[1];
const lines = js.split('\n');

// Try compiling incrementally to find the error location
let lastGood = 0;
for (let chunk = 100; chunk <= lines.length; chunk += 100) {
  try {
    new Function(lines.slice(0, chunk).join('\n'));
    lastGood = chunk;
  } catch(e) {
    // Binary search between lastGood and chunk
    let lo = lastGood, hi = chunk;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      try {
        new Function(lines.slice(0, mid).join('\n'));
        lo = mid + 1;
      } catch {
        hi = mid;
      }
    }
    console.log('Error near JS line ' + lo + ' (file line ~' + (lo + 1) + ')');
    console.log('Context:');
    for (let i = Math.max(0, lo - 5); i < Math.min(lines.length, lo + 3); i++) {
      console.log((i === lo - 1 ? '>>> ' : '    ') + (i+1) + ': ' + lines[i]);
    }
    try { new Function(lines.slice(0, lo).join('\n')); } catch(e2) { console.log('Error:', e2.message); }
    process.exit(1);
  }
}
console.log('JS syntax OK (all ' + lines.length + ' lines)');
