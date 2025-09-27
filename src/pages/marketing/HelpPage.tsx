import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';
import { BackButton } from '@/components/shared/BackButton';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        <header className="space-y-2 text-center">
          <BackButton />
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Help Center</h1>
          <p className="text-base text-text-muted max-w-3xl mx-auto">
            Find quick answers to common questions or contact our team.
          </p>
        </header>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3">
              <HelpCircle className="w-6 h-6 text-blood-red" />
              FAQs
            </CardTitle>
            <CardDescription>Answers to the questions we hear most.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="divide-y divide-border rounded-2xl border border-border bg-surface backdrop-blur-xl">
              {[
                {
                  q: 'How do I analyze a CSV or Excel file?',
                  a: 'Go to the chat or dashboard and upload your file. UrekAI will parse, analyze, and let you query it in natural language. You can also export insights and reports.'
                },
                {
                  q: 'Can I connect my Shopify store?',
                  a: 'Yes. Link the UrekAI Shopify widget to automatically fetch store metrics. Your data stays in sync and is available across the web app and WhatsApp.'
                },
                {
                  q: 'Do you support Google Drive?',
                  a: 'You can directly sync documents from Google Drive, keeping all your files up to date in one place.'
                },
                {
                  q: 'Is my data secure?',
                  a: 'We follow a privacy-by-design approach. Your data is encrypted in transit, and we apply strict access controls on our platform.'
                },
              ].map(({ q, a }) => (
                <details key={q} className="group p-5">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-6">
                    <span className="text-text-primary font-medium">{q}</span>
                    <span className="text-text-muted transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-3 text-text-secondary leading-relaxed">{a}</div>
                </details>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-blood-red" />
              Contact us
            </CardTitle>
            <CardDescription>Send us a message and we’ll get back to you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <Input label="Name" placeholder="Your full name" />
              </div>
              <div className="md:col-span-1">
                <Input label="Email" placeholder="you@example.com" type="email" />
              </div>
              <div className="md:col-span-2">
                <Input label="Subject" placeholder="How can we help?" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium text-text-secondary">Message</label>
                <textarea
                  rows={6}
                  placeholder="Describe your question or issue..."
                  className="w-full h-40 px-3 py-2 rounded-xl border border-border bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-blood-red/20 focus:border-blood-red/30 transition-all duration-200 text-sm"
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> Support line coming soon</div>
                  <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Live chat coming soon</div>
                </div>
                <Button variant="primary" size="md" type="button">Send message</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


