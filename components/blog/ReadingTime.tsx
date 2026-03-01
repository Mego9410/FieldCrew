interface ReadingTimeProps {
  minutes: number;
}

export function ReadingTime({ minutes }: ReadingTimeProps) {
  const label = minutes === 1 ? "1 min read" : `${minutes} min read`;
  return <span>{label}</span>;
}
