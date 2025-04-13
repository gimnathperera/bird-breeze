import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface ScoreProps {
  score: number;
  highScore: number;
  isNewHighScore?: boolean;
  className?: string;
}

const Score: React.FC<ScoreProps> = ({
  score,
  highScore,
  isNewHighScore = false,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="text-5xl font-bold text-white text-shadow">{score}</div>
      <div className="text-sm text-white text-shadow">
        High Score: {highScore}
      </div>

      {isNewHighScore && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1.2, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.6,
          }}
          className="absolute top-20 flex flex-col items-center"
        >
          <Trophy className="w-16 h-16 text-yellow-300 drop-shadow-lg" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-yellow-300 font-bold text-shadow mt-2"
          >
            NEW HIGH SCORE!
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Score;
