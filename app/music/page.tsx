import type {Metadata} from 'next';
import MusicPage from '../../components/music/MusicPage';
export const metadata:Metadata={title:'音乐馆'};
export default function Page(){return <MusicPage/>;}
