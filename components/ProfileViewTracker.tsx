'use client';

import { useEffect } from 'react';
import { saveAnalytics } from '@/app/actions/analytics';

export function ProfileViewTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    if (profileId) {
      saveAnalytics(profileId, 'view');
    }
  }, [profileId]);

  return null;
}

