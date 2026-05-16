'use client';

import { useEffect, useState } from 'react';

export default function InstallInstructions() {
    const [browser, setBrowser] = useState('');

    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase();

        if (ua.includes('safari') && !ua.includes('chrome')) {
            setBrowser('safari');
        } else if (ua.includes('chrome')) {
            setBrowser('chrome');
        } else {
            setBrowser('default');
        }
    }, []);

    return (
        <div className="install-help">
            {browser === 'chrome' && (
                <p className="small">
                    To install CineRate, click the install icon in your browser address bar.
                </p>
            )}

            {browser === 'safari' && (
                <p className="small">
                    To install CineRate, go to File → Add to Dock.
                </p>
            )}

            {browser === 'default' && (
                <p className="small">
                    To install CineRate, use your browser’s Add to Home Screen or Install option.
                </p>
            )}
        </div>
    );
}