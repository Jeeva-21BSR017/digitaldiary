import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { DiaryDashboard } from "@/components/diary/DiaryDashboard";

const Index = () => {
  const [user, setUser] = useState<string | null>(null);

  const handleAuth = (email: string) => {
    setUser(email);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return <DiaryDashboard userEmail={user} onLogout={handleLogout} />;
};

export default Index;
