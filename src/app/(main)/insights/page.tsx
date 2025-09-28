import React from 'react';
import { InsightsPage } from '@/components/features/main/InsightsPage';
import GlobalLayout from '@/layouts/GlobalLayout';

export default function InsightsPageRoute() {
  return (
    <GlobalLayout>
      <InsightsPage />
    </GlobalLayout>
  );
}
