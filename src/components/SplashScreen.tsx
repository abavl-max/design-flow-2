import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
//import logo from 'figma:asset/c6b3d718af7822b20752d7f9484ce8abffe356d6.png';
import logo from '@/assets/Logo-Light.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Inicia o fade out após 2.5 segundos
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Completa a splash screen após 3 segundos
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"
    >
      {/* Efeitos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos animados de fundo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        
        {/* Grade de pontos decorativa */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* Container central */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo com animação */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.2 
          }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glow effect atrás da logo */}
            <div className="absolute inset-0 blur-2xl bg-white opacity-30 scale-110" />
            
            <img 
              src={logo} 
              alt="DesignFlow" 
              className="relative w-96 h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Texto animado */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <p className="font-['Maven_Pro',sans-serif] text-white/90 text-[20px] tracking-wide">
            Transformando ideias em design
          </p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
          className="mt-12"
        >
          <div className="flex gap-2">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.2,
                delay: 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.2,
                delay: 0.4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Versão (opcional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <p className="font-['Kumbh_Sans',sans-serif] text-white/70 text-[13px]">
          Versão 1.0
        </p>
      </motion.div>
    </motion.div>
  );
}
