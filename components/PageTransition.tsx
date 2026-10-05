"use client";
import {motion,useReducedMotion} from 'framer-motion';
export default function PageTransition({children,className}:{children:React.ReactNode;className?:string}){const reduced=useReducedMotion();return <motion.div className={className} initial={false} animate={{y:0,opacity:1}} transition={{duration:reduced?0:.2}}>{children}</motion.div>;}