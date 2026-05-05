'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerIndexRedirect() {
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            router.replace('/owner/dashboard');
        }
    }, [router]);
    
    return null;
}
