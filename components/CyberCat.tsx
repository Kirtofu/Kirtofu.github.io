"use client";
import {useEffect,useRef,useState} from 'react';
import {motion} from 'framer-motion';
export default function CyberCat(){
 const [speech,setSpeech]=useState('');const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 const speak=()=>{setSpeech(['收到小鱼干啦，喵～','欢迎回来，cormid 的朋友。','今天也要记得休息喵。'][Math.floor(Math.random()*3)]);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setSpeech(''),3500);};
 return <motion.div drag dragMomentum={false} className="hidden md:flex fixed right-5 bottom-5 z-40 items-end gap-2">{speech&&<span role="status" className="rounded-2xl bg-white/95 text-slate-800 px-4 py-3 shadow-lg text-sm max-w-52">{speech}</span>}<button onClick={speak} aria-label="喂猫猫一条小鱼" title="点一下喂鱼，也可以拖动我" className="cursor-grab active:cursor-grabbing rounded-2xl hover:scale-105 transition-transform"><span aria-hidden="true" className="cormid-cat-sprite"/></button></motion.div>;
}