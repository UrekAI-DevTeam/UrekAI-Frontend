import React from 'react';
import { FoldersPage } from '@/pages/app/FoldersPage';
import GlobalLayout from '@/layouts/GlobalLayout';

export default function FoldersPageRoute() {
  return (
    <GlobalLayout>
      <FoldersPage />
    </GlobalLayout>
  );
}
