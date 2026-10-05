import {readdir,copyFile} from 'node:fs/promises';
import path from 'node:path';

// Some Next 16 static exports write segment payloads into nested folders,
// while the client requests dot-delimited names. Pages has no rewrite server.
const root=path.resolve('out');
let aliases=0;
async function visit(directory){
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const file=path.join(directory,entry.name);
    if(entry.isDirectory()){await visit(file);continue;}
    if(!entry.name.endsWith('.txt'))continue;
    const parts=path.relative(root,file).split(path.sep);
    const segment=parts.findIndex(part=>part.startsWith('__next.'));
    if(segment<0||segment===parts.length-1)continue;
    const target=path.join(root,...parts.slice(0,segment),parts.slice(segment).join('.'));
    await copyFile(file,target);aliases++;
  }
}
await visit(root);
console.log(`Static navigation: ${aliases} segment aliases ready.`);
