// Stages the existing cloud app as index.html inside a separate native build.
// Does not modify the personal tracker or the live cloud app.
import {cp,copyFile,mkdir,readFile,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const dest=resolve(import.meta.dirname,'dist');
await mkdir(dest,{recursive:true});
let html=await readFile(join(root,'cloud-gym.html'),'utf8');
// Use the cloud screen as the native app entry point.
html=html.replace(/href="cloud-manifest\.webmanifest"/g,'href="cloud-manifest.webmanifest"');
await writeFile(join(dest,'index.html'),html);
for(const name of ['plan-data.js','cloud-manifest.webmanifest','icon.svg','mg-rendered-icon.png','cloud-privacy.html','cloud-sw.js']){
  await copyFile(join(root,name),join(dest,name));
}
await cp(join(root,'assets'),join(dest,'assets'),{recursive:true});
console.log('Cloud app assets staged to release/native/dist. Inspect all browser/network dependencies before native release.');
