"use client";
import React, { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-[79px] left-0 w-full h-1 bg-slate-100/50 z-[110] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_0_8px_rgba(249,115,22,0.6)] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
