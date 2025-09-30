"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Activity,
  Plus,
  Calendar,
  Download,
  Brain,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { chatAPI } from '@/services/api';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { PinItemModal, PinnedItem } from '@/components/shared/chat/PinItemModal';

export const Dashboard: React.FC = () => {
  console.log('Dashboard component rendering...');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinSlotIndex, setPinSlotIndex] = useState<number | null>(null);
  const [pinned, setPinned] = useState<Array<PinnedItem | null>>([null, null, null, null]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dashboard.pins');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) setPinned(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dashboard.pins', JSON.stringify(pinned));
    } catch {}
  }, [pinned]);

  const TinyLineChart = ({ data, stroke, fill }: { data: number[]; stroke: string; fill: string }) => {
    const width = 280;
    const height = 100;
    const padding = 6;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = (width - padding * 2) / (data.length - 1);
    const points = data
      .map((d, i) => {
        const x = padding + i * stepX;
        const y = padding + (height - padding * 2) * (1 - (d - min) / range);
        return `${x},${y}`;
      })
      .join(' ');
    const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;
    const trendUp = data[data.length - 1] >= data[0];
    return (
      <div className="w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
          <defs>
            <linearGradient id={`grad-${stroke}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fill} stopOpacity="0.35" />
              <stop offset="100%" stopColor={fill} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points={areaPoints} fill={`url(#grad-${stroke})`} stroke="none" />
          <polyline points={points} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className={`text-xs font-medium ${trendUp ? 'text-success' : 'text-error'}`}>
          {trendUp ? 'Trending up' : 'Trending down'}
        </div>
      </div>
    );
  };

  const dailyInsights = [
    {
      id: 1,
      title: "Revenue uptick driven by repeat customers",
      summary: "Chats suggest a 12% MoM rise in orders from returning users. Offer tiered loyalty perks to sustain momentum.",
      date: "2 hours ago",
      chatsAnalyzed: 18,
    },
    {
      id: 2,
      title: "Onboarding confusion around billing settings",
      summary: "Multiple chats flagged difficulty locating invoice downloads. Add a shortcut in Settings > Billing.",
      date: "5 hours ago",
      chatsAnalyzed: 9,
    },
    {
      id: 3,
      title: "High interest in CSV exports for reports",
      summary: "Users frequently requested CSV for weekly activity. Prioritize export presets (last 7/30 days).",
      date: "1 day ago",
      chatsAnalyzed: 24,
    },
    {
      id: 4,
      title: "Support volume spikes after product updates",
      summary: "Chats clustered within 24h post-release. Add in-app release notes and quick tips modal.",
      date: "2 days ago",
      chatsAnalyzed: 15,
    }
  ];

  const quickActions = [
    {
      title: "Upload New Dataset",
      description: "Add new data files for analysis",
      icon: Plus,
      action: "upload"
    },
    {
      title: "Start New Chat",
      description: "Begin a conversation with your data",
      icon: Users,
      action: "chat"
    },
    {
      title: "View All Insights",
      description: "Browse comprehensive analysis results",
      icon: BarChart3,
      action: "insights"
    },
    {
      title: "Export Reports",
      description: "Download analysis reports",
      icon: Download,
      action: "export"
    }
  ];

  console.log('Dashboard component about to render JSX...');
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 min-h-screen text-text-primary">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-muted mt-1 text-sm">
            Welcome back! Here's what's happening with your data.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button variant="outline" size="md" className="gap-2 w-full sm:w-auto">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Last 30 days</span>
            <span className="sm:hidden">30 days</span>
          </Button>
          <Button size="md" className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Analysis</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>


      {pinModalOpen && (
        <PinItemModal
          open={pinModalOpen}
          onClose={() => setPinModalOpen(false)}
          onSelect={(picked) => {
            if (pinSlotIndex !== null) {
              const next = [...pinned];
              next[pinSlotIndex] = picked;
              setPinned(next);
            }
          }}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Daily Insights and Templates */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Daily Insights */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-semibold text-text-primary">Daily Insights</CardTitle>
                  <CardDescription className="text-sm mt-1 text-text-muted">AI-curated summaries from your latest chats</CardDescription>
                </div>
                <Link href="/insights">
                  <Button variant="ghost" size="sm" className="text-text-secondary hover:bg-interactive-hover">View all</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background-surface-secondary border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-bright/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Revenue</span>
                    </div>
                    <span className="text-xs text-text-muted">Daily</span>
                  </div>
                  <TinyLineChart data={[42,48,46,52,58,61,67,64,70,73]} stroke="#2563eb" fill="#2563eb" />
                  <div className="mt-2 text-xs text-text-muted">
                    <span className="font-medium text-success">Trending Up</span>
                    <div className="mt-1">Highlighted Text Rest of the insight</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background-surface-secondary border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-bright/20 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Revenue</span>
                    </div>
                    <span className="text-xs text-text-muted">Daily</span>
                  </div>
                  <TinyLineChart data={[60,58,57,55,54,52,50,49,48,47]} stroke="#2563eb" fill="#2563eb" />
                  <div className="mt-2 text-xs text-text-muted">
                    <span className="font-medium text-error">Trending Down</span>
                    <div className="mt-1">Highlighted Text Rest of the insight</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <TemplatesCarousel />
        </div>

        {/* Right Column - Pin Stats, Ask, and Insights Alerts */}
        <div className="space-y-4 lg:space-y-6">
          {/* Pin your stats */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-text-primary">Pin your stats</CardTitle>
                  <CardDescription className="text-sm text-text-muted">Pin the important stats that you require</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-text-secondary hover:bg-interactive-hover"
                  onClick={() => { setPinSlotIndex(0); setPinModalOpen(true); }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pinned.slice(0, 2).map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-lg border border-border bg-background-surface-secondary cursor-pointer hover:bg-interactive-hover transition"
                    onClick={() => { setPinSlotIndex(idx); setPinModalOpen(true); }}
                  >
                    {!item ? (
                      <div className="text-sm text-text-muted text-center py-2">
                        Click to pin something
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-text-primary">
                        {item.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ask (mini chat) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-text-primary">Ask</CardTitle>
              <CardDescription className="text-sm text-text-muted">Ask anything about your data</CardDescription>
            </CardHeader>
            <CardContent>
              <MiniAsk />
            </CardContent>
          </Card>

          {/* Insights Alerts */}
          <InsightsAlerts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Mini Ask chat component
const MiniAsk: React.FC = () => {
  const [messages, setMessages] = React.useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hi! I am Urek Bot to help you out. You can ask about revenue, sales, costs, or any dataset' },
  ]);
  const [input, setInput] = React.useState('');
  const [sending, setSending] = React.useState(false);

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setMessages((m) => [...m, { role: 'user', text: trimmed }]);
    setInput('');
    try {
      const res = await chatAPI.query(trimmed);
      const aiText = typeof res?.data === 'string' ? res.data : (res?.data?.answer || res?.answer || 'Here is what I found.');
      setMessages((m) => [...m, { role: 'ai', text: aiText }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'ai', text: 'Sorry, I could not process that right now.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="h-40 overflow-y-auto rounded-xl border border-border bg-background-surface-secondary p-3 space-y-2">
        {messages.slice(-12).map((msg, i) => (
          <div key={i} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-primary text-text-white rounded-br-md'
                  : 'bg-background-surface text-text-primary border border-border rounded-bl-md'
              }`}
            >
              {msg.role === 'ai' && i === 0 ? '👋 ' : ''}{msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 w-full mt-1">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Type here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSend(); }}
            className="w-full h-12"
          />
        </div>
        <Button onClick={onSend} disabled={sending || !input.trim()} className="h-12 px-5 shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

// Templates carousel below Daily Insights
const TemplatesCarousel: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const templates = [
    { title: 'Monthly Churn Report', desc: 'Summarize revenue and growth', color: 'from-blood-red/20 to-crimson/20' },
    { title: 'Monthly Churn Report', desc: 'Summarize revenue and growth', color: 'from-crimson/20 to-copper-orange/20' },
    { title: 'Monthly Churn Report', desc: 'Summarize revenue and growth', color: 'from-copper-orange/20 to-blood-red/20' },
  ];

  const scrollBy = (delta: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-text-primary">Templates</CardTitle>
            <CardDescription className="text-sm text-text-muted">Use ready-made starters for quick insights</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scrollBy(-320)} className="p-2 rounded-lg border border-border hover:bg-interactive-hover">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => scrollBy(320)} className="p-2 rounded-lg border border-border hover:bg-interactive-hover">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div ref={containerRef} className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pr-2">
            {templates.map((t, i) => (
              <div key={i} className="min-w-[240px] max-w-[240px]">
                <div className="p-4 rounded-xl border border-border bg-background-surface-secondary hover:bg-interactive-hover transition">
                  <div className="text-sm font-semibold text-text-primary line-clamp-1">{t.title}</div>
                  <div className="text-xs text-text-muted mt-1 line-clamp-2">{t.desc}</div>
                  <div className="mt-3">
                    <Button size="sm" className="h-8 px-3">Use Template</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Insights Alerts component
const InsightsAlerts: React.FC = () => {
  const [frequency, setFrequency] = React.useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [customOpen, setCustomOpen] = React.useState(false);
  const [customValue, setCustomValue] = React.useState<string>('');
  const [customUnit, setCustomUnit] = React.useState<'days' | 'weeks' | 'months'>('days');

  const saveCustom = () => {
    if (!customValue || Number.isNaN(Number(customValue)) || Number(customValue) <= 0) return;
    setFrequency('custom');
    setCustomOpen(false);
  };

  return (
    <Card>
              <CardHeader className="pb-3 bg-background-surface">
        <CardTitle className="text-lg font-semibold text-text-primary">Insights Alerts</CardTitle>
        <CardDescription className="text-sm text-text-muted">Get notified when new insight reports are ready</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">Alert frequency</div>
            <div className="w-40">
              <Select value={frequency} onValueChange={(v: any) => { if (v === 'custom') setCustomOpen(true); setFrequency(v); }}>
                <SelectTrigger className="h-9 rounded-xl border border-border bg-background-surface text-text-primary">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-background-surface text-text-primary border border-border shadow-lg">
                  <SelectItem className="text-text-secondary hover:bg-interactive-hover rounded-md" value="daily">Daily</SelectItem>
                  <SelectItem className="text-text-secondary hover:bg-interactive-hover rounded-md" value="weekly">Weekly</SelectItem>
                  <SelectItem className="text-text-secondary hover:bg-interactive-hover rounded-md" value="monthly">Monthly</SelectItem>
                  <SelectItem className="text-text-secondary hover:bg-interactive-hover rounded-md" value="custom">Custom…</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background-surface-secondary p-2">
            <div className="text-sm text-text-secondary">Latest</div>
            <ul className="mt-1.5 space-y-1 text-sm max-h-20 overflow-y-auto pr-1">
              <li className="flex items-center justify-between">
                <span className="text-text-secondary">New revenue insight generated</span>
                <span className="text-xs text-text-muted">2m ago</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-text-secondary">Sales trend report is ready</span>
                <span className="text-xs text-text-muted">2m ago</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-text-secondary">Cost optimization suggestions</span>
                <span className="text-xs text-text-muted">2m ago</span>
              </li>
            </ul>
          </div>
        </div>

        {customOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setCustomOpen(false)} />
            <Card className="relative w-full max-w-sm bg-surface border border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Custom frequency</CardTitle>
                <CardDescription className="text-sm">Enter a custom interval and unit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    className="w-24 h-10"
                    placeholder="4"
                  />
                  <div className="w-32">
                    <Select value={customUnit} onValueChange={(v: any) => setCustomUnit(v)}>
                      <SelectTrigger className="h-10 rounded-xl border border-border bg-surface text-text-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-surface text-text-primary border border-border shadow-soft-lg">
                        <SelectItem className="text-text-secondary hover:bg-hover rounded-md" value="days">days</SelectItem>
                        <SelectItem className="text-text-secondary hover:bg-hover rounded-md" value="weeks">weeks</SelectItem>
                        <SelectItem className="text-text-secondary hover:bg-hover rounded-md" value="months">months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" onClick={() => setCustomOpen(false)}>Cancel</Button>
                  <Button onClick={saveCustom}>Save</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};