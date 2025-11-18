"use client"

import { useRef, useEffect } from "react"

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(error => {
        console.error('Video playback failed:', error);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/images/adspace2.mp4" type="video/mp4" />
      </video>
    </div>
  );
} 