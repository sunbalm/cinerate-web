'use client';

import { useEffect, useMemo, useState } from 'react';

function formatSeconds(milliseconds) {
    return Math.max(0, Math.ceil(milliseconds / 1000));
}

export default function LoaderBar({ time, timer, serverNow, receivedAt, label = 'Timer' }) {
    const [clientNow, setClientNow] = useState(null);
    const durationMs = useMemo(() => {
        return timer?.duration ? timer.duration * 1000 : (time || 0) * 1000;
    }, [timer?.duration, time]);

    useEffect(() => {
        if (!timer) {
            return undefined;
        }

        const interval = setInterval(() => {
            setClientNow(Date.now());
        }, 250);

        return () => clearInterval(interval);
    }, [timer]);

    if (!timer && !time) {
        return null;
    }

    if (!timer) {
        return (
            <div className="loader-container" role="timer" aria-live="polite">
                <div className="loader-meta">
                    <span>{label}</span>
                    <span>{time}s</span>
                </div>
                <div className="loader-track">
                    <div
                        className="loader-bar loader-bar-local"
                        style={{ "--duration": `${time}s` }}
                    />
                </div>
            </div>
        );
    }

    const currentServerTime = clientNow && serverNow && receivedAt
        ? serverNow + (clientNow - receivedAt)
        : serverNow || timer.startedAt;
    const remainingMs = Math.max(0, timer.endsAt - currentServerTime);
    const progress = durationMs > 0
        ? Math.min(100, Math.max(0, ((durationMs - remainingMs) / durationMs) * 100))
        : 100;

    return (
        <div className="loader-container" role="timer" aria-live="polite">
            <div className="loader-meta">
                <span>{label}</span>
                <span>{formatSeconds(remainingMs)}s</span>
            </div>
            <div className="loader-track">
                <div
                    className="loader-bar"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
