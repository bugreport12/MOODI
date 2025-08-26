import { cn } from "@/lib/utils";

interface EmotionBadgeProps {
  emotion: string;
  className?: string;
}

export default function EmotionBadge({ emotion, className }: EmotionBadgeProps) {
  const emotionClass = `emotion-${emotion.toLowerCase()}`;
  
  return (
    <span 
      className={cn("emotion-badge", emotionClass, className)}
      data-testid={`emotion-badge-${emotion}`}
    >
      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
    </span>
  );
}
