import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/Button';
import { Users, Target, Lightbulb, Rocket, HeartHandshake, ArrowRight } from 'lucide-react';
import { BackButton } from '@/components/shared/BackButton';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        <header className="space-y-2 text-center">
          <BackButton />
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">About UrekAI</h1>
          <p className="text-base text-text-muted max-w-3xl mx-auto">
            We’re building the most approachable way to understand data—so every person and business can act with clarity and confidence.
          </p>
        </header>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3">
              <Target className="w-6 h-6 text-blood-red" />
              Vision
            </CardTitle>
            <CardDescription>
              A world where insight is instant and decisions are informed—no dashboards, no complexity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary leading-relaxed text-base">
              We imagine a future where anyone can ask a question and immediately understand their data. UrekAI exists to turn fragmented files and scattered metrics into clear, conversational answers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-blood-red" />
              What we do
            </CardTitle>
            <CardDescription>
              An AI-powered platform that analyzes your files and business data in seconds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-3">
              {[
                'Analyze CSV and Excel files instantly and export polished insights',
                'Sync documents from Google Drive for a single source of truth',
                'Connect Shopify to auto-fetch metrics and surface trends',
                'Ask natural-language questions and get clear, guided answers',
              ].map((item) => (
                <li key={item} className="text-text-primary leading-relaxed text-base">{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HeartHandshake className="w-6 h-6 text-blood-red" />
              Values
            </CardTitle>
            <CardDescription>
              Principles that shape our product and how we work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[ 
                { title: 'Clarity first', desc: 'Insight should be simple, honest, and actionable.' },
                { title: 'Privacy by design', desc: 'Your data is yours—we guard it rigorously.' },
                { title: 'Craft and speed', desc: 'Beautiful experiences with responsive performance.' },
                { title: 'Customer-obsessed', desc: 'Real problems, solved thoughtfully and iteratively.' },
                { title: 'Reliability', desc: 'Stable foundations and predictable outcomes.' },
                { title: 'Accessibility', desc: 'Approachable for everyone, not just analysts.' },
              ].map(({ title, desc }) => (
                <div key={title} className="rounded-2xl border border-border bg-surface backdrop-blur-xl p-5">
                  <div className="text-text-primary font-semibold mb-1">{title}</div>
                  <div className="text-text-muted text-sm">{desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Rocket className="w-6 h-6 text-blood-red" />
              Journey
            </CardTitle>
            <CardDescription>
              From a simple idea to a platform trusted by growing teams.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {[ 
                { k: '2024', v: 'Concept and prototypes. Validated with early users.' },
                { k: '2025', v: 'Public launch: file analysis, Shopify, alerts, and exports.' },
                { k: 'Future', v: 'Deeper automations, more integrations, and richer collaboration.' },
              ].map(({ k, v }) => (
                <div key={k} className="rounded-2xl border border-border bg-surface backdrop-blur-xl p-5">
                  <div className="text-sm text-text-muted">{k}</div>
                  <div className="text-text-primary font-medium">{v}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blood-red" />
              Team
            </CardTitle>
            <CardDescription>
              A small, product-obsessed team shipping fast with care.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[ 
                { name: 'Product & Design', role: 'Experience, UX, and visual system' },
                { name: 'AI & Data', role: 'Models, pipelines, and accuracy' },
                { name: 'Platform', role: 'Performance, reliability, and tooling' },
              ].map(({ name, role }) => (
                <div key={name} className="rounded-2xl border border-border bg-surface backdrop-blur-xl p-5">
                  <div className="text-text-primary font-semibold">{name}</div>
                  <div className="text-text-muted text-sm">{role}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Join us</CardTitle>
            <CardDescription>
              We’re always looking for thoughtful builders who care about clarity and craft.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-text-primary leading-relaxed text-base max-w-2xl mx-auto mb-6">
              Interested in shaping the future of AI-powered analysis? Reach out and let’s talk.
            </p>
            <Button variant="primary" size="md" className="inline-flex items-center">
              Get in touch
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


