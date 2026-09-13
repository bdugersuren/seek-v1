"use client";
import React,{useEffect,useState} from 'react';
const tags=new Set(['p','div','span','strong','b','em','i','u','s','br','ul','ol','li','blockquote','sub','sup','table','thead','tbody','tr','th','td','pre','code']);
export function QuestionContent({html}:{html:string}){
 const [content,setContent]=useState<React.ReactNode>(html);
 useEffect(()=>{const doc=new DOMParser().parseFromString(html,'text/html');function render(node:Node,key:number):React.ReactNode{if(node.nodeType===Node.TEXT_NODE)return node.textContent;if(!(node instanceof Element))return null;const tag=node.tagName.toLowerCase();if(['script','style','iframe','object','svg','form','input'].includes(tag))return null;const children=Array.from(node.childNodes).map(render);return tags.has(tag)?React.createElement(tag,{key},...children):<React.Fragment key={key}>{children}</React.Fragment>;}setContent(Array.from(doc.body.childNodes).map(render));},[html]);
 return <div className="space-y-2 break-words [&_table]:w-full [&_td]:border [&_th]:border [&_li]:ml-4">{content}</div>;
}
