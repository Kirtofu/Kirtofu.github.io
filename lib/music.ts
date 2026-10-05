export type LyricLine = {time:number; text:string};
export type Track = {id:string; title:string; artist:string; album:string; cover:string; duration:number; src:string; lyricUrl:string};
export type PlayMode = 'loop' | 'single' | 'random';

export function parseLrc(input:string):LyricLine[] {
  const offset = Number(input.match(/\[offset:([+-]?\d+)\]/i)?.[1] || 0) / 1000;
  const result:LyricLine[] = [];
  for (const line of input.slice(0,100000).split(/\r?\n/)) {
    const stamps = [...line.matchAll(/\[(\d+):(\d{2})(?:[.:](\d{1,3}))?\]/g)];
    const text = line.replace(/\[[^\]]*\]/g,'').replace(/[\u0000-\u001F\u007F]/g,'').trim();
    if (!text) continue;
    for (const match of stamps) result.push({time:Math.max(0,Number(match[1])*60+Number(match[2])+Number('0.'+(match[3]||'0'))-offset),text});
  }
  return result.sort((a,b)=>a.time-b.time);
}
export function lyricIndex(lines:LyricLine[],time:number) {
  let result=-1;
  for(let i=0;i<lines.length && lines[i].time<=time;i++) result=i;
  return result;
}
export function adjacentIndex(index:number,count:number,direction:1|-1,mode:PlayMode,random=Math.random()) {
  if(count<=1)return 0;
  if(mode==='random')return (index+1+Math.floor(Math.min(.999999,Math.max(0,random))*(count-1)))%count;
  return (index+direction+count)%count;
}
export function formatMusicTime(time:number) {
  const seconds=Number.isFinite(time)?Math.max(0,Math.floor(time)):0;
  return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;
}
