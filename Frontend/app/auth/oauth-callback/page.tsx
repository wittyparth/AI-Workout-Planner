'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { tokenStorage } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';

export default function OAuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { updateUser } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const accessToken = searchParams.get('accessToken');
                const refreshToken = searchParams.get('refreshToken');
                const userId = searchParams.get('userId');

                if (!accessToken || !refreshToken) {
                    throw new Error('Missing authentication tokens');
                }

                // Store tokens
                tokenStorage.setTokens(accessToken, refreshToken);

                // Fetch user profile
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const userData = await response.json();
                updateUser(userData.data);

                toast.success('Successfully logged in!');
                router.push('/');
            } catch (error) {
                console.error('OAuth callback error:', error);
                toast.error('Authentication failed. Please try again.');
                router.push('/auth/login');
            }
        };

        handleCallback();
    }, [searchParams, router, updateUser]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="spinner-linear w-8 h-8 mx-auto"></div>
                <p className="text-muted-foreground">Completing sign in...</p>
            </div>
        </div>
    );
}
