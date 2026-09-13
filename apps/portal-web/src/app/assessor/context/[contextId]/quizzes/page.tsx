import {QuizList} from '@/features/assessor-workspace/QuizList';
export default function Page({params}:{params:{contextId:string}}){return <QuizList contextId={params.contextId}/>}
