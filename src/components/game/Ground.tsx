interface GroundProps {
  position: number;
}

const Ground: React.FC<GroundProps> = ({ position }) => {
  return (
    <div
      className="absolute bottom-0 w-[2000px] h-24 bg-game-ground border-t-4 border-game-groundDark"
      style={{ left: `${position}px` }}
    >
      {/* Texture pattern for the ground */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-12 h-2 bg-game-groundDark rounded-full"
            style={{
              left: `${i * 100}px`,
              top: `${10 + (i % 3) * 15}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Ground;
