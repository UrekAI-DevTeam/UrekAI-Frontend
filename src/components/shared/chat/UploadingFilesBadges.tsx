import React from 'react';
import { UploadedFile } from '@/types';
import { UploadingFileBadge } from './UploadingFileBadge';

interface UploadingFilesBadgesProps {
  uploadingFiles: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
}

export const UploadingFilesBadges: React.FC<UploadingFilesBadgesProps> = ({
  uploadingFiles,
  onRemoveFile,
}) => {
  if (uploadingFiles.length === 0) return null;

  return (
    <div className="space-y-2 sm:space-y-3">
      {uploadingFiles.map((file) => (
        <UploadingFileBadge
          key={file.id}
          file={file}
          onRemove={onRemoveFile}
        />
      ))}
    </div>
  );
};