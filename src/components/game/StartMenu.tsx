import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface StartMenuProps {
  onStart: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border-2 border-white/20 text-center max-w-xs mx-auto">
        <div className="flex justify-center mb-4">
          <img
            src="/bird.png"
            alt="Bird"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Bird Breeze</h1>
        <p className="text-white mb-6">Tap or press space to fly</p>

        <Button
          className="w-full bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 text-lg py-6"
          onClick={onStart}
        >
          Start Game
        </Button>
      </div>
    </motion.div>
  );
};

export default StartMenu;
