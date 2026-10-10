// Dedicated cloud app worker. The original personal tracker's worker is untouched.
const APP_PATH=new URL('./cloud-gym.html',self.location.href).pathname;
self.addEventListener('install',event=>{self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim())});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  if(url.pathname!==APP_PATH)return;
  event.respondWith(fetch(new Request(event.request,{cache:'no-store'})));
});
