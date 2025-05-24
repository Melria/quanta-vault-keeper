
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Lock } from 'lucide-react';

const AppLayout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-quantablue-lightest safe-area-top">
      {isMobile ? (
        <>
          <header className="bg-quantablue-darkest text-white p-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center space-x-2">
              <div className="bg-quantablue-medium h-8 w-8 rounded-full flex items-center justify-center">
                <Lock size={16} />
              </div>
              <h1 className="text-lg font-bold">QuantaVault</h1>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-quantablue-dark">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 bg-quantablue-darkest border-quantablue-dark">
                <Navigation />
              </SheetContent>
            </Sheet>
          </header>
          
          <main className="flex-1 p-4 pb-20 overflow-y-auto">
            <Outlet />
          </main>
        </>
      ) : (
        <>
          <aside className="w-64 bg-quantablue-darkest text-white shrink-0">
            <Navigation />
          </aside>
          
          <main className="flex-1 p-8 overflow-y-auto">
            <Outlet />
          </main>
        </>
      )}
    </div>
  );
};

export default AppLayout;
