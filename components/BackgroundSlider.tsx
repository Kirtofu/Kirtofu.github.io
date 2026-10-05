"use client";
import {useEffect,useRef,useState} from 'react';
import {siteConfig} from '../siteConfig';
import {useWallpaper} from './WallpaperProvider';
export default function BackgroundSlider(){
 const {paused,index,reduced}=useWallpaper();const video=useRef<HTMLVideoElement>(null);const [failed,setFailed]=useState(false);
 const dynamic=siteConfig.backgroundMode==='video'&&!!siteConfig.bgVideoUrl&&!reduced&&!failed;
 const image=siteConfig.backgroundMode==='video'?siteConfig.bgVideoPoster:siteConfig.bgImages[index];
 useEffect(()=>{const update=()=>{const e=video.current;if(!e)return;if(paused||document.hidden||reduced)e.pause();else e.play().catch(()=>setFailed(true));};update();document.addEventListener('visibilitychange',update);return ()=>document.removeEventListener('visibilitychange',update);},[paused,reduced,dynamic]);
 return <div className="absolute inset-0 overflow-hidden" aria-hidden="true">{image&&<img className="h-full w-full object-cover" src={image} alt=""/>}{dynamic&&<video ref={video} className="absolute inset-0 h-full w-full object-cover" src={siteConfig.bgVideoUrl} poster={siteConfig.bgVideoPoster} muted loop playsInline preload="metadata" onError={()=>setFailed(true)}/>}</div>;
}