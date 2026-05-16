'use client';

import { useEffect, useState } from 'react';

export default function Header() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        function handleBeforeInstallPrompt(event) {
            event.preventDefault();
            setDeferredPrompt(event);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    function getInstallInstructions() {
        const userAgent = navigator.userAgent.toLowerCase();

        if (/iphone|ipad|ipod/.test(userAgent)) {
            return 'To install CineRate: tap Share, then Add to Home Screen.';
        }

        if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
            return 'To install CineRate: open Safari menu, then choose Add to Dock.';
        }

        if (userAgent.includes('chrome') || userAgent.includes('edg')) {
            return 'To install CineRate: use the Chrome menu, then choose Install App.';
        }

        return 'To install CineRate: use your browser menu and choose Install or Add to Home Screen.';
    }

    async function installApp() {
        if (deferredPrompt) {
            deferredPrompt.prompt();

            const result = await deferredPrompt.userChoice;

            if (result.outcome === 'accepted') {
                setDeferredPrompt(null);
            }

            return;
        }

        alert(getInstallInstructions());
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

            <button
                className='install-button'
                onClick={installApp}
            >
                Download App
            </button>
        </div>
    );
}