"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FolderKanban,
  Code2,
  Award,
  Mail,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

interface DashboardStats {
  projects: number;
  skills: number;
  certifications: number;
  totalMessages: number;
  unreadMessages: number;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    skills: 0,
    certifications: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes, certsRes, messagesRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/certifications"),
          fetch("/api/contact"),
        ]);

        const projects = await projectsRes.json();
        const skills = await skillsRes.json();
        const certs = await certsRes.json();
        const messages = await messagesRes.json();

        const projectsCount = Array.isArray(projects) ? projects.length : 0;
        const skillsCount = Array.isArray(skills)
          ? skills.reduce((acc: number, cat: { skills?: unknown[] }) => acc + (cat.skills?.length || 0), 0)
          : 0;
        const certsCount = Array.isArray(certs) ? certs.length : 0;
        const totalMessages = Array.isArray(messages) ? messages.length : 0;
        const unread = Array.isArray(messages)
          ? messages.filter((m: { read: boolean }) => !m.read).length
          : 0;

        setStats({
          projects: projectsCount,
          skills: skillsCount,
          certifications: certsCount,
          totalMessages,
          unreadMessages: unread,
        });

        if (Array.isArray(messages)) {
          setRecentMessages(
            messages
              .sort((a: { createdAt: string }, b: { createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
          );
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: "Total Projects", value: stats.projects, icon: FolderKanban, color: "text-blue-400" },
    { label: "Total Skills", value: stats.skills, icon: Code2, color: "text-green-400" },
    { label: "Certifications", value: stats.certifications, icon: Award, color: "text-purple-400" },
    { label: "Total Messages", value: stats.totalMessages, icon: Mail, color: "text-orange-400" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, color: "text-red-400" },
  ];

  const chartData = [
    { name: "Projects", value: stats.projects },
    { name: "Skills", value: stats.skills },
    { name: "Certs", value: stats.certifications },
    { name: "Messages", value: stats.totalMessages },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Overview of your portfolio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className="border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-400">{card.label}</p>
                    <p className="text-3xl font-bold text-white">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-white/5 ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white text-lg">Analytics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-lg">Recent Messages</CardTitle>
            <Button variant="ghost" size="sm" className="text-gold hover:text-gold/80">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-8">No messages yet</p>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      !msg.read
                        ? "border-gold/20 bg-gold/5"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate">
                            {msg.name}
                          </p>
                          {!msg.read && (
                            <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 truncate">
                          {msg.subject || "No subject"}
                        </p>
                      </div>
                      <span className="text-xs text-zinc-500 flex-shrink-0">
                        {format(new Date(msg.createdAt), "MMM d")}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
