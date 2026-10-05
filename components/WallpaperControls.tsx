"use client";
import {Moon,Sun,Pause,Play,Images,RotateCcw} from 'lucide-react';
import {useTheme} from './ThemeProvider';
import {useWallpaper} from './WallpaperProvider';
import {siteConfig} from '../siteConfig';
export default function WallpaperControls(){
 const {isDark,toggleTheme}=useTheme();const {paused,toggle,next,reduced,index}=useWallpaper();
 return <section className="wallpaper-card h-full min-h-[240px] rounded-3xl overflow-hidden relative shadow-xl border border-white/30">
 <img src={siteConfig.backgroundMode==='video'?(index===0?siteConfig.bgVideoPoster:siteConfig.bgImages[index-1]):(siteConfig.bgImages[index]||siteConfig.bgVideoPoster)} alt="星空壁纸预览" className="absolute inset-0 w-full h-full object-cover"/>
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-slate-950/15"/>
 <div className="relative h-full min-h-[240px] flex flex-col justify-end p-6 text-white"><h2 className="text-2xl font-bold mb-2">留一片星空给自己</h2><p className="text-sm text-slate-200 mb-5">{reduced?'静静地，也很好。':'让思绪慢下来，让喜欢的风景停留。'}</p>
 <div className="flex flex-wrap gap-2"><button className="wallpaper-button" onClick={toggleTheme}>{isDark?<Sun size={16}/>:<Moon size={16}/>} {isDark?'切换白昼':'切换夜色'}</button>{!reduced&&<button className="wallpaper-button" onClick={toggle}>{paused?<Play size={16}/>:<Pause size={16}/>} {paused?'播放壁纸':'暂停壁纸'}</button>}{siteConfig.bgImages.length>(siteConfig.backgroundMode==='video'?0:1)&&<button className="wallpaper-button" onClick={next}><Images size={16}/>换张壁纸</button>}<button className="wallpaper-button" onClick={()=>window.dispatchEvent(new Event('cormid:splash'))}><RotateCcw size={16}/>重播开场</button></div></div></section>;
}