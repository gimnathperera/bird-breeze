
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BirdProps extends React.HTMLAttributes<HTMLDivElement> {
  rotation: number;
  isFlying: boolean;
}

const Bird = forwardRef<HTMLDivElement, BirdProps>(
  ({ rotation, isFlying, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-8 h-8 rounded-full bg-game-bird border-2 border-game-birdOutline z-10 transition-transform",
          isFlying && "animate-bird-fly",
          className
        )}
        style={{ 
          transform: `translateY(0) rotate(${rotation}deg)`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
        {...props}
      >
        {/* Bird eye */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-white top-1 right-1.5">
          <div className="absolute w-1 h-1 rounded-full bg-black top-0.5 right-0.5"></div>
        </div>
        {/* Bird beak */}
        <div className="absolute w-3 h-2 bg-orange-500 rounded-r-sm top-3 -right-2"></div>
        {/* Bird wing */}
        <div className="absolute w-4 h-3 bg-orange-400 rounded-full top-4 left-1 transform rotate-15"></div>
      </div>
    );
  }
);

Bird.displayName = 'Bird';

export default Bird;
