
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-quantablue-darkest to-quantablue-dark">
      <div className="animate-pulse">
        <div className="bg-white/20 h-32 w-32 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
          <Lock size={64} className="text-white" />
        </div>
      </div>
      <h1 className="mt-8 text-4xl font-bold text-white animate-fade-in">QuantaVault</h1>
      <p className="mt-2 text-xl text-quantablue-light/80">Secure Password Management</p>
      
      <div className="mt-12">
        <div className="w-16 h-1 bg-quantablue-light/30 rounded-full overflow-hidden">
          <div className="h-full bg-quantablue-light animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
