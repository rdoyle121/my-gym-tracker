// Apply preferred MG brand artwork to the generated iOS Capacitor app.
// Runs only inside release/native after "npx cap add ios".
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import sharp from 'sharp';

const root=resolve(import.meta.dirname,'../..');
const assetDir=resolve(import.meta.dirname,'ios/App/App/Assets.xcassets/AppIcon.appiconset');
await mkdir(assetDir,{recursive:true});
const svg=await readFile(join(root,'icon.svg'));
const png=await sharp(svg,{density:300}).resize(1024,1024).flatten({background:'#09090d'}).png().toBuffer();
const name='AppIcon-512@2x.png';
await writeFile(join(assetDir,name),png);
await writeFile(join(assetDir,'Contents.json'),JSON.stringify({
  images:[{filename:name,idiom:'universal',platform:'ios',size:'1024x1024'}],
  info:{author:'xcode',version:1}
},null,2)+'\n');
console.log('MG iOS icon installed: 1024x1024 opaque PNG from existing icon.svg');
