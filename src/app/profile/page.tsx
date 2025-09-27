import React from 'react';
import { ProfilePage } from '@/pages/app/ProfilePage';
import GlobalLayout from '@/layouts/GlobalLayout';

export default function ProfilePageRoute() {
  return (
    <GlobalLayout>
      <ProfilePage />
    </GlobalLayout>
  );
}
