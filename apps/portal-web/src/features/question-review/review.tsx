'use client';
import {useEffect,useState} from 'react';
import {Button,Input} from '@seek/ui';
import {MarkdownPreview} from '@/features/assessor-workspace/editor/MarkdownPreview';
import {authFetch} from '@/lib/auth-client';
import {useI18n} from '@/i18n/use-t';
export async function reviewJson(path:string,options?:RequestInit){const r=await authFetch(path,{...options,headers:{'Content-Type':'application/json',...options?.headers}});const data=await r.json().catch(()=>({}));if(!r.ok)throw Error(data.message||`HTTP ${r.status}`);return data;}
export const questionUrl='/api/v1/assessment/questions';
export function ReviewDetail({id,onChanged,author=false}:{id:string;onChanged?:()=>void;author?:boolean}) {
 const {t}=useI18n();const [q,setQ]=useState<any>(null),[events,setEvents]=useState<any[]>([]),[error,setError]=useState(''),[busy,setBusy]=useState(false),[comment,setComment]=useState(''),[version,setVersion]=useState('');
 async function load(){setError('');try{const [data,history]=await Promise.all([reviewJson(questionUrl+'/'+id),reviewJson(questionUrl+'/'+id+'/workflow')]);setQ(data);setEvents(history);setVersion(data.versions[0]?.id||'');}catch(e){setError((e as Error).message);}}
 useEffect(()=>{setQ(null);setComment('');void load();},[id]);
 async function act(action:string){if(busy)return;setBusy(true);setError('');try{await reviewJson(questionUrl+'/'+id+'/workflow',{method:'POST',body:JSON.stringify({action,comment,questionVersionId:q.versions[0].id,expectedRevision:q.revision,requestId:crypto.randomUUID()})});setComment('');await load();onChanged?.();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 async function newDraft(){setBusy(true);try{await reviewJson(questionUrl+'/'+id,{method:'PUT',body:JSON.stringify({expectedRevision:q.revision})});onChanged?.();await load();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 const v=q?.versions.find((x:any)=>x.id===version),previous=q?.versions.find((x:any)=>x.versionNumber===(v?.versionNumber||0)-1);
 return <section className="space-y-4 rounded border border-border bg-surface p-5 min-w-0">
  {error&&<div role="alert" className="text-danger">{error}<Button disabled={busy} onClick={()=>void load()}>{t('context.retry')}</Button></div>}
  {!q?<p role="status">{t('access.loading')}</p>:<>
   <h2 className="text-xl font-semibold">{q.code} — {v?.title}</h2>
   <p>{t('review.status')}: {t(('review.'+q.versions[0].versionStatus) as any)}</p>
   <label className="block">{t('review.version')} <select className="border rounded p-2" value={version} onChange={e=>setVersion(e.target.value)}>{q.versions.map((x:any)=><option key={x.id} value={x.id}>v{x.versionNumber} — {t(('review.'+x.versionStatus) as any)}</option>)}</select></label>
   <div className="whitespace-pre-wrap break-words rounded bg-muted-background p-4"><MarkdownPreview value={v?.body||''}/></div>
   <ul className="space-y-2">{v?.options?.map((o:any)=><li key={o.id} className="border rounded p-3 break-words">{o.isCorrect?'✓ ':''}{o.value} <span className="text-muted-foreground">({Number(o.score)} {t('review.points')})</span></li>)}</ul>
   {!!v?.media?.length&&<div className="grid gap-3 md:grid-cols-2">{v.media.map((m:any)=>{const url='/api/v1/file/objects?storageKey='+encodeURIComponent(m.storageKey);const name=m.metadata?.name||m.storageKey.split('/').pop();return <div key={m.id} className="border rounded p-3 min-w-0">{m.mediaType==='IMAGE'&&<img src={url} alt={name} className="max-w-full max-h-80 object-contain"/>}{m.mediaType==='AUDIO'&&<audio controls src={url} className="max-w-full"/>}{m.mediaType==='VIDEO'&&<video controls src={url} className="max-w-full"/>}<a className="text-primary break-all" href={url} target="_blank" rel="noopener noreferrer">{name}</a></div>;})}</div>}
   {(v?.explanation||v?.feedbackCorrect||v?.feedbackIncorrect)&&<details><summary>{t('review.explanation')}</summary><MarkdownPreview value={[v.explanation,v.feedbackCorrect,v.feedbackIncorrect].filter(Boolean).join('\n\n')}/></details>}
   <details><summary>{t('review.config')}</summary><div className="space-y-3 py-3">
    <p>{t('review.points')}: {Number(v?.defaultMinScore)} – {Number(v?.defaultMaxScore)}</p>
    {v?.answerConfig?.answerKey&&<p>{t('review.answer')}: {v.answerConfig.answerKey}</p>}
    {Array.isArray(v?.rubric)&&<ul>{v.rubric.map((r:any,i:number)=><li key={i}>{r.title||r.name||r.description||`${i+1}`} — {r.maxScore} {t('review.points')}</li>)}</ul>}
    <ul className="space-y-2">{(v?.classificationSnapshot?.length?v.classificationSnapshot:q.classifications).map((snapshot:any)=>{const c={...snapshot,...q.classifications.find((x:any)=>x.id===snapshot.id)};return <li key={c.id} className="border rounded p-3">{c.assessmentContext?.name||''} · {c.topic?.title||c.topicId} · {c.difficultyLevel?.name||c.difficultyLevelId}<p>{c.cognitiveLevels?.map((l:any)=>l.cognitiveLevel?.name||l.cognitiveLevelId).join(', ')}</p></li>;})}</ul>
   </div></details>
   {previous&&<details><summary>{t('review.diff')}</summary><div className="grid gap-3 md:grid-cols-2">{[previous,v].map((x:any)=><div key={x.id} className="border rounded p-3 min-w-0"><strong>v{x.versionNumber} — {x.title}</strong><MarkdownPreview value={x.body}/><ul>{x.options?.map((o:any)=><li key={o.id}>{o.isCorrect?'✓ ':''}{o.value} ({Number(o.score)})</li>)}</ul><p>{Number(x.defaultMaxScore)} {t('review.points')}</p></div>)}</div></details>}
   <label className="block">{t('review.comment')}<textarea className="mt-2 w-full border rounded p-3" value={comment} onChange={e=>setComment(e.target.value)} disabled={busy}/></label>
   <div className="flex flex-wrap gap-2">{(q.allowedActions||[]).filter((a:string)=>!['approval_requested','resubmitted'].includes(a)).map((a:string)=><Button key={a} disabled={busy||version!==q.versions[0].id||(['reject','changes_requested'].includes(a)&&!comment.trim())} onClick={()=>void act(a)}>{t(('review.'+a) as any)}</Button>)}{author&&['APPROVED','PUBLISHED','REJECTED','RETIRED'].includes(q.versions[0].versionStatus)&&<Button disabled={busy} onClick={()=>void newDraft()}>{t('review.newDraft')}</Button>}</div>
   <h3 className="font-semibold">{t('review.history')}</h3>
   {!events.length?<p>{t('review.noEvents')}</p>:<ol className="space-y-3">{[...events].reverse().map(e=><li key={e.id} className="border-l-2 border-primary pl-3"><strong>{t(('review.'+(e.newStatus==='pending'?'IN_REVIEW':e.newStatus.toUpperCase())) as any)}</strong> · {new Date(e.occurredAt).toLocaleString()}<p className="text-sm break-all">{e.actorRole} · {e.actorUserId} · {e.questionVersionId}</p>{e.comment&&<p className="whitespace-pre-wrap">{e.comment}</p>}</li>)}</ol>}
  </>}
 </section>;
}
