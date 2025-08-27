import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiaryEntry } from "./DiaryEntry";
import { DiaryEditor } from "./DiaryEditor";
import { 
  Plus, 
  Search, 
  Calendar, 
  BookOpen, 
  Filter,
  User,
  LogOut,
  Heart,
  Star
} from "lucide-react";
import { format } from "date-fns";

interface Entry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: "happy" | "sad" | "neutral" | "excited" | "thoughtful";
}

interface DiaryDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export function DiaryDashboard({ userEmail, onLogout }: DiaryDashboardProps) {
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: "1",
      title: "My First Day",
      content: "Today marked the beginning of my digital diary journey. I'm excited to capture my thoughts and memories in this beautiful space...",
      date: new Date(2024, 7, 20),
      mood: "excited"
    },
    {
      id: "2", 
      title: "A Peaceful Morning",
      content: "Woke up to the sound of birds chirping outside my window. There's something magical about early mornings that fills me with gratitude...",
      date: new Date(2024, 7, 22),
      mood: "thoughtful"
    },
    {
      id: "3",
      title: "Weekend Adventures",
      content: "Spent the day exploring the local farmer's market. The vibrant colors of fresh produce and the warm smiles of vendors made my heart happy...",
      date: new Date(2024, 7, 24),
      mood: "happy"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "entry">("list");

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEntry = () => {
    setIsCreating(true);
    setViewMode("entry");
  };

  const handleSaveEntry = (title: string, content: string, mood?: string) => {
    if (isCreating) {
      const newEntry: Entry = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date(),
        mood: mood as Entry["mood"]
      };
      setEntries([newEntry, ...entries]);
      setIsCreating(false);
    } else if (selectedEntry) {
      setEntries(entries.map(entry =>
        entry.id === selectedEntry.id
          ? { ...entry, title, content, mood: mood as Entry["mood"] }
          : entry
      ));
    }
    setViewMode("list");
    setSelectedEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    setViewMode("list");
    setSelectedEntry(null);
  };

  const handleEditEntry = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsCreating(false);
    setViewMode("entry");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedEntry(null);
    setIsCreating(false);
  };

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case "happy": return "😊";
      case "sad": return "😢";
      case "excited": return "🎉";
      case "thoughtful": return "🤔";
      default: return "📝";
    }
  };

  if (viewMode === "entry") {
    return (
      <DiaryEditor
        entry={selectedEntry}
        isCreating={isCreating}
        onSave={handleSaveEntry}
        onBack={handleBackToList}
        onDelete={selectedEntry ? () => handleDeleteEntry(selectedEntry.id) : undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-page">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-soft sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">My Digital Diary</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {userEmail.split('@')[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button
            onClick={handleCreateEntry}
            className="gap-2 h-12 px-6"
            size="lg"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{entries.length}</div>
              <p className="text-sm text-muted-foreground">Total Entries</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">
                {entries.filter(e => e.date >= new Date(new Date().setDate(new Date().getDate() - 30))).length}
              </div>
              <p className="text-sm text-muted-foreground">This Month</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(entries.reduce((acc, e) => acc + e.content.length, 0) / entries.length) || 0}
              </div>
              <p className="text-sm text-muted-foreground">Avg. Words</p>
            </CardContent>
          </Card>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Your Entries
          </h2>
          
          {filteredEntries.length === 0 ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No entries found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? "Try a different search term" : "Start writing your first diary entry"}
                </p>
                <Button onClick={handleCreateEntry} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredEntries.map((entry, index) => (
                <Card 
                  key={entry.id} 
                  className="border-0 shadow-soft hover:shadow-entry transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleEditEntry(entry)}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}