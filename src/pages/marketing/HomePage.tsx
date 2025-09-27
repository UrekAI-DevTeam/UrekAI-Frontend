import React from 'react';
import Landing from '@/features/pages/Landing';

export const getServerSideProps = async () => ({ props: {} });

export default function HomePage() {
  return <Landing />;
}


