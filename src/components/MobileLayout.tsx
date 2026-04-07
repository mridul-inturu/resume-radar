import { useState } from 'react';
import { Menu, X, Upload, FileSearch, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

interface MobileHeaderProps {
  onNewAnalysis?: () => void;
  showNewAnalysisButton?: boolean;
}

export function MobileHeader({ onNewAnalysis, showNewAnalysisButton = false }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { icon: Upload, label: 'Upload Resume', href: '#upload' },
    { icon: FileSearch, label: 'Analysis', href: '#analysis' },
    { icon: Shield, label: 'Privacy', href: '#privacy' },
    { icon: Zap, label: 'Features', href: '#features' }
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <FileSearch className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">ResumeIQ</span>
          </div>
          <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
        </div>

        <div className="flex items-center gap-2">
          {showNewAnalysisButton && onNewAnalysis && (
            <Button size="sm" onClick={onNewAnalysis} className="hidden sm:flex">
              New Analysis
            </Button>
          )}
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <FileSearch className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-semibold">ResumeIQ</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <nav className="flex-1 py-4">
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className="w-full justify-start gap-3"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </nav>

                <div className="border-t py-4">
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-sm font-medium">Privacy First</p>
                      <p className="text-xs text-muted-foreground">Your resume is never stored</p>
                    </div>
                    {showNewAnalysisButton && onNewAnalysis && (
                      <Button onClick={onNewAnalysis} className="w-full">
                        New Analysis
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

interface MobileLayoutProps {
  children: React.ReactNode;
  showNewAnalysisButton?: boolean;
  onNewAnalysis?: () => void;
}

export function MobileLayout({ children, showNewAnalysisButton, onNewAnalysis }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        showNewAnalysisButton={showNewAnalysisButton}
        onNewAnalysis={onNewAnalysis}
      />
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {[
            { icon: Upload, label: 'Upload', active: false },
            { icon: FileSearch, label: 'Analyze', active: false },
            { icon: Shield, label: 'Privacy', active: false },
            { icon: Zap, label: 'Features', active: false }
          ].map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              size="sm"
              className="flex flex-col gap-1 h-auto py-2"
            >
              <item.icon className="h-4 w-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
}
