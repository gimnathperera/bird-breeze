/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef, useCallback } from "react";
import Bird from "./Bird";
import Pipe from "./Pipe";
import Ground from "./Ground";
import Score from "./Score";
import GameControls from "./GameControls";
import GameOverMenu from "./GameOverMenu";
import StartMenu from "./StartMenu";
import { useToast } from "@/components/ui/use-toast";
import { playSound } from "@/utils/sounds";

// Game constants
const GRAVITY = 0.4; // Reduced from 0.6 to make the bird fall slower
const JUMP_FORCE = -14; // Reduced from -10 to make jumps less extreme
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 34;
const PIPE_WIDTH = 64;
const PIPE_GAP = 200; // Increased from 180 to give more room for the bird
const GROUND_HEIGHT = 96;
const GAME_SPEED = 2.5; // Slightly reduced from 3 to make the game easier

enum GameState {
  READY,
  PLAYING,
  GAME_OVER,
  PAUSED,
}

interface PipeObject {
  id: number;
  x: number;
  height: number;
}

const generatePipe = (canvasWidth: number) => {
  const minHeight = 80; // Increased from 50 to make lower pipes less tall
  const maxHeight = 270; // Reduced from 300 to make upper pipes less tall
  const height = Math.floor(
    Math.random() * (maxHeight - minHeight) + minHeight
  );

  return {
    id: Date.now(),
    x: canvasWidth,
    height,
  };
};

