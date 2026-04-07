import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Eye, EyeOff, Type, Mic, MicOff } from 'lucide-react';

interface AccessibilityControlsProps {
  onTextToSpeech?: (text: string) => void;
  onStopSpeech?: () => void;
  isSpeaking?: boolean;
}

export function AccessibilityControls({ 
  onTextToSpeech, 
  onStopSpeech, 
  isSpeaking = false 
}: AccessibilityControlsProps) {
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentText, setCurrentText] = useState('');

  const fontSizes = [
    { label: 'Small', value: 'small', class: 'text-sm' },
    { label: 'Normal', value: 'normal', class: 'text-base' },
    { label: 'Large', value: 'large', class: 'text-lg' },
    { label: 'Extra Large', value: 'xl', class: 'text-xl' },
  ];

  useEffect(() => {
    // Apply accessibility settings to document
    document.body.className = `
      ${fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : fontSize === 'xl' ? 'text-xl' : 'text-base'}
      ${highContrast ? 'high-contrast' : ''}
      ${simpleMode ? 'simple-mode' : ''}
    `;
  }, [fontSize, highContrast, simpleMode]);

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      setCurrentText(text);
      onTextToSpeech?.(text);
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      onStopSpeech?.();
      setCurrentText('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 space-y-3 max-w-xs">
      <h3 className="font-semibold text-sm mb-2">Accessibility</h3>
      
      {/* Text Size Controls */}
      <div className="space-y-2">
        <label className="text-xs font-medium">Text Size</label>
        <div className="flex gap-1">
          {fontSizes.map((size) => (
            <Button
              key={size.value}
              variant={fontSize === size.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFontSize(size.value)}
              className="text-xs px-2 py-1"
            >
              {size.label[0]}
            </Button>
          ))}
        </div>
      </div>

      {/* High Contrast */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium">High Contrast</label>
        <Button
          variant={highContrast ? 'default' : 'outline'}
          size="sm"
          onClick={() => setHighContrast(!highContrast)}
          className="text-xs px-2 py-1"
        >
          <Eye className="h-3 w-3" />
        </Button>
      </div>

      {/* Simple Mode */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium">Simple Mode</label>
        <Button
          variant={simpleMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSimpleMode(!simpleMode)}
          className="text-xs px-2 py-1"
        >
          <Type className="h-3 w-3" />
        </Button>
      </div>

      {/* Text to Speech */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium">Read Aloud</label>
        <Button
          variant={voiceEnabled ? 'default' : 'outline'}
          size="sm"
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className="text-xs px-2 py-1"
        >
          {voiceEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
        </Button>
      </div>

      {/* Speech Controls */}
      {voiceEnabled && (
        <div className="flex gap-1">
          <Button
            variant={isSpeaking ? 'default' : 'outline'}
            size="sm"
            onClick={() => currentText ? handleStopSpeech() : null}
            className="text-xs px-2 py-1"
            disabled={!currentText}
          >
            <MicOff className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Instructions for illiterate users */}
      <div className="text-xs text-gray-600 border-t pt-2">
        <p className="font-medium mb-1">How to use:</p>
        <ul className="space-y-1">
          <li>• Click buttons to change settings</li>
          <li>• Use "Read Aloud" to hear text</li>
          <li>• "Simple Mode" removes complex items</li>
          <li>• Ask someone to help if needed</li>
        </ul>
      </div>
    </div>
  );
}

// Hook for reading page content
export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentUtterance(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentUtterance(null);
      };

      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentUtterance(null);
    }
  };

  return { speak, stop, isSpeaking, currentUtterance };
}

// Simple mode wrapper for complex components
export function SimpleModeWrapper({ children, enabled }: { children: React.ReactNode; enabled: boolean }) {
  if (!enabled) return <>{children}</>;

  return (
    <div className="simple-mode-content">
      <div className="bg-white border-2 border-black rounded-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Resume Analyzer</h1>
        <div className="space-y-4">
          <div className="border-2 border-black p-4">
            <h2 className="text-lg font-bold mb-2">Step 1: Upload Resume</h2>
            <p className="mb-2">Click the button below to choose your resume file</p>
            <Button className="w-full text-lg py-4 border-2 border-black">Choose File</Button>
          </div>
          
          <div className="border-2 border-black p-4">
            <h2 className="text-lg font-bold mb-2">Step 2: Add Job</h2>
            <p className="mb-2">Copy and paste the job description here</p>
            <div className="border-2 border-black p-3 min-h-[100px]">Paste job text here</div>
          </div>
          
          <div className="border-2 border-black p-4">
            <h2 className="text-lg font-bold mb-2">Step 3: Analyze</h2>
            <Button className="w-full text-lg py-4 border-2 border-black bg-green-500 text-white">
              Analyze My Resume
            </Button>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-100 border-2 border-black">
          <h3 className="font-bold mb-2">Need Help?</h3>
          <p>Ask a friend, family member, or teacher to help you use this tool.</p>
          <p className="mt-2">You can also call us for assistance: 1-800-HELP</p>
        </div>
      </div>
    </div>
  );
}
