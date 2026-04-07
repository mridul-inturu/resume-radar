import { useState, useCallback } from 'react';
import { Upload, FileText, X, Camera, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileResumeUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function MobileResumeUpload({ onFileSelect, selectedFile, onClear }: MobileResumeUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file?.type === 'application/pdf') onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleCameraCapture = () => {
    // For mobile camera capture (future enhancement)
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Convert image to PDF (would need additional library)
        console.log('Camera capture:', file);
      }
    };
    input.click();
  };

  if (selectedFile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <FileText className="h-6 w-6 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClear} className="shrink-0 h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Ready for analysis</p>
          <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors cursor-pointer',
          isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-base font-medium text-center">Drop your resume PDF here</p>
        <p className="text-sm text-muted-foreground text-center mt-1">or tap to browse</p>
      </div>

      {/* Mobile Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="flex flex-col gap-2 h-auto py-4"
          onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
        >
          <File className="h-5 w-5" />
          <span className="text-sm">Choose File</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col gap-2 h-auto py-4"
          onClick={handleCameraCapture}
        >
          <Camera className="h-5 w-5" />
          <span className="text-sm">Scan Resume</span>
        </Button>
      </div>

      {/* Mobile Tips */}
      <div className="bg-muted/30 rounded-lg p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">Mobile Tips:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>· Take a clear photo of your resume</li>
          <li>· Ensure good lighting for best results</li>
          <li>· PDF files work best for analysis</li>
          <li>· Maximum file size: 5MB</li>
        </ul>
      </div>
    </div>
  );
}
