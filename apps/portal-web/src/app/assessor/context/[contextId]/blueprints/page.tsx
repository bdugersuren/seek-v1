import { BlueprintList } from '@/features/assessor-workspace/BlueprintList';
export default function Page({params}:{params:{contextId:string}}){return <BlueprintList contextId={params.contextId}/>}
