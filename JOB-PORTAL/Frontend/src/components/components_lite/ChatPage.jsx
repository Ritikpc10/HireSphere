import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
} from "lucide-react";

// Demo contacts for MVP - in production this would come from API
const demoContacts = [
  { id: 1, name: "HR - TechCorp India", lastMessage: "Your interview is scheduled for Monday", time: "2m ago", unread: 2, avatar: "", online: true },
  { id: 2, name: "Recruiter - InfoSys", lastMessage: "We'd like to proceed with your application", time: "1h ago", unread: 0, avatar: "", online: true },
  { id: 3, name: "Hiring Team - Wipro", lastMessage: "Thank you for applying!", time: "3h ago", unread: 1, avatar: "", online: false },
  { id: 4, name: "HR Manager - Google", lastMessage: "Please share your portfolio", time: "1d ago", unread: 0, avatar: "", online: false },
  { id: 5, name: "Talent Acquisition - Amazon", lastMessage: "We have reviewed your profile", time: "2d ago", unread: 0, avatar: "", online: true },
];

const demoMessages = {
  1: [
    { id: 1, sender: "them", text: "Hi! Thanks for applying to TechCorp India.", time: "10:00 AM", read: true },
    { id: 2, sender: "them", text: "We'd love to schedule an interview with you.", time: "10:01 AM", read: true },
    { id: 3, sender: "me", text: "That sounds great! I'm available next week.", time: "10:15 AM", read: true },
    { id: 4, sender: "them", text: "Perfect! How about Monday at 11 AM?", time: "10:20 AM", read: true },
    { id: 5, sender: "me", text: "Monday works perfectly for me!", time: "10:25 AM", read: true },
    { id: 6, sender: "them", text: "Your interview is scheduled for Monday", time: "10:30 AM", read: false },
  ],
  2: [
    { id: 1, sender: "them", text: "Hello! We reviewed your application at InfoSys.", time: "9:00 AM", read: true },
    { id: 2, sender: "them", text: "We'd like to proceed with your application", time: "9:05 AM", read: true },
  ],
};

const ChatPage = () => {
  const { user } = useSelector((store) => store.auth);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(demoMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [selectedChat, messages]);

  const handleSend = () => {
    if (!message.trim() || !selectedChat) return;
    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));
    setMessage("");
  };

  const filteredContacts = demoContacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) =>
    name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  const activeContact = demoContacts.find((c) => c.id === selectedChat);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl mx-auto w-full" style={{ height: "calc(100vh - 64px)" }}>
        {/* Contact list */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-card ${selectedChat ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-lg flex items-center gap-2 mb-3">
              <MessageCircle className="h-5 w-5 text-primary" /> Messages
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact, i) => (
              <button
                key={contact.id}
                onClick={() => setSelectedChat(contact.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-muted/60 transition-colors border-b border-border/50 opacity-0 animate-fadeSlideIn ${
                  selectedChat === contact.id ? "bg-primary/5" : ""
                }`}
                style={{ animationFillMode: "forwards", animationDelay: `${i * 50}ms` }}
              >
                <div className="relative">
                  <Avatar className="h-11 w-11 rounded-xl">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-xs font-bold">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">{contact.name}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{contact.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 mt-1">
                    {contact.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {selectedChat ? (
          <div className={`flex-1 flex flex-col bg-background ${!selectedChat ? "hidden md:flex" : ""}`}>
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-1 rounded-lg hover:bg-muted mr-1">
                  ←
                </button>
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                    {getInitials(activeContact?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{activeContact?.name}</p>
                  <p className="text-[10px] text-green-500">{activeContact?.online ? "Online" : "Offline"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(messages[selectedChat] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === "me"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.sender === "me" ? "justify-end" : ""}`}>
                      <span className="text-[10px] opacity-70">{msg.time}</span>
                      {msg.sender === "me" && (
                        msg.read ? <CheckCheck className="h-3 w-3 opacity-70" /> : <Check className="h-3 w-3 opacity-70" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="rounded-xl"
                />
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg shrink-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="h-9 w-9 rounded-xl bg-primary hover:bg-primary/90 shrink-0"
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-background">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-1">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