const Game: React.FC = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [birdPosition, setBirdPosition] = useState(0);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [birdRotation, setBirdRotation] = useState(0);
  const [pipes, setPipes] = useState<PipeObject[]>([]);
  const [groundPosition, setGroundPosition] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.READY);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const frameRef = useRef<number>(0);
  const scoreRef = useRef(score);
  const passedPipeRef = useRef<Record<number, boolean>>({});
  const gameStateRef = useRef(gameState);

  // Update gameStateRef when gameState changes
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Initialize canvas and load high score
  useEffect(() => {
    if (canvasRef.current) {
      setCanvasSize({
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight,
      });

      // Load high score from localStorage
      const savedHighScore = localStorage.getItem("flappyHighScore");
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    }

    const handleResize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update score ref when score changes
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Save high score
  useEffect(() => {
    localStorage.setItem("flappyHighScore", highScore.toString());
  }, [highScore]);

  // Handle collision detection
  const checkCollision = useCallback(() => {
    if (!birdRef.current || !canvasRef.current) return false;

    const birdRect = birdRef.current.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Debug collision detection
    console.log("Bird position checking:", {
      birdTop: birdRect.top - canvasRect.top,
      birdBottom: birdRect.top - canvasRect.top + BIRD_HEIGHT,
      groundTop: canvasRect.height - GROUND_HEIGHT,
    });

    // Bird dimensions and position
    const birdLeft = birdRect.left - canvasRect.left;
    const birdRight = birdLeft + BIRD_WIDTH;
    const birdTop = birdRect.top - canvasRect.top;
    const birdBottom = birdTop + BIRD_HEIGHT;

    // Check ground collision
    const groundTop = canvasRect.height - GROUND_HEIGHT;

    if (birdBottom >= groundTop) {
      console.log("Ground collision detected");
      return true;
    }

    // Check ceiling collision - add a small buffer at the top (5px)
    if (birdTop <= 5) {
      console.log("Ceiling collision detected");
      return true;
    }

    // Check pipe collisions - add a small buffer (3px) to be more forgiving
    for (const pipe of pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipeLeft + PIPE_WIDTH;

      // Only check collision if bird and pipe overlap horizontally
      // Make horizontal collision detection slightly more forgiving
      if (birdRight >= pipeLeft + 5 && birdLeft <= pipeRight - 5) {
        const topPipeBottom = pipe.height;
        const bottomPipeTop = pipe.height + PIPE_GAP;

        // Debug pipe collision check
        console.log("Pipe collision check:", {
          pipe,
          birdTop,
          birdBottom,
          topPipeBottom,
          bottomPipeTop,
          isColliding: birdTop <= topPipeBottom || birdBottom >= bottomPipeTop,
        });

        // Make collision detection slightly more forgiving with small buffer
        if (birdTop <= topPipeBottom - 2 || birdBottom >= bottomPipeTop + 2) {
          console.log("Pipe collision detected");
          return true;
        }
      }
    }

    return false;
  }, [pipes]);

  // Check if the bird passed a pipe to increase score
  const checkPipePassed = useCallback(() => {
    if (!birdRef.current || !canvasRef.current) return;

    const birdRect = birdRef.current.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const birdCenter = birdRect.left - canvasRect.left + BIRD_WIDTH / 2;

    pipes.forEach((pipe) => {
      const pipeRight = pipe.x + PIPE_WIDTH;

      if (birdCenter > pipeRight && !passedPipeRef.current[pipe.id]) {
        passedPipeRef.current[pipe.id] = true;
        const newScore = scoreRef.current + 1;
        setScore(newScore);

        // Check for new high score immediately
        if (newScore > highScore && !isNewHighScore) {
          setIsNewHighScore(true);
          toast({
            title: "New High Score!",
            description: `You've beaten the previous high score of ${highScore}!`,
            variant: "default",
          });
        }

        if (!isMuted) {
          handleOnplaySound("point");
        }
      }
    });
  }, [pipes, isMuted, highScore, isNewHighScore, toast]);

  // Main game loop
  const gameLoop = useCallback(() => {
    // Safety check to ensure we don't continue if game state has changed
    if (gameStateRef.current !== GameState.PLAYING) return;

    // Update bird position based on velocity
    setBirdPosition((prevPosition) => {
      const newPosition = prevPosition + birdVelocity;
      return newPosition;
    });

    // Update bird velocity with gravity
    setBirdVelocity((prevVelocity) => prevVelocity + GRAVITY);

    // Update bird rotation based on velocity
    setBirdRotation(() => {
      // Clamp rotation between -30 and 90 degrees
      const newRotation = Math.min(90, Math.max(-30, birdVelocity * 3));
      return newRotation;
    });

    // Move pipes to the left
    setPipes((prevPipes) => {
      return prevPipes
        .map((pipe) => ({
          ...pipe,
          x: pipe.x - GAME_SPEED,
        }))
        .filter((pipe) => pipe.x > -PIPE_WIDTH); // Remove pipes that are off screen
    });

    // Add new pipes with a slightly larger distance between them
    if (
      pipes.length === 0 ||
      pipes[pipes.length - 1].x < canvasSize.width - 350
    ) {
      setPipes((prevPipes) => [...prevPipes, generatePipe(canvasSize.width)]);
    }

    // Move ground
    setGroundPosition((prevPos) => {
      const newPos = prevPos - GAME_SPEED;
      // Reset ground position when it's moved enough to create a seamless loop
      return newPos <= -1000 ? 0 : newPos;
    });

    // Check if bird passed a pipe
    checkPipePassed();

    // Check for collisions
    // Remove the high score check from the collision handler
    if (checkCollision()) {
      if (!isMuted) {
        handleOnplaySound("hit");
      }

      setGameState(GameState.GAME_OVER);

      // Update the final high score
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current);
      }

      return;
    }

    // Continue the game loop
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [
    gameState,
    pipes,
    canvasSize.width,
    checkCollision,
    checkPipePassed,
    highScore,
    isMuted,
    toast,
  ]);

  // Start the game loop when playing
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      frameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [gameState, gameLoop]);

  // Handle user input (tap/click/space)
  const handleJump = useCallback(() => {
    if (gameState === GameState.PLAYING) {
      // Limit the upward velocity to prevent excessive height
      const currentVelocity = birdVelocity;
      const newVelocity = Math.max(JUMP_FORCE, currentVelocity + JUMP_FORCE);
      setBirdVelocity(newVelocity);

      if (!isMuted) {
        handleOnplaySound("wing");
      }
    }
  }, [gameState, isMuted, birdVelocity]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        if (gameState === GameState.READY) {
          startGame();
        } else if (gameState === GameState.PLAYING) {
          handleJump();
        } else if (gameState === GameState.GAME_OVER) {
          restartGame();
        } else if (gameState === GameState.PAUSED) {
          // Resume game when paused
          setGameState(GameState.PLAYING);
        }
      }

      if (e.code === "Escape") {
        if (gameState === GameState.PLAYING) {
          setGameState(GameState.PAUSED);
        } else if (gameState === GameState.PAUSED) {
          setGameState(GameState.PLAYING);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, handleJump]);

  // Play sounds
  // Replace the existing handleOnplaySound function with:
  const handleOnplaySound = (sound: "wing" | "hit" | "point") => {
    if (!isMuted) {
      try {
        playSound(sound);
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };

  // Game control functions
  const startGame = () => {
    setGameState(GameState.PLAYING);
    setBirdPosition(canvasSize.height / 2 - 50);
    setBirdVelocity(0);
    setPipes([]);
    setGroundPosition(0);
    setScore(0);
    setIsNewHighScore(false);
    passedPipeRef.current = {};
  };

  const restartGame = () => {
    startGame();
  };

  const togglePause = () => {
    if (gameState === GameState.PLAYING) {
      setGameState(GameState.PAUSED);
    } else if (gameState === GameState.PAUSED) {
      setGameState(GameState.PLAYING);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // UI Rendering
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
      <div
        ref={canvasRef}
        className="relative w-full h-full aspect-[3/4] sm:aspect-[9/16] overflow-hidden bg-gradient-to-b from-game-sky to-game-skyDark rounded-lg shadow-xl"
        onClick={gameState === GameState.READY ? startGame : handleJump}
      >
        {/* Game objects */}
        <Bird
          ref={birdRef}
          rotation={birdRotation}
          isFlying={gameState === GameState.PLAYING}
          style={{ top: `${birdPosition}px` }}
        />

        {pipes.map((pipe) => (
          <React.Fragment key={pipe.id}>
            <Pipe height={pipe.height} position={pipe.x} isTop />
            <Pipe
              height={
                canvasSize.height - pipe.height - PIPE_GAP - GROUND_HEIGHT
              }
              position={pipe.x}
            />
          </React.Fragment>
        ))}

        <Ground position={groundPosition} />

        {/* UI Elements */}
        {gameState === GameState.PLAYING && (
          <Score
            score={score}
            highScore={highScore}
            className="absolute top-8 left-0 right-0"
          />
        )}

        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <GameControls
            isPlaying={gameState === GameState.PLAYING}
            isMuted={isMuted}
            onTogglePlay={togglePause}
            onToggleMute={toggleMute}
            onRestart={restartGame}
          />
        </div>

        {/* Game state menus */}
        {gameState === GameState.READY && <StartMenu onStart={startGame} />}

        {gameState === GameState.GAME_OVER && (
          <GameOverMenu
            score={score}
            highScore={highScore}
            onRestart={restartGame}
            isNewHighScore={isNewHighScore}
          />
        )}

        {gameState === GameState.PAUSED && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border-2 border-white/20 text-center">
              <h2 className="text-3xl font-bold text-white text-shadow mb-4">
                Paused
              </h2>
              <div className="space-y-2">
                <p className="text-white text-sm">
                  Press Space or ESC to resume
                </p>
                <p className="text-white text-xs opacity-70">
                  Current Score: {score}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
