import {QuizEditor} from '@/features/assessor-workspace/QuizEditor';
export default function Page({params}:{params:{id:string}}){return <QuizEditor id={params.id}/>}
