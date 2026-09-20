"use client";

import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { Fluid } from '@whatisjery/react-fluid-distortion';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function FluidBackground() {
  const [mounted, setMounted] = useState(false);
  
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isLight = resolvedTheme === 'light';

  return (
    <div 
      className="absolute inset-0 -z-20 h-[100vh] w-full transition-all duration-700"
      style={{
        filter: isLight ? 'invert(1) hue-rotate(180deg)' : 'none',
        mixBlendMode: isLight ? 'multiply' : 'normal',
      }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <EffectComposer>
              <Fluid fluidColor='#8b5cf6' curl={15} swirl={5} distortion={0.5} opacity={0.6} radius={0.2} backgroundColor="#000000" />
          </EffectComposer>
      </Canvas>
    </div>
  );
}
