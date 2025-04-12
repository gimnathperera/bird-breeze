
import React from 'react';
import Game from '@/components/game/Game';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto h-[90vh] max-h-[600px]">
        <Game />
      </div>
    </div>
  );
};

export default Index;
