'use client';

import { useEffect, useState } from 'react';

export default function Header() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstall, setShowInstall] = useState(false);

    useEffect(() => {
        function handleBeforeInstallPrompt(event) {
            event.preventDefault();

            setDeferredPrompt(event);
            setShowInstall(true);
        }

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt
        );

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt
            );
        };
    }, []);

    async function installApp() {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const result = await deferredPrompt.userChoice;

        if (result.outcome === 'accepted') {
            console.log('App installed');
        }

        setDeferredPrompt(null);
        setShowInstall(false);
    }

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

            {showInstall && (
                <button
                    className='install-button'
                    onClick={installApp}
                >
                    Download App
                </button>
            )}
        </div>
    );
}