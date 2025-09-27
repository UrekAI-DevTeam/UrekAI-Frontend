"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/Button';

export const BackButton: React.FC<{ label?: string }>= ({ label = 'Back' }) => {
  const router = useRouter();
  return (
    <div className="mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {label}
      </Button>
    </div>
  );
};


