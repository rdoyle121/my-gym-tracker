// Apply minimal, truthful iOS permission descriptions to a generated Capacitor project.
// Uses system tools present on GitHub's macOS runner; does not alter the hosted website.
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const plist=resolve(import.meta.dirname,'ios/App/App/Info.plist');
const plistBuddy='/usr/libexec/PlistBuddy';
const entries={
  NSPhotoLibraryUsageDescription:'Choose a progress photo to save in your private gym gallery.',
  NSCameraUsageDescription:'Take a progress photo if you choose to use the camera.',
  NSLocationWhenInUseUsageDescription:'Find nearby gyms only when you request a location search.'
};
for(const [key,value] of Object.entries(entries)){
  try { execFileSync(plistBuddy,['-c',`Set :${key} ${value}`,plist]); }
  catch {execFileSync(plistBuddy,['-c',`Add :${key} string ${value}`,plist]);}
}
console.log('Configured iOS photo, camera and optional gym-location permission descriptions.');
