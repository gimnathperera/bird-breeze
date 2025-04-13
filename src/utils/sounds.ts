export const playSound = (soundName: string) => {
  const audio = new Audio(`/sounds/${soundName}.mp3`);
  audio.play().catch((error) => console.log("Audio playback failed:", error));
};
