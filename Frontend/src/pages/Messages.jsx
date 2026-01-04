import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const conversations = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Hi, I'm interested in scheduling a tour for the Sunset Villa. Is this weekend available?",
    time: "2m ago",
    unread: 2,
    property: "Sunset Villa",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Thank you for the information. I'll review and get back to you.",
    time: "1h ago",
    unread: 0,
    property: "Ocean View Apartment",
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Does the property allow pets?",
    time: "3h ago",
    unread: 1,
    property: "Modern Loft",
  },
  {
    id: "4",
    name: "Robert Martinez",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "I'd like to know more about the neighborhood.",
    time: "Yesterday",
    unread: 0,
    property: "Garden Estate",
  },
];

const messages = [
  {
    id: "1",
    sender: "buyer",
    text: "Hi! I saw the listing for Sunset Villa and I'm very interested.",
    time: "10:30 AM",
  },
  {
    id: "2",
    sender: "seller",
    text: "Hello Sarah! Thank you for your interest. The Sunset Villa is a beautiful 4-bedroom property with ocean views. What would you like to know?",
    time: "10:32 AM",
  },
  {
    id: "3",
    sender: "buyer",
    text: "It looks amazing! Is it available for a tour this weekend?",
    time: "10:35 AM",
  },
  {
    id: "4",
    sender: "seller",
    text: "Absolutely! I have availability on Saturday at 2 PM or Sunday at 11 AM. Which works better for you?",
    time: "10:38 AM",
  },
  {
    id: "5",
    sender: "buyer",
    text: "Saturday at 2 PM would be perfect!",
    time: "10:40 AM",
  },
  {
    id: "6",
    sender: "buyer",
    text: "Hi, I'm interested in scheduling a tour for the Sunset Villa. Is this weekend available?",
    time: "Just now",
  },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="h-[calc(100vh-8rem)] animate-fade-in">
      <Card className="flex h-full overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 flex-shrink-0 border-r border-border">
          <div className="border-b border-border p-4">
            <h2 className="mb-3 text-lg font-semibold">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9" />
            </div>
          </div>
          <div className="overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border/50 p-4 text-left transition-colors hover:bg-accent",
                  selectedConversation.id === conv.id && "bg-accent"
                )}
              >
                <div className="relative">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  {conv.unread > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{conv.name}</p>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{conv.lastMessage}</p>
                  <p className="mt-1 text-xs text-primary">{conv.property}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedConversation.avatar}
                alt={selectedConversation.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{selectedConversation.name}</p>
                <p className="text-sm text-muted-foreground">Active now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Property Reference */}
          <div className="border-b border-border bg-accent/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{selectedConversation.property}</p>
                <p className="text-xs text-muted-foreground">Property inquiry</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                View Property
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === "seller" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                    message.sender === "seller"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border rounded-bl-md"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      message.sender === "seller"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button variant="premium" size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
