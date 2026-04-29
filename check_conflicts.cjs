const fs = require('fs');
const oldData = JSON.parse(fs.readFileSync('src/data/elements.json'));
const newData = require('./scratch_bowserinator.json').elements;

let conflicts = 0;
for(let i=0; i<Math.min(oldData.length, newData.length); i++) {
  const o = oldData[i];
  const n = newData[i];
  if(o.number !== n.number) continue;
  
  Object.keys(n).forEach(k => {
    if(o[k] !== undefined && typeof o[k] !== 'object' && String(o[k]) !== String(n[k])) {
      // Ignore source, bohr_model_image, bohr_model_3d, spectral_img string changes if they are just urls being fetched
      if (['source', 'bohr_model_image', 'bohr_model_3d', 'spectral_img', 'summary'].includes(k)) return;
      
      console.log(`Conflict for ${o.name} [${k}]: old='${o[k]}' new='${n[k]}'`);
      conflicts++;
    }
  });
}
console.log('Total conflicts:', conflicts);
