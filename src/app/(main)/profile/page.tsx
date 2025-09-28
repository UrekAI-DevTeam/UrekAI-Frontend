import React from 'react';
import { ProfilePage } from '@/components/features/main/ProfilePage';
import GlobalLayout from '@/layouts/GlobalLayout';

export default function ProfilePageRoute() {
  return (
    <GlobalLayout>
      <ProfilePage />
    </GlobalLayout>
  );
}
