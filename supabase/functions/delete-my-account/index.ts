// Supabase Edge Function: delete-my-account
// Deploy with JWT verification ENABLED. Never expose the service-role key to the browser.
// Requires SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY as function secrets.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';
Deno.serve(async req => {
  const cors={'Access-Control-Allow-Origin':'https://rdoyle121.github.io','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
  const respond=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(req.method!=='POST')return respond({error:'Method not allowed'},405);
  try{
    const token=(req.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
    if(!token)return respond({error:'Authentication required'},401);
    const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if(!url||!anon||!service)return respond({error:'Server is not configured'},503);
    const client=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:{user},error:authError}=await client.auth.getUser(token);
    if(authError||!user)return respond({error:'Invalid session'},401);
    const body=await req.json().catch(()=>({}));
    if(body?.confirm!=='DELETE MY ACCOUNT'||body?.userId!==user.id)return respond({error:'Explicit account confirmation required'},400);
    const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const bucket=admin.storage.from('gym-progress-photos');
    let offset=0;const paths:string[]=[];
    // Collect all photos before deleting to avoid list pagination shifting.
    while(true){const {data,error}=await bucket.list(user.id,{limit:100,offset});if(error)throw new Error('Could not list private photos: '+error.message);for(const x of data||[])if(x.name&&!x.name.startsWith('.'))paths.push(user.id+'/'+x.name);if(!data||data.length<100)break;offset+=100;if(offset>100000)throw new Error('Too many files to safely delete')}
    for(let i=0;i<paths.length;i+=100){const {error}=await bucket.remove(paths.slice(i,i+100));if(error)throw new Error('Could not delete private photos: '+error.message)}
    // Delete per-user table rows before deleting the authentication identity.
    // Missing optional tables are ignored; all other database errors stop deletion.
    for(const table of ['workout_logs','user_settings','workout_plans','profiles','body_weights','body_measurements','workout_notes']){
      const {error}=await admin.from(table).delete().eq('user_id',user.id);
      if(error&&error.code!=='42P01')throw new Error('Could not remove account records: '+table+' ('+error.message+')');
    }
    const {error:deleteError}=await admin.auth.admin.deleteUser(user.id);
    if(deleteError)throw new Error('Could not remove account identity: '+deleteError.message);
    return respond({success:true});
  }catch(e){return respond({error:e instanceof Error?e.message:'Account deletion failed'},500)}
});
