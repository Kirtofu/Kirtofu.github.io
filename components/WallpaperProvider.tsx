"use client";
import {createContext,useContext,useEffect,useState} from 'react';
import {siteConfig} from '../siteConfig';
const Context=createContext({paused:false,toggle:()=>{},next:()=>{},index:0,reduced:false});
export function WallpaperProvider({children}:{children:React.ReactNode}){
 const [paused,setPaused]=useState(false),[index,setIndex]=useState(0),[reduced,setReduced]=useState(true);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)');const change=()=>setReduced(media.matches);change();media.addEventListener('change',change);try{setPaused(localStorage.getItem('cormid-wallpaper-paused')==='true');}catch{}return ()=>media.removeEventListener('change',change);},[]);
 useEffect(()=>{if(paused||reduced||siteConfig.backgroundMode==='video'||siteConfig.bgImages.length<2)return;const timer=setInterval(()=>setIndex(i=>(i+1)%siteConfig.bgImages.length),12000);return ()=>clearInterval(timer);},[paused,reduced]);
 const toggle=()=>setPaused(v=>{try{localStorage.setItem('cormid-wallpaper-paused',String(!v));}catch{}return !v;});
 return <Context.Provider value={{paused,toggle,index,next:()=>setIndex(i=>(i+1)%Math.max(1,siteConfig.bgImages.length)),reduced}}>{children}</Context.Provider>;
}
export const useWallpaper=()=>useContext(Context);