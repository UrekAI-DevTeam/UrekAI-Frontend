"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  currentName: string;
  type: 'folder' | 'chat';
}

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentName,
  type
}) => {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name.trim() !== currentName) {
      onSubmit(name.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setName(currentName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background-surface rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
            Rename {type === 'folder' ? 'Folder' : 'Chat'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-interactive-hover rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter ${type} name...`}
            autoFocus
            className="w-full"
          />
          
          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={!name.trim() || name.trim() === currentName}>
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};