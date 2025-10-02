"use client";
import React, { useMemo, useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { MessageSquare, FileText, FolderKanban, Brain, ChevronLeft } from "lucide-react";
import { useChatStore } from "@/state/chatStore";
import { useFilesStore } from "@/state/filesStore";

export type PinType = 'chat' | 'file' | 'project' | 'insight';

export interface PinCandidate {
  id: string;
  label: string;
  meta?: string;
}

export interface PinnedItem extends PinCandidate {
  type: PinType;
}

interface PinItemModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: PinnedItem) => void;
}

export const PinItemModal: React.FC<PinItemModalProps> = ({ open, onClose, onSelect }) => {
  const [step, setStep] = useState<'type' | 'select'>('type');
  const [selectedType, setSelectedType] = useState<PinType | null>(null);

  const chats = useChatStore((s) => s.getAllChats());
  const files = useFilesStore((s) => s.uploadedFiles);

  const options: { key: PinType; label: string; icon: React.ReactNode; description: string }[] = [
    { key: 'chat', label: 'Chat', icon: <MessageSquare className="h-5 w-5" />, description: 'Pin a conversation' },
    { key: 'file', label: 'Files', icon: <FileText className="h-5 w-5" />, description: 'Pin a data file' },
    { key: 'project', label: 'Projects', icon: <FolderKanban className="h-5 w-5" />, description: 'Pin a project' },
    { key: 'insight', label: 'Insights', icon: <Brain className="h-5 w-5" />, description: 'Pin an insight' },
  ];

  const candidates: PinCandidate[] = useMemo(() => {
    if (selectedType === 'chat') {
      return chats.map((c) => ({ id: c.id, label: c.name || `Chat ${c.id}`, meta: (c.messages?.length || 0) + ' messages' }));
    }
    if (selectedType === 'file') {
      return files.map((f) => ({ id: f.id, label: f.name, meta: (f.size ? (f.size / 1024 / 1024).toFixed(2) + ' MB' : undefined) }));
    }
    // Placeholder for projects/insights
    if (selectedType === 'project') {
      return [];
    }
    if (selectedType === 'insight') {
      return [];
    }
    return [];
  }, [selectedType, chats, files]);

  const handlePickType = (t: PinType) => {
    setSelectedType(t);
    setStep('select');
  };

  const handleBack = () => {
    setStep('type');
    setSelectedType(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-2xl shadow-xl">
        <CardHeader className="p-6 border-b border-border bg-surface">
          <div className="flex items-center gap-2">
            {step === 'select' && (
              <button onClick={handleBack} className="p-2 rounded-lg hover:bg-interactive-hover transition">
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <CardTitle className="text-lg">{step === 'type' ? 'What do you want to pin?' : `Select a ${selectedType}`}</CardTitle>
              <CardDescription className="text-sm">
                {step === 'type' ? 'Choose one of the following types to pin to your dashboard.' : 'Pick an item to pin. You can change this later.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {step === 'type' && (
            <div className="grid grid-cols-2 gap-4">
              {options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handlePickType(opt.key)}
                  className={cn(
                    "p-4 rounded-xl border border-border bg-background-surface-secondary hover:bg-interactive-hover transition flex items-start gap-3 text-left"
                  )}
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary-bright/20 text-primary flex items-center justify-center">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs text-text-muted">{opt.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'select' && (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {candidates.length === 0 && (
                <div className="text-sm text-text-muted">No items available yet.</div>
              )}
              {candidates.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { if (selectedType) onSelect({ type: selectedType, ...item }); onClose(); }}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-interactive-hover transition"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.meta && <span className="text-xs text-text-muted">{item.meta}</span>}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


