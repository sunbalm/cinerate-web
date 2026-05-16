// components/RegisterServiceWorker.js

'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {

    useEffect(() => {

        if (
            'serviceWorker' in navigator &&
            process.env.NODE_ENV === 'production'
        ) {

            navigator.serviceWorker
                .register('/sw.js')
                .then(() => {
                    console.log('Service Worker Registered');
                })
                .catch((error) => {
                    console.error(error);
                });
        }

    }, []);

    return null;
}