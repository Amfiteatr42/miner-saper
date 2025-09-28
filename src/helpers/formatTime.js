export const formatTime = (seconds) => {
  seconds = Math.max(0, Math.floor(seconds));

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad with leading zeros if needed
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};
