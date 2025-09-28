import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { BackButton } from '@/components/shared/BackButton';

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        <header className="space-y-2">
          <BackButton />
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Solutions</h1>
          <p className="text-base text-text-muted">
            Discover how UrekAI streamlines understanding your data—whether you’re working solo or running a business.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>UrekAI for Personal</CardTitle>
              <CardDescription>
                Your personal insights engine—analyze files, synthesize information, and export what matters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {[
                  'Upload documents and get AI-powered analysis in seconds',
                  'Sync files directly from Google Drive',
                  'Understand and even edit CSV and Excel files with AI help',
                  'Export polished insights and reports for sharing',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blood-red shrink-0 mt-0.5" />
                    <span className="text-text-primary leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Button variant="primary" size="md">Get started</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>UrekAI for Businesses</CardTitle>
              <CardDescription>
                Always-on, cross-channel insights—from Shopify to your website and WhatsApp—kept in sync and ready to act on.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {[
                  'Auto-fetch Shopify store metrics once the widget is linked',
                  'Stay updated on the go across Shopify, your website, and WhatsApp',
                  'Unified data pipeline—files and metrics auto-synced from every channel',
                  'Direct Google Drive sync for centralized document analysis',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blood-red shrink-0 mt-0.5" />
                    <span className="text-text-primary leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Button variant="secondary" size="md">Talk to sales</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


