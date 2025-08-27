import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Entry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: "happy" | "sad" | "neutral" | "excited" | "thoughtful";
}

interface DiaryEntryProps {
  entry: Entry;
  onClick: () => void;
}

export function DiaryEntry({ entry, onClick }: DiaryEntryProps) {
  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case "happy": return "😊";
      case "sad": return "😢";
      case "excited": return "🎉";
      case "thoughtful": return "🤔";
      default: return "📝";
    }
  };

  return (
    <Card 
      className="border-0 shadow-soft hover:shadow-entry transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getMoodIcon(entry.mood)}</span>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {entry.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(entry.date, "MMMM d, yyyy")}
              </p>
            </div>
          </div>
          {entry.mood && (
            <Badge variant="secondary" className="capitalize">
              {entry.mood}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground line-clamp-2">
          {entry.content}
        </p>
      </CardContent>
    </Card>
  );
}