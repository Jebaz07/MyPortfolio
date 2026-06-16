"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Mail,
  Search,
  Trash2,
  Loader2,
  CheckCircle,
  Circle,
  MessageSquare,
  Clock,
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(search.toLowerCase()))
  );

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg);
    setViewDialogOpen(true);
    if (!msg.read) {
      markAsRead(msg.id);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark as read");
    }
  };

  const toggleRead = async (e: React.MouseEvent, id: string, currentRead: boolean) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
      );
      toast.success(currentRead ? "Marked as unread" : "Marked as read");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update message");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="text-zinc-400 mt-1">Manage your contact messages</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search by name, email, or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">
            {search ? "No messages match your search" : "No messages yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMessages
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((msg) => (
              <Card
                key={msg.id}
                className={`border cursor-pointer transition-all duration-200 hover:bg-white/[0.07] ${
                  !msg.read
                    ? "border-gold/20 bg-gold/[0.03]"
                    : "border-white/10 bg-white/5"
                }`}
                onClick={() => openMessage(msg)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={(e) => toggleRead(e, msg.id, msg.read)}
                      className="mt-1 flex-shrink-0 text-zinc-500 hover:text-gold transition-colors"
                    >
                      {msg.read ? (
                        <Circle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-gold" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium truncate ${
                                !msg.read ? "text-white" : "text-zinc-300"
                              }`}
                            >
                              {msg.name}
                            </span>
                            {!msg.read && (
                              <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-zinc-500 truncate">
                            {msg.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(msg.createdAt), "MMM d, yyyy")}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDelete(e, msg.id)}
                            disabled={deletingId === msg.id}
                          >
                            {deletingId === msg.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {msg.subject && (
                        <p className="text-sm text-zinc-400 mt-1 font-medium">
                          {msg.subject}
                        </p>
                      )}
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gold" />
              Message from {selectedMessage?.name}
            </DialogTitle>
            <DialogDescription>
              Received on{" "}
              {selectedMessage &&
                format(new Date(selectedMessage.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/[0.03] border border-white/5">
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">Name</label>
                  <p className="text-sm text-white mt-1">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">Email</label>
                  <p className="text-sm text-white mt-1">{selectedMessage.email}</p>
                </div>
                {selectedMessage.subject && (
                  <div className="col-span-2">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider">Subject</label>
                    <p className="text-sm text-white mt-1">{selectedMessage.subject}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">
                  Message
                </label>
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
