// "4:05" or "1:02:09": where a chapter starts in its video
export const formatTimestamp = (totalSeconds: number) => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
};

// "6 min" or "1h 5m": how long a chapter is
export const formatLength = (totalSeconds: number) => {
  const minutes = Math.max(1, Math.round(totalSeconds / 60));
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

// The start time in a YouTube link: ...?v=ID&t=123s, ...&t=123 or ...&start=123
export const getYouTubeStart = (url?: string | null) => {
  const match = url?.match(/[?&](?:t|start)=(\d+)/);
  return match ? Number(match[1]) : 0;
};
