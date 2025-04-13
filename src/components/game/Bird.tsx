import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

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
          "absolute w-12 h-12 z-10 transition-transform",
          isFlying && "animate-bird-fly",
          className
        )}
        style={{
          transform: `translateY(0) rotate(${rotation}deg)`,
        }}
        {...props}
      >
        <img
          src="/bird.png"
          alt="Bird"
          width={48}
          height={48}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }
);

Bird.displayName = "Bird";

export default Bird;
