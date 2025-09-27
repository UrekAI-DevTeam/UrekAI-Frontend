import React from 'react';
import { SettingsPage } from '@/pages/app/SettingsPage';
import GlobalLayout from '@/layouts/GlobalLayout';

export default function SettingsPageRoute() {
  return (
    <GlobalLayout>
      <SettingsPage />
    </GlobalLayout>
  );
}
