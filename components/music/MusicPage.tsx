"use client";
import {useEffect,useRef,useState} from 'react';
import {ExternalLink,Music2,Search} from 'lucide-react';
import Navbar from '../Navbar';
import {library,useMusic} from './Provider';
import {RecordCover,ProgressBar,PlaybackButtons,MusicError,VolumeControl} from './Player';
import {formatMusicTime} from '../../lib/music';
import styles from './music.module.css';

export default function MusicPage(){
  const music=useMusic(),[tab,setTab]=useState<'lyrics'|'tracks'>('tracks'),[query,setQuery]=useState('');
  const lyricsRef=useRef<HTMLDivElement>(null),activeRef=useRef<HTMLParagraphElement>(null);
  useEffect(()=>{const container=lyricsRef.current,line=activeRef.current;if(tab==='lyrics'&&container&&line){container.scrollTo({top:line.offsetTop-container.clientHeight/2+line.clientHeight/2,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}},[music.activeLyric,tab]);
  const filtered=music.playlist.map((song,index)=>({song,index})).filter(({song})=>(song.title+' '+song.artist).toLocaleLowerCase().includes(query.toLocaleLowerCase().trim()));
  return <div className="min-h-screen"><Navbar/><main className={styles.page}>
    <header className={styles.pageHeader}><div><h1>音乐馆</h1><p>{library.title} · {music.playlist.length} 首，慢慢听。</p></div><a href={library.url} target="_blank" rel="noopener noreferrer">在网易云打开歌单<ExternalLink size={16}/></a></header>
    <div className={styles.pageGrid}>
      <section className={styles.console} aria-label="音乐播放控制"><RecordCover large/><h2>{music.currentSong.title}</h2><p className={styles.artist}>{music.currentSong.artist}</p><ProgressBar/><PlaybackButtons extra/><VolumeControl/><MusicError/></section>
      <section className={styles.libraryPanel} aria-label="歌单与歌词">
        <div className={styles.tabs} role="tablist" aria-label="查看歌单或歌词">
          <button id="tracks-tab" role="tab" aria-selected={tab==='tracks'} aria-controls="tracks-panel" tabIndex={tab==='tracks'?0:-1} onClick={()=>setTab('tracks')} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){setTab('lyrics');document.getElementById('lyrics-tab')?.focus();}}}>播放列表</button>
          <button id="lyrics-tab" role="tab" aria-selected={tab==='lyrics'} aria-controls="lyrics-panel" tabIndex={tab==='lyrics'?0:-1} onClick={()=>setTab('lyrics')} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){setTab('tracks');document.getElementById('tracks-tab')?.focus();}}}>歌词</button>
        </div>
        {tab==='tracks'?<div id="tracks-panel" role="tabpanel" aria-labelledby="tracks-tab">
          <label className={styles.search}><Search size={17}/><input type="search" aria-label="搜索歌单" placeholder="搜索歌名或歌手" value={query} onChange={e=>setQuery(e.target.value)}/></label>
          <div className={styles.trackList}>{filtered.map(({song,index})=><button className={styles.track} key={song.id} onClick={()=>music.playSong(index)} aria-current={index===music.currentIndex?'true':undefined} aria-label={'播放 '+song.title+' · '+song.artist}><span>{index===music.currentIndex?<Music2 size={17}/>:index+1}</span><span className={styles.trackName}><strong>{song.title}</strong><small>{song.artist}</small></span><time>{formatMusicTime(song.duration)}</time></button>)}{!filtered.length&&<p className={styles.empty}>没有找到这首歌，试试歌名或歌手。</p>}</div>
        </div>:<div id="lyrics-panel" role="tabpanel" aria-labelledby="lyrics-tab" ref={lyricsRef} className={styles.lyricPanel} style={{position:'relative'}}>
          {music.lyrics.length?music.lyrics.map((line,index)=><p key={index} ref={index===music.activeLyric?activeRef:undefined} data-active={index===music.activeLyric}>{line.text}</p>):<p className={styles.empty}>这首歌暂时没有歌词，静静听也很好。</p>}
        </div>}
      </section>
    </div>
  </main></div>;
}
