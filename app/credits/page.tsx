import type {Metadata} from 'next';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export const metadata: Metadata = {title:'许可说明'};

export default function CreditsPage() {
  return <div className="min-h-screen pb-20">
    <Navbar/>
    <main className="w-[92%] max-w-3xl mx-auto pt-28">
      <article className="rounded-2xl bg-white/90 dark:bg-slate-900/90 p-6 md:p-10 text-slate-800 dark:text-slate-200 leading-8">
        <h1 className="text-3xl mb-8">许可说明</h1>
        <h2 className="text-xl mb-3">程序与设计来源</h2>
        <p>原项目为 XingHuiSama 创作的 <a className="underline underline-offset-4 text-indigo-600 dark:text-indigo-300" href="https://github.com/heiehiehi/XinghuisamaBlogs" target="_blank" rel="noopener noreferrer">XHBlogs</a>，使用 <a className="underline underline-offset-4 text-indigo-600 dark:text-indigo-300" href="https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans" target="_blank" rel="noopener noreferrer">CC BY-NC 4.0（署名—非商业性使用）</a> 许可。</p>
        <p className="mt-4">cormid 对项目进行了个人内容、GitHub Pages 静态部署、本地管理、媒体和界面功能的修改。此站用于个人非商业分享。许可及原作者的免责声明继续适用于原项目材料。</p>
        <h2 className="text-xl mt-8 mb-3">图片与音乐</h2>
        <p>第三方图片、壁纸及音乐的权利归各自作者和权利人。素材来源另行记录；本站许可不代表对第三方素材拥有授权。音乐由网易云官方歌单播放器提供，曲目可用性由平台决定。</p>
        <Link className="inline-flex min-h-11 items-center mt-8 underline underline-offset-4 text-indigo-600 dark:text-indigo-300" href="/">返回首页</Link>
      </article>
    </main>
  </div>;
}
