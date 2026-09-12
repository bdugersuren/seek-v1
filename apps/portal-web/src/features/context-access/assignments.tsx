"use client";
import React, {useEffect, useState} from 'react';
import {Button, Card, Select} from '@seek/ui';
import {authFetch} from '@/lib/auth-client';
import {useI18n} from '@/i18n/use-t';
type User={id:string;email:string;roles:string[];status:string};
type Grant={id:string;userId:string};
export function ContextAssignments({contextId}:{contextId:string}) {
 const {t}=useI18n();
 const [users,setUsers]=useState<User[]>([]),[grants,setGrants]=useState<Grant[]>([]),[chosen,setChosen]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true);
 const url='/api/v1/assessment/context-access/'+encodeURIComponent(contextId);
 async function json(path:string,options?:RequestInit){const r=await authFetch(path,options);if(!r.ok)throw Error(t('access.failed'));return r.json();}
 async function load(){setLoading(true);setError('');try{const [u,g]=await Promise.all([json('/api/v1/auth/admin/users'),json(url)]);setUsers(u);setGrants(g);}catch(e){setError((e as Error).message);}finally{setLoading(false);}}
 useEffect(()=>{void load();},[]);
 async function change(userId:string,remove=false){setBusy(true);setError('');try{await json(url+(remove?'/'+encodeURIComponent(userId):''),{method:remove?'DELETE':'POST',headers:{'Content-Type':'application/json'},body:remove?undefined:JSON.stringify({userId})});setChosen('');await load();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 return <Card className="mt-6 space-y-4">
  <h2 className="font-semibold">{t('access.title')}</h2><p className="text-sm text-muted-foreground">{t('access.help')}</p>
  {error&&<div role="alert">{error}<Button onClick={()=>void load()} disabled={busy}>{t('context.retry')}</Button></div>}
  {loading?<p role="status">{t('access.loading')}</p>:<>
   <div className="flex flex-wrap gap-3"><Select aria-label={t('access.user')} value={chosen} onChange={e=>setChosen(e.target.value)} disabled={busy} className="min-w-0 flex-1"><option value="">{t('access.user')}</option>{users.filter(u=>u.status==='ACTIVE'&&u.roles.includes('ASSESSOR')&&!grants.some(g=>g.userId===u.id)).map(u=><option key={u.id} value={u.id}>{u.email}</option>)}</Select><Button disabled={!chosen||busy} onClick={()=>void change(chosen)}>{t('access.assign')}</Button></div>
   {!grants.length?<p>{t('access.empty')}</p>:<ul className="space-y-2">{grants.map(g=><li key={g.id} className="flex flex-wrap items-center justify-between gap-2"><span className="break-all">{users.find(u=>u.id===g.userId)?.email||g.userId}</span><Button variant="outline" disabled={busy} onClick={()=>{if(window.confirm(t('access.confirm')))void change(g.userId,true);}}>{t('access.revoke')}</Button></li>)}</ul>}
  </>}
 </Card>;
}
