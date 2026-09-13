"use client";
import {useEffect,useState} from 'react';
import {Button,Card,Text} from '@seek/ui';
import {authFetch} from '@/lib/auth-client';
import {createAssessmentRuntimeUrl} from '@/features/assessment-runtime/url';
type Assignment={id:string;scheduleId:string;title:string;scheduleStatus:string;availableFrom:string;availableUntil:string;timezone:string;durationMinutes:number;maxAttempts:number};
type Attempt={id:string;scheduleId:string;status:string};
export default function MyAssessments(){
 const [rows,setRows]=useState<Assignment[]>([]),[attempts,setAttempts]=useState<Attempt[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[busy,setBusy]=useState(''),[code,setCode]=useState('');
 async function json(path:string,init:RequestInit={}){const r=await authFetch('/api/v1/'+path,init);const data=await r.json();if(!r.ok)throw new Error(data.message||'Мэдээлэл татаж чадсангүй.');return data;}
 async function load(){setLoading(true);setError('');try{const [a,b]=await Promise.all([json('assessment/candidate/assignments'),json('execution/my-attempts')]);setRows(a);setAttempts(b);}catch(e){setError((e as Error).message);}finally{setLoading(false);}}
 useEffect(()=>{void load();},[]);
 async function begin(row:Assignment){if(busy)return;setBusy(row.id);setError('');try{const attempt=await json('execution/attempts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({assessmentId:row.scheduleId})});window.location.assign(createAssessmentRuntimeUrl(attempt.waitingUrl));}catch(e){setError((e as Error).message);}finally{setBusy('');}}
 async function join(e:React.FormEvent){e.preventDefault();if(busy)return;setBusy('join');setError('');try{await json('assessment/candidate/join',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});setCode('');await load();}catch(e){setError((e as Error).message);}finally{setBusy('');}}
 return <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 space-y-6"><h1 className="text-2xl font-bold">Миний үнэлгээ</h1><p>Танд оноосон шалгалт, үргэлжлүүлэх оролдлого, илгээсэн баримт.</p>
 <form onSubmit={join} className="flex flex-wrap items-end gap-3"><label className="flex flex-col gap-1">Нэвтрэх код<input className="rounded border p-2" value={code} onChange={e=>setCode(e.target.value)} required maxLength={128}/></label><Button type="submit" disabled={Boolean(busy)}>Кодоор нэгдэх</Button></form>
 {error&&<Card><p role="alert">{error}</p><Button onClick={()=>void load()} disabled={loading}>Дахин оролдох</Button></Card>}
 {loading?<p role="status">Ачаалж байна…</p>:!error&&!rows.length?<Card>Танд одоогоор шалгалт оноогоогүй байна. Байгууллагын админтай холбогдох эсвэл өгсөн кодыг оруулна уу.</Card>:<div className="grid gap-4 md:grid-cols-2">{rows.map(row=>{const attempt=attempts.find(a=>a.scheduleId===row.scheduleId);const ended=new Date(row.availableUntil).getTime()<Date.now();const active=attempt?.status==='IN_PROGRESS';const submitted=attempt?.status==='SUBMITTED';const closed=ended||!['OPEN','ACTIVE','SCHEDULED'].includes(row.scheduleStatus);return <Card key={row.id} className="space-y-3"><h2 className="font-semibold text-lg">{row.title}</h2><p>{new Date(row.availableFrom).toLocaleString('mn-MN',{timeZone:row.timezone})} — {new Date(row.availableUntil).toLocaleString('mn-MN',{timeZone:row.timezone})} ({row.timezone})</p><p>{row.durationMinutes} минут · {row.maxAttempts} оролдлого</p><p>{submitted?'Илгээсэн':active?'Явагдаж байна':closed?'Хаагдсан':'Хүлээгдэж байна'}</p>{submitted?<div className="flex flex-wrap gap-4"><a className="text-primary underline" href={createAssessmentRuntimeUrl('/submitted/'+attempt.id)}>Илгээсэн баримт</a><a className="text-primary underline" href={createAssessmentRuntimeUrl('/results/'+attempt.id)}>Үр дүн</a></div>:<Button disabled={Boolean(busy)||closed} onClick={()=>void begin(row)}>{busy===row.id?'Бэлтгэж байна…':active?'Үргэлжлүүлэх':'Хүлээлгийн өрөө'}</Button>}</Card>;})}</div>}
 </main>;
}
