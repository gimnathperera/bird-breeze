
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface GameOverMenuProps {
  score: number;
  highScore: number;
  isNewHighScore?: boolean;
  onRestart: () => void;
}

const GameOverMenu: React.FC<GameOverMenuProps> = ({
  score,
  highScore,
  isNewHighScore = false,
  onRestart,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border-2 border-white/20 text-center max-w-xs mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Game Over</h2>
        
        <div className="mb-6">
          <p className="text-white mb-1">Score: {score}</p>
          <p className="text-white">High Score: {highScore}</p>
          
          {isNewHighScore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 mb-2 flex flex-col items-center"
            >
              <motion.div
                initial={{ rotate: -15, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <Trophy className="w-12 h-12 text-yellow-300" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-2 text-yellow-300 font-bold"
              >
                New High Score!
              </motion.div>
            </motion.div>
          )}
        </div>
        
        <Button
          className="w-full bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 text-lg py-6"
          onClick={onRestart}
        >
          Play Again
        </Button>
      </div>
    </motion.div>
  );
};

export default GameOverMenu;
