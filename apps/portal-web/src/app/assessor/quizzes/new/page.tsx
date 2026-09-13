"use client";
import {useEffect,useState} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import Link from 'next/link';
import {Button} from '@seek/ui';
import {getBlueprintByIdAsync} from '@/features/assessor-workspace/api';
import {QuizCreateDialog} from '@/features/assessor-workspace/QuizCreateDialog';
export default function Page(){const search=useSearchParams(),router=useRouter(),id=search.get('blueprintId');const [b,setB]=useState<any>(null),[error,setError]=useState(''),[reload,setReload]=useState(0);useEffect(()=>{let live=true;setError('');if(id)getBlueprintByIdAsync(id).then(x=>{if(live){setB(x);if(!x)setError('Blueprint олдсонгүй.')}}).catch(e=>{if(live)setError(e.message)});return()=>{live=false}},[id,reload]);return <main className="p-6"><h1 className="text-2xl font-bold">Quiz үүсгэх</h1>{!id?<Link href="/assessor/blueprints">Blueprint сонгох</Link>:error?<><p role="alert">{error}</p><Button onClick={()=>setReload(x=>x+1)}>Дахин оролдох</Button></>:!b?<p role="status">Ачаалж байна…</p>:<QuizCreateDialog blueprint={b} onClose={()=>router.push('/assessor/blueprints')}/>}</main>}
