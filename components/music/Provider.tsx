"use client";
import {createContext,useContext,useEffect,useRef,useState,ReactNode} from 'react';
import library from '../../data/music.json';
import {Track,PlayMode,LyricLine,parseLrc,lyricIndex,adjacentIndex} from '../../lib/music';

type Status='idle'|'loading'|'playing'|'paused'|'error';
type MusicState={playlist:Track[];currentSong:Track;currentIndex:number;status:Status;isPlaying:boolean;error:string;currentTime:number;duration:number;canSeek:boolean;volume:number;playMode:PlayMode;lyrics:LyricLine[];activeLyric:number;currentLyric:string;togglePlay:()=>void;playSong:(index:number)=>void;nextSong:()=>void;prevSong:()=>void;seek:(time:number)=>void;setVolume:(value:number)=>void;toggleMode:()=>void;};
const Context=createContext<MusicState|null>(null);
const playlist:Track[]=library.tracks;

export function MusicProvider({children}:{children:ReactNode}) {
  const audio=useRef<HTMLAudioElement>(null);
  const indexRef=useRef(0),request=useRef(0),intent=useRef(false);
  const [currentIndex,setIndex]=useState(0),[status,setStatus]=useState<Status>('idle'),[error,setError]=useState('');
  const [currentTime,setTime]=useState(0),[duration,setDuration]=useState(playlist[0]?.duration||0),[canSeek,setCanSeek]=useState(false);
  const [volume,setVolume]=useState(.65),[playMode,setMode]=useState<PlayMode>('loop'),[lyrics,setLyrics]=useState<LyricLine[]>([]);
  const currentSong=playlist[currentIndex];

  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('cormid:music')||'{}');if(Number.isFinite(saved.volume))setVolume(Math.max(0,Math.min(1,saved.volume)));if(['loop','single','random'].includes(saved.mode))setMode(saved.mode);}catch{}},[]);
  useEffect(()=>{if(audio.current)audio.current.volume=volume;try{localStorage.setItem('cormid:music',JSON.stringify({volume,mode:playMode}));}catch{}},[volume,playMode]);
  useEffect(()=>{
    setLyrics([]);
    if(!currentSong?.lyricUrl)return;
    const controller=new AbortController();
    fetch(currentSong.lyricUrl,{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(d=>setLyrics(parseLrc(d.lrc||''))).catch(()=>{});
    return()=>controller.abort();
  },[currentSong?.lyricUrl]);
  useEffect(()=>{
    if(status!=='loading')return;
    const timer=window.setTimeout(()=>{intent.current=false;request.current++;audio.current?.pause();setStatus('error');setError('连接超时，请重试或切换下一首。');},20000);
    return()=>window.clearTimeout(timer);
  },[status,currentIndex]);

  function fail(message='这首歌暂时无法播放，可以重试、切换下一首或在网易云打开。') {
    intent.current=false;setStatus('error');setError(message);
  }
  function playSong(index:number) {
    const element=audio.current,song=playlist[index];
    if(!element||!song)return;
    const token=++request.current;
    intent.current=true;setError('');setStatus('loading');
    if(indexRef.current!==index||!element.getAttribute('src')||element.error){
      element.pause();element.src=song.src;element.load();indexRef.current=index;setIndex(index);setTime(0);setDuration(song.duration);setCanSeek(false);
    }
    element.play().catch(reason=>{if(token!==request.current)return;fail(reason?.name==='NotAllowedError'?'浏览器暂停了播放，请再点一次播放按钮。':undefined);});
  }
  function togglePlay(){
    if(intent.current){intent.current=false;request.current++;audio.current?.pause();setStatus('paused');}
    else playSong(indexRef.current);
  }
  function step(direction:1|-1){playSong(adjacentIndex(indexRef.current,playlist.length,direction,playMode));}
  function seek(time:number){if(audio.current&&canSeek&&Number.isFinite(time)){audio.current.currentTime=Math.max(0,Math.min(duration,time));setTime(audio.current.currentTime);}}
  function timeUpdate(){const element=audio.current;if(element){setTime(element.currentTime);if(Number.isFinite(element.duration)&&element.duration>0){setDuration(element.duration);setCanSeek(true);}}}
  const activeLyric=lyricIndex(lyrics,currentTime);
  const currentLyric=activeLyric>=0?lyrics[activeLyric].text:(lyrics[0]?.text||'让喜欢的旋律，陪你慢慢阅读。');

  return <Context.Provider value={{playlist,currentSong,currentIndex,status,isPlaying:status==='playing',error,currentTime,duration,canSeek,volume,playMode,lyrics,activeLyric,currentLyric,togglePlay,playSong,nextSong:()=>step(1),prevSong:()=>step(-1),seek,setVolume:value=>setVolume(Math.max(0,Math.min(1,value))),toggleMode:()=>setMode(value=>value==='loop'?'single':value==='single'?'random':'loop')}}>
    {children}
    <audio ref={audio} preload="none" onTimeUpdate={timeUpdate} onLoadedMetadata={timeUpdate}
      onPlaying={()=>{if(intent.current){setStatus('playing');setError('');}else audio.current?.pause();}}
      onPause={()=>{if(!intent.current)setStatus(previous=>previous==='error'?'error':'paused');}}
      onWaiting={()=>{if(intent.current)setStatus('loading');}}
      onError={()=>fail()} onEnded={()=>{if(playMode==='single'&&audio.current){audio.current.currentTime=0;playSong(indexRef.current);}else step(1);}}/>
  </Context.Provider>;
}
export function useMusic(){const state=useContext(Context);if(!state)throw new Error('Missing MusicProvider');return state;}
export {library};
