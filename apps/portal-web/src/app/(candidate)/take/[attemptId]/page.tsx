import {redirect} from "next/navigation";
export default function Take({params}:{params:{attemptId:string}}){redirect(`https://quiz.seek.mn/take/${encodeURIComponent(params.attemptId)}`);}
