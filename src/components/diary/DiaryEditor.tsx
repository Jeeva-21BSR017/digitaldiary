import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Calendar,
  Smile,
  Frown,
  Zap,
  Brain,
  Meh
} from "lucide-react";
import { format } from "date-fns";

interface Entry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: "happy" | "sad" | "neutral" | "excited" | "thoughtful";
}

interface DiaryEditorProps {
  entry?: Entry | null;
  isCreating: boolean;
  onSave: (title: string, content: string, mood?: string) => void;
  onBack: () => void;
  onDelete?: () => void;
}

const moods = [
  { value: "happy", label: "Happy", icon: Smile, emoji: "😊", color: "bg-green-100 text-green-700" },
  { value: "excited", label: "Excited", icon: Zap, emoji: "🎉", color: "bg-yellow-100 text-yellow-700" },
  { value: "thoughtful", label: "Thoughtful", icon: Brain, emoji: "🤔", color: "bg-blue-100 text-blue-700" },
  { value: "neutral", label: "Neutral", icon: Meh, emoji: "😐", color: "bg-gray-100 text-gray-700" },
  { value: "sad", label: "Sad", icon: Frown, emoji: "😢", color: "bg-red-100 text-red-700" },
];

export function DiaryEditor({ entry, isCreating, onSave, onBack, onDelete }: DiaryEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (entry && !isCreating) {
      setTitle(entry.title);
      setContent(entry.content);
      setSelectedMood(entry.mood || "");
    } else {
      setTitle("");
      setContent("");
      setSelectedMood("");
    }
  }, [entry, isCreating]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both title and content are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate save delay
    setTimeout(() => {
      onSave(title, content, selectedMood);
      toast({
        title: isCreating ? "Entry created!" : "Entry updated!",
        description: "Your diary entry has been saved successfully.",
      });
      setIsSaving(false);
    }, 500);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm("Are you sure you want to delete this entry?")) {
      onDelete();
      toast({
        title: "Entry deleted",
        description: "Your diary entry has been permanently deleted.",
      });
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <div className="min-h-screen bg-gradient-page">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-soft sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {isCreating ? format(new Date(), "MMMM d, yyyy") : format(entry?.date || new Date(), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isCreating && onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
                size="sm"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-0 shadow-entry">
          <CardHeader className="space-y-6">
            {/* Title */}
            <Input
              placeholder="Enter your diary title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />

            {/* Mood Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">How are you feeling?</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => {
                  const IconComponent = mood.icon;
                  const isSelected = selectedMood === mood.value;
                  return (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setSelectedMood(isSelected ? "" : mood.value)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                        ${isSelected 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-border hover:border-primary/50 hover:bg-primary/5"
                        }
                      `}
                    >
                      <span className="text-lg">{mood.emoji}</span>
                      <span className="text-sm font-medium">{mood.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Content */}
            <Textarea
              placeholder="Start writing your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] text-base leading-relaxed border-0 px-0 focus-visible:ring-0 resize-none"
            />

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
              <div className="flex items-center gap-4">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedMood && (
                  <Badge variant="secondary" className="capitalize">
                    {moods.find(m => m.value === selectedMood)?.emoji} {selectedMood}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}