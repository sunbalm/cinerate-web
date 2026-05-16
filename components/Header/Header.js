'use client';

import { useEffect, useState } from 'react';

export default function Header() {
    const [installMessage, setInstallMessage] = useState('');

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone;

        if (isStandalone) {
            setInstallMessage('');
            return;
        }

        if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
            setInstallMessage('Install: File → Add to Dock');
        } else if (userAgent.includes('chrome') || userAgent.includes('edg')) {
            setInstallMessage('Install from the browser address bar');
        } else {
            setInstallMessage('Install from your browser menu');
        }
    }, []);

    return (
        <div className='header'>
            <div className='header-left'>
                <h1>
                    <span className='cine-font'>cine</span>
                    Rate
                </h1>

                <p className='small'>
                    Guess IMDB ratings with friends
                </p>
            </div>

            {installMessage && (
                <p className='install-message small'>
                    {installMessage}
                </p>
            )}
        </div>
    );
}