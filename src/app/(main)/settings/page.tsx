import React from 'react';
import { SettingsPage } from '@/components/features/main/SettingsPage';
import GlobalLayout from '@/layouts/GlobalLayout';

export default function SettingsPageRoute() {
  return (
    <GlobalLayout>
      <SettingsPage />
    </GlobalLayout>
  );
}
