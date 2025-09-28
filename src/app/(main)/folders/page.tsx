import React from 'react';
import { FoldersPage } from '@/components/features/main/FoldersPage';
import GlobalLayout from '@/layouts/GlobalLayout';

export default function FoldersPageRoute() {
  return (
    <GlobalLayout>
      <FoldersPage />
    </GlobalLayout>
  );
}
