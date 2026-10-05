"use client";

import {useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
import {Disc3, ExternalLink, LoaderCircle, Music2, RotateCcw, Square, X} from 'lucide-react';
import styles from './PlaylistDock.module.css';

const playlistUrl = 'https://music.163.com/playlist?id=17931300623';
const playerUrl = 'https://music.163.com/outchain/player?type=0&id=17931300623&auto=0&height=330';

export default function PlaylistDock() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pending, setPending] = useState(false);
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(() => {setPending(false); setSlow(true);}, 12000);
    return () => window.clearTimeout(timer);
  }, [pending, attempt]);

  function loadPlayer() {
    setLoaded(true);
    setPending(true);
    setSlow(false);
    setAttempt(value => value + 1);
  }

  function collapse() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  // The dock belongs to the public blog, not the local editing workspace.
  if (pathname.startsWith('/studio') || pathname.startsWith('/admin')) return null;

  return <aside className={styles.dock} aria-label="博客音乐">
    <section id="cormid-playlist" hidden={!open} className={styles.panel} aria-label="cormid 的歌单"
      onKeyDown={event => {if (event.key === 'Escape') collapse();}}>
      <header className={styles.header}>
        <div><h2>听点音乐</h2><p>cormid 的网易云歌单</p></div>
        <button type="button" className={styles.iconButton} onClick={collapse} aria-label="收起音乐面板"><X size={19}/></button>
      </header>
      {!loaded ? <div className={styles.intro}>
        <Disc3 size={56} strokeWidth={1.25} aria-hidden="true"/>
        <p>给阅读配一首喜欢的歌。</p>
        <button type="button" className={styles.primaryButton} onClick={loadPlayer}><Music2 size={17}/>加载歌单</button>
        <small>加载后，在播放器中点选歌曲开始播放。</small>
      </div> : <>
        {pending && <p className={styles.status} role="status"><LoaderCircle size={16} className={styles.spinner}/>正在连接网易云…</p>}
        {slow && <p className={styles.status} role="status">连接较慢，可以重试或在网易云打开。</p>}
        <iframe key={attempt} src={playerUrl} title="网易云歌单播放器" width="100%" height="350"
          className={styles.player} allow="autoplay" referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setPending(false)} onError={() => {setPending(false); setSlow(true);}}/>
        <div className={styles.actions}>
          <button type="button" onClick={loadPlayer}><RotateCcw size={15}/>重新加载</button>
          <button type="button" onClick={() => {setLoaded(false); setPending(false); setSlow(false);}}><Square size={14}/>停止并关闭播放器</button>
        </div>
        <p className={styles.hint}>收起面板可继续听歌。若播放器空白或歌曲无法播放，请在网易云打开。</p>
      </>}
      <a className={styles.externalLink} href={playlistUrl} target="_blank" rel="noopener noreferrer">在网易云打开歌单<ExternalLink size={15}/></a>
    </section>
    <button ref={toggleRef} type="button" className={styles.toggle} aria-expanded={open} aria-controls="cormid-playlist" onClick={() => setOpen(value => !value)}>
      <Music2 size={18} aria-hidden="true"/>{open ? '收起音乐' : '听点音乐'}
    </button>
  </aside>;
}
