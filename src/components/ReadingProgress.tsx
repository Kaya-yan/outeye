'use client';

import { useEffect, useState } from 'react';

interface Props {
  newsId: string;
}

export default function ReadingProgress({ newsId }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const startTime = Date.now();

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentProgress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

        setProgress(currentProgress);

        const progressBar = document.getElementById('reading-progress-bar');
        if (progressBar) {
          progressBar.style.width = `${currentProgress * 100}%`;
        }

        ticking = false;
      });
    };

    const saveProgress = () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const completed = progress >= 0.95;

      fetch('/api/reading-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId, duration, progress, completed }),
      }).catch(console.error);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', saveProgress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', saveProgress);
      saveProgress();
    };
  }, [newsId, progress]);

  return null;
}
