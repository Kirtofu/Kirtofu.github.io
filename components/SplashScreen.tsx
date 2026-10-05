"use client";
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {AnimatePresence,motion} from 'framer-motion';
import {siteConfig} from '../siteConfig';
export default function SplashScreen(){
 const path=usePathname();const [show,setShow]=useState(path==='/');const [round,setRound]=useState(0);
 useEffect(()=>{const replay=()=>{setRound(v=>v+1);setShow(true);};window.addEventListener('cormid:splash',replay);return()=>window.removeEventListener('cormid:splash',replay);},[]);
 useEffect(()=>{if(!show)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){setShow(false);return;}const timer=setTimeout(()=>setShow(false),2200);const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setShow(false);};window.addEventListener('keydown',escape);return()=>{clearTimeout(timer);window.removeEventListener('keydown',escape);};},[show,round]);
 return <><noscript><style>{'.cormid-splash{display:none!important}'}</style></noscript><AnimatePresence>{show&&<motion.div key={round} className="cormid-splash fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-white dark:bg-slate-950" exit={{opacity:0,scale:1.06,filter:'blur(14px)'}} transition={{duration:.55}} aria-label="cormid 入站动画">
  <div className="relative w-24 h-24 mb-8"><motion.div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-[3px]" animate={{rotate:360}} transition={{duration:4,repeat:Infinity,ease:'linear'}}/><div className="relative w-full h-full rounded-full p-1.5 bg-white dark:bg-slate-900 shadow-xl"><img src={siteConfig.avatarUrl} alt="cormid 的头像" className="w-full h-full rounded-full object-cover"/></div></div>
  <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-3">{siteConfig.authorName}</h1><p className="text-sm text-slate-500 dark:text-slate-400 mb-10">欢迎来到我的小窝</p>
  <div className="w-40 h-0.5 bg-slate-200 dark:bg-slate-800 overflow-hidden" aria-hidden="true"><motion.div className="h-full bg-indigo-500" initial={{width:'0%'}} animate={{width:'100%'}} transition={{duration:1.8,ease:'easeInOut'}}/></div>
  <button onClick={()=>setShow(false)} className="mt-10 px-4 py-2 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:bg-indigo-500/10">跳过开场</button>
 </motion.div>}</AnimatePresence></>;
}
