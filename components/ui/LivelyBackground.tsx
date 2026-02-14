"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
    left: string;
    top: string;
    delay: string;
    duration: string;
    opacity: number;
    // For snow/rain
    scale?: number;
}

interface Cloud {
    width: string;
    height: string;
    top: string;
    left: string;
    delay: string;
    duration: string;
    opacity: number;
}

type WeatherType = 'sunny' | 'rainy' | 'night' | 'winter';

export function LivelyBackground() {
    const [fireflies, setFireflies] = useState<Particle[]>([]);
    const [clouds, setClouds] = useState<Cloud[]>([]);
    const [weatherParticles, setWeatherParticles] = useState<Particle[]>([]);
    const [weather, setWeather] = useState<WeatherType>('sunny');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Randomly select weather on mount
        const hour = new Date().getHours();
        const isNightTime = hour >= 20 || hour < 6;

        const rand = Math.random();
        let initialWeather: WeatherType = 'sunny';

        if (isNightTime) initialWeather = 'night';
        else if (rand < 0.25) initialWeather = 'rainy';
        else if (rand < 0.5) initialWeather = 'winter';
        else initialWeather = 'sunny';

        setWeather(initialWeather);
    }, []);

    // Regenerate particles when weather changes
    useEffect(() => {
        if (!mounted) return;

        // Fireflies
        const fireflyCount = weather === 'night' ? 30 : (weather === 'sunny' ? 15 : 5);
        const newFireflies = Array.from({ length: fireflyCount }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`,
            duration: `${10 + Math.random() * 10}s`,
            opacity: Math.random() * 0.8,
        }));
        setFireflies(newFireflies);

        // Clouds
        const cloudCount = weather === 'rainy' ? 8 : 4;
        const newClouds = Array.from({ length: cloudCount }).map((_, i) => ({
            width: `${100 + Math.random() * 200}px`,
            height: `${40 + Math.random() * 60}px`,
            top: `${Math.random() * 40}%`,
            left: `-20%`,
            delay: `${i * 5}s`,
            duration: `${30 + Math.random() * 20}s`,
            opacity: weather === 'rainy' ? 0.8 : 0.4
        }));
        setClouds(newClouds);

        // Rain/Snow Particles
        if (weather === 'rainy' || weather === 'winter') {
            const particleCount = weather === 'rainy' ? 100 : 50;
            const newParticles = Array.from({ length: particleCount }).map(() => ({
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                delay: `${Math.random() * 2}s`,
                duration: weather === 'rainy' ? `${0.5 + Math.random() * 0.5}s` : `${5 + Math.random() * 5}s`,
                opacity: Math.random(),
                scale: Math.random() * 0.5 + 0.5
            }));
            setWeatherParticles(newParticles);
        } else {
            setWeatherParticles([]);
        }
    }, [weather, mounted]);

    if (!mounted) return null;

    // Background overlay color based on weather
    const overlayColor = {
        'sunny': 'bg-black/20', // Light filtering
        'rainy': 'bg-blue-900/40', // Dark gloomy
        'night': 'bg-black/60', // Dark
        'winter': 'bg-white/10', // Cold tint
    }[weather];

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Base Layer: Static Farm Background */}
            <div
                className={cn(
                    "absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000",
                    weather === 'winter' && "grayscale-[0.5] brightness-110", // Winter look
                    weather === 'night' && "brightness-50 saturate-50", // Night look
                    weather === 'rainy' && "brightness-75 contrast-125" // Rainy look
                )}
                style={{
                    backgroundImage: 'url(/farm-bg.png)',
                    imageRendering: 'pixelated',
                }}
            />

            {/* Weather Overlay */}
            <div className={cn("absolute inset-0 z-[1] transition-colors duration-1000", overlayColor)} />

            {/* Lightning Flash (Rainy only) */}
            {weather === 'rainy' && (
                <div className="absolute inset-0 z-[2] pointer-events-none" style={{ animation: 'flash 8s infinite' }} />
            )}

            {/* Weather Particles (Rain/Snow) */}
            {(weather === 'rainy' || weather === 'winter') && (
                <div className="absolute inset-0 z-[2]">
                    {weatherParticles.map((p, i) => (
                        <div
                            key={i}
                            className={cn(
                                "absolute",
                                weather === 'rainy' ? "w-0.5 h-4 bg-blue-200/60" : "w-1.5 h-1.5 bg-white rounded-full blur-[1px]",
                                weather === 'rainy' ? "animate-rain" : "animate-snow"
                            )}
                            style={{
                                left: p.left,
                                animationDelay: p.delay,
                                animationDuration: p.duration,
                                opacity: p.opacity,
                                transform: `scale(${p.scale})`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Fireflies Layer */}
            <div className="absolute inset-0 z-[3]">
                {fireflies.map((f, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-300 rounded-full blur-[1px] animate-float"
                        style={{
                            left: f.left,
                            top: f.top,
                            animationDelay: f.delay,
                            animationDuration: f.duration,
                            opacity: f.opacity,
                        }}
                    />
                ))}
            </div>

            {/* Clouds Layer */}
            <div className={cn("absolute top-0 left-0 w-full h-1/3 z-[4] transition-opacity duration-1000", weather === 'night' ? "opacity-20" : "opacity-60")}>
                {clouds.map((c, i) => (
                    <div
                        key={i}
                        className={cn(
                            "absolute blur-xl rounded-full animate-drift",
                            weather === 'rainy' ? "bg-gray-600/60" : "bg-white/40"
                        )}
                        style={{
                            width: c.width,
                            height: c.height,
                            top: c.top,
                            left: c.left,
                            animationDelay: c.delay,
                            animationDuration: c.duration,
                        }}
                    />
                ))}
            </div>

            {/* Weather Debug Controls (Hidden in production or subtle) */}
            <div className="fixed bottom-4 left-4 z-50 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                {(['sunny', 'rainy', 'night', 'winter'] as const).map(w => (
                    <button
                        key={w}
                        onClick={() => {
                            setWeather(w);
                            // Re-trigger particle generation if needed, simpler to just set state for visual test first
                        }}
                        className="bg-black/50 text-white text-xs px-2 py-1 rounded"
                    >
                        {w}
                    </button>
                ))}
            </div>
        </div>
    );
}
