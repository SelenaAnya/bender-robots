'use client';

import React from 'react';
import styles from './VideoBackground.module.css';

interface VideoBackgroundProps {
    videoSrc: string;
    opacity?: number;
    children?: React.ReactNode;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
    videoSrc, 
    opacity = 0.5, 
    children 
}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.videoContainer}>
                <video
                    className={styles.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={videoSrc} type="video/mp4" />
                </video>
                <div 
                    className={styles.overlay} 
                    style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
                />
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default VideoBackground;