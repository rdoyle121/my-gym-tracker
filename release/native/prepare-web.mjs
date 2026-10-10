// Stage cloud-only assets for Capacitor; original website files are never edited.
import {cp,copyFile,mkdir,readFile,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const dest=resolve(import.meta.dirname,'dist');
await mkdir(dest,{recursive:true});
let html=await readFile(join(root,'cloud-gym.html'),'utf8');

// The browser-only PWA worker cannot control the Capacitor app's index route.
// Suppress registration in the staged native copy, leaving the hosted PWA untouched.
const workerRegistration="if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./cloud-sw.js',{scope:'./cloud-gym.html'}).catch(()=>{});";
if(!html.includes(workerRegistration))throw new Error('Cloud worker registration changed: review native staging before building');
html=html.replace(workerRegistration,'');

// Password reset links must NOT point at capacitor://localhost or localhost.
// Send reset email users to the working hosted recovery flow instead.
// Returning to the native app after recovery may require signing in again.
const browserReset="redirectTo:location.origin+location.pathname";
if(!html.includes(browserReset))throw new Error('Password recovery logic changed: review native staging before building');
html=html.replace(browserReset,"redirectTo:'https://rdoyle121.github.io/my-gym-tracker/cloud-gym.html'");
await writeFile(join(dest,'index.html'),html);
for(const name of ['plan-data.js','cloud-manifest.webmanifest','icon.svg','mg-rendered-icon.png','cloud-privacy.html']){
  await copyFile(join(root,name),join(dest,name));
}
await cp(join(root,'assets'),join(dest,'assets'),{recursive:true});
console.log('Staged native preview with PWA worker disabled and web-hosted password recovery. Physical-device tests still required.');
