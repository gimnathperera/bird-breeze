
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Pause, Play, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onRestart: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
  onRestart,
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause game" : "Play game"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
        onClick={onRestart}
        aria-label="Restart game"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default GameControls;
