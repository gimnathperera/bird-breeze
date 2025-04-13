import { cn } from "@/lib/utils";

interface PipeProps {
  height: number;
  position: number;
  isTop?: boolean;
}

const Pipe: React.FC<PipeProps> = ({ height, position, isTop = false }) => {
  return (
    <div
      className="absolute w-16 bg-game-pipe border-x-4 border-game-pipeBorder"
      style={{
        height: `${height}px`,
        left: `${position}px`,
        top: isTop ? 0 : "auto",
        bottom: isTop ? "auto" : 0,
      }}
    >
      <div
        className={cn(
          "absolute left-0 right-0 h-6 bg-game-pipe border-4 border-game-pipeBorder rounded-sm",
          isTop ? "bottom-0" : "top-0"
        )}
        style={{
          width: "calc(100% + 8px)",
          left: "-4px",
        }}
      />
    </div>
  );
};

export default Pipe;
