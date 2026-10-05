"use client";
import {createContext,useContext,useEffect,useState} from 'react';
const Context=createContext({isDark:true,toggleTheme:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){
 const [isDark,setIsDark]=useState(true);
 useEffect(()=>{try{setIsDark(localStorage.getItem('blog-theme')!=='light');}catch{}},[]);
 useEffect(()=>{document.documentElement.classList.toggle('dark',isDark);},[isDark]);
 const toggleTheme=()=>setIsDark(v=>{try{localStorage.setItem('blog-theme',v?'light':'dark');}catch{}return !v;});
 return <Context.Provider value={{isDark,toggleTheme}}>{children}</Context.Provider>;
}
export const useTheme=()=>useContext(Context);