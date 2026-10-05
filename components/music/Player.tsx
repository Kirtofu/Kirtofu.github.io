"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {ArrowUpRight,LoaderCircle,Pause,Play,Repeat,Repeat1,Shuffle,SkipBack,SkipForward,Volume2,VolumeX,Music2} from 'lucide-react';
import {useMusic} from './Provider';
import {siteConfig} from '../../siteConfig';
import {formatMusicTime} from '../../lib/music';
import styles from './music.module.css';

export function RecordCover({large=false}:{large?:boolean}) {
  const {currentSong,isPlaying}=useMusic();
  const [failed,setFailed]=useState('');
  return <div className={`${styles.record} ${large?styles.largeRecord:''}`} style={{animationPlayState:isPlaying?'running':'paused'}}>
    <img src={failed===currentSong.id?siteConfig.avatarUrl:(currentSong.cover||siteConfig.avatarUrl)} alt={currentSong.title+' 唱片封面'} referrerPolicy="no-referrer" onError={()=>setFailed(currentSong.id)}/><span/>
  </div>;
}
export function ProgressBar(){const music=useMusic();return <div className={styles.progress}>
  <span>{formatMusicTime(music.currentTime)}</span><input type="range" aria-label="歌曲播放进度" aria-valuetext={`${formatMusicTime(music.currentTime)} / ${formatMusicTime(music.duration)}`} min={0} max={music.duration||1} step={.1} value={Math.min(music.currentTime,music.duration)} disabled={!music.canSeek} onChange={e=>music.seek(Number(e.target.value))}/><span>{formatMusicTime(music.duration)}</span>
  </div>;}
export function PlaybackButtons({extra=false}:{extra?:boolean}){
  const music=useMusic(),Mode=music.playMode==='loop'?Repeat:music.playMode==='single'?Repeat1:Shuffle;
  const modeName=music.playMode==='loop'?'列表循环':music.playMode==='single'?'单曲循环':'随机播放';
  return <div className={styles.controls}>
    {extra&&<button className={styles.iconButton} onClick={music.toggleMode} title={modeName} aria-label={'播放模式：'+modeName+'，点击切换'}><Mode size={19}/></button>}
    <button className={styles.iconButton} onClick={music.prevSong} aria-label="上一首"><SkipBack size={21}/></button>
    <button className={styles.playButton} onClick={music.togglePlay} aria-label={music.status==='loading'?'取消加载':music.isPlaying?'暂停音乐':'播放音乐'}>
      {music.status==='loading'?<LoaderCircle className={styles.spinner} size={23}/>:music.isPlaying?<Pause size={23} fill="currentColor"/>:<Play size={23} fill="currentColor"/>}
    </button>
    <button className={styles.iconButton} onClick={music.nextSong} aria-label="下一首"><SkipForward size={21}/></button>
    {extra&&<Link className={styles.iconButton} href="/music/" aria-label="打开音乐馆与歌单"><ArrowUpRight size={20}/></Link>}
  </div>;
}
export function MusicError(){const {error,currentSong,playSong,currentIndex}=useMusic();return error?<div className={styles.error} role="status"><p>{error}</p><button onClick={()=>playSong(currentIndex)}>重试播放</button><a href={'https://music.163.com/song?id='+currentSong.id} target="_blank" rel="noopener noreferrer">在网易云打开</a></div>:null;}
export function VolumeControl(){const {volume,setVolume}=useMusic();return <div className={styles.volume}><button className={styles.iconButton} onClick={()=>setVolume(volume===0?.65:0)} aria-label={volume===0?'取消静音':'静音'}>{volume===0?<VolumeX size={19}/>:<Volume2 size={19}/>}</button><input type="range" min={0} max={1} step={.01} aria-label="音乐音量" value={volume} onChange={e=>setVolume(Number(e.target.value))}/><output>{Math.round(volume*100)}%</output></div>;}
export default function MusicCard(){const music=useMusic();return <section className={styles.card} aria-label="音乐播放器">
  <div className={styles.cardHeading}><RecordCover/><div className={styles.songInfo}><h2 title={music.currentSong.title}>{music.currentSong.title}</h2><p>{music.currentSong.artist}</p><Link href="/music/">我的歌单 · {music.playlist.length} 首<ArrowUpRight size={14}/></Link></div></div>
  <p className={styles.oneLyric}>{music.currentLyric}</p><ProgressBar/><PlaybackButtons extra/><MusicError/>
  </section>;}
export function LyricBar(){const {currentLyric,isPlaying}=useMusic();return <div className={styles.lyricBar}><div className={styles.waves} aria-hidden="true">{[0,1,2,3,4].map(index=><i key={index} style={{animationDelay:`${index*130}ms`,animationPlayState:isPlaying?'running':'paused'}}/>)}</div><p>{currentLyric}</p><Music2 size={21} aria-hidden="true"/></div>;}
export function FloatingPlayer(){
  const path=usePathname(),music=useMusic();
  if(path==='/'||path==='/music/'||path==='/music'||path.startsWith('/studio')||path.startsWith('/editor'))return null;
  return <aside className={styles.floatingWrap} aria-label="迷你音乐播放器">
    {music.error&&<div className={styles.miniStatus}><MusicError/></div>}
    <div className={styles.floating}><Link href="/music/" aria-label="打开音乐馆"><RecordCover/></Link><Link href="/music/" className={styles.floatingTitle}>{music.currentSong.title}{music.status==='loading'&&<small role="status">正在缓冲…</small>}</Link>
      <button className={styles.iconButton} onClick={music.togglePlay} aria-label={music.status==='loading'?'取消加载':music.isPlaying?'暂停音乐':'播放音乐'}>{music.status==='loading'?<LoaderCircle size={20} className={styles.spinner}/>:music.isPlaying?<Pause size={20}/>:<Play size={20}/>}</button>
      <button className={styles.iconButton} onClick={music.nextSong} aria-label="下一首"><SkipForward size={19}/></button>
    </div>
  </aside>;
}
