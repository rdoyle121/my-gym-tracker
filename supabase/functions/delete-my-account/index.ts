// Supabase Edge Function: delete-my-account
// Gateway legacy JWT verification OFF; validate the caller via auth.getUser(token). Never expose the service-role key to the browser.
// Requires SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY as function secrets.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';
Deno.serve(async req => {
  const cors={'Access-Control-Allow-Origin':'https://rdoyle121.github.io','Access-Control-Allow-Headers':req.headers.get('Access-Control-Request-Headers')||'authorization, apikey, content-type, x-client-info, x-supabase-api-version','Access-Control-Allow-Methods':'POST, OPTIONS'};
  const respond=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(req.method!=='POST')return respond({error:'Method not allowed'},405);
  let stage='authenticate';
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
    stage='prepare-admin-client';
    const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const bucket=admin.storage.from('gym-progress-photos');
    let offset=0;const paths:string[]=[];
    // Collect all photos before deleting to avoid list pagination shifting.
    stage='list-photos';
    while(true){const {data,error}=await bucket.list(user.id,{limit:100,offset});if(error)throw new Error('Could not list private photos: '+error.message);for(const x of data||[])if(x.name&&!x.name.startsWith('.'))paths.push(user.id+'/'+x.name);if(!data||data.length<100)break;offset+=100;if(offset>100000)throw new Error('Too many files to safely delete')}
    stage='remove-photos';
    for(let i=0;i<paths.length;i+=100){const {error}=await bucket.remove(paths.slice(i,i+100));if(error)throw new Error('Could not delete private photos: '+error.message)}
    // Delete per-user table rows before deleting the authentication identity.
    // Explicit inventory from the read-only public table audit. Stop on any failure.
    for(const table of ['body_measurement','body_weights','gym_favourites','gym_visits','nutrition_plans','personal_records','profiles','shopping_lists','user_settings','workout_logs','workout_notes','workout_plans']){
      stage='delete-table:'+table;
      const {error}=await admin.from(table).delete().eq('user_id',user.id);
      if(error)throw new Error('Could not remove account records: '+table+' ('+error.message+')');
    }
    stage='delete-auth-user';
    const {error:deleteError}=await admin.auth.admin.deleteUser(user.id);
    if(deleteError)throw new Error('Could not remove account identity: '+deleteError.message);
    return respond({success:true});
  }catch(e){console.error('account-delete failure',stage,e instanceof Error?e.message:'unknown');return respond({error:'Account deletion failed at '+stage+'. Check function logs before retrying.',stage},500)}
});
