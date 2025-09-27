import React from 'react';
import { InsightsPage } from '@/pages/app/InsightsPage';
import GlobalLayout from '@/layouts/GlobalLayout';

export default function InsightsPageRoute() {
  return (
    <GlobalLayout>
      <InsightsPage />
    </GlobalLayout>
  );
}
