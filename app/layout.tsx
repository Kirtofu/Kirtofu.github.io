import 'katex/dist/katex.min.css';
import type {Metadata} from 'next';
import '@fontsource-variable/noto-serif-sc';
import './globals.css';
import {ThemeProvider} from '../components/ThemeProvider';
import {WallpaperProvider} from '../components/WallpaperProvider';
import {ToastProvider} from '../components/ToastProvider';
import BackgroundSlider from '../components/BackgroundSlider';
import BackgroundEffects from '../components/BackgroundEffects';
import CyberCat from '../components/CyberCat';
import {siteConfig} from '../siteConfig';

export const metadata:Metadata={metadataBase:new URL('https://kirtofu.github.io'),title:{default:siteConfig.title,template:'%s · cormid'},description:siteConfig.bio,icons:{icon:siteConfig.faviconUrl},openGraph:{title:siteConfig.title,description:siteConfig.bio,images:[siteConfig.defaultPostCover]}};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="zh-CN" className="dark" suppressHydrationWarning><body className="min-h-screen font-serif bg-slate-950 text-slate-900 dark:text-slate-100">
 <ThemeProvider><WallpaperProvider><ToastProvider>
 <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
  <BackgroundSlider/>
  <div className="absolute inset-0 wallpaper-overlay" style={{backdropFilter:`blur(${siteConfig.backgroundBlur}px)`,opacity:siteConfig.backgroundOverlayOpacity/100}}/>
  <div className="hidden md:block ambient-effects"><BackgroundEffects/></div>
 </div>
 <div className="relative z-10 min-h-screen">{children}<footer className="text-center px-5 py-6 text-sm text-slate-700 dark:text-slate-300 bg-white/35 dark:bg-slate-950/35 backdrop-blur-md">© {new Date().getFullYear()} cormid · 基于 <a href="https://github.com/heiehiehi/XinghuisamaBlogs" target="_blank" rel="noreferrer" className="underline underline-offset-4">XHBlogs</a> · CC BY-NC 4.0</footer></div>
 <CyberCat/>
 </ToastProvider></WallpaperProvider></ThemeProvider></body></html>;
}
