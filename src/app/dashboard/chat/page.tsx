
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageWrapper } from "@/components/shared/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRecentMessages, sendMessage } from "@/app/actions/chat";
import type { ChatMessage } from "@/lib/types";
import { formatDistanceToNowStrict } from 'date-fns';


const MOCKED_CURRENT_USER_ID = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"; // Corresponds to CypherUser (valid UUID)
const MOCKED_CURRENT_USERNAME = "CypherUser"; // For display consistency until real auth context

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    // setIsLoading(true); // Only set loading on initial load or manual refresh
    try {
      const fetchedMessages = await getRecentMessages(100); // Fetch more messages
      setMessages(fetchedMessages);
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch messages.", variant: "destructive" });
    } finally {
      // setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    setIsLoading(true);
    fetchMessages().finally(() => setIsLoading(false));

    const intervalId = setInterval(() => {
      fetchMessages();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [fetchMessages]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const result = await sendMessage({ userId: MOCKED_CURRENT_USER_ID, content: newMessage.trim() });
      if (result.success && result.chatMessage) {
        // Optimistically add message, or rely on next poll
        // setMessages(prev => [...prev, result.chatMessage!]); 
        setNewMessage("");
        fetchMessages(); // Refresh immediately after sending
      } else {
        toast({ title: "Error", description: result.message || "Failed to send message.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };
  
  const getAvatarFallback = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  }

  return (
    <PageWrapper className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.12)-2px)]"> {/* Adjust height considering header and footer */}
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <MessageSquare className="mr-3 h-8 w-8 text-primary text-glow-primary" />
        Global Nexus Chat
      </h1>
      <Card className="flex-grow flex flex-col frosted-glass shadow-xl border border-border/30 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Live Feed</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {isLoading && messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="ml-2 text-muted-foreground">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
               <div className="flex flex-col justify-center items-center h-full text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-lg text-muted-foreground">No messages yet.</p>
                <p className="text-sm text-muted-foreground">Be the first to break the silence!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${msg.userId === MOCKED_CURRENT_USER_ID ? "justify-end" : ""}`}
                  >
                    {msg.userId !== MOCKED_CURRENT_USER_ID && (
                       <Avatar className="h-8 w-8 border-2 border-accent">
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${getAvatarFallback(msg.username)}`} alt={msg.username} data-ai-hint="abstract letter" />
                        <AvatarFallback className="bg-accent text-accent-foreground">{getAvatarFallback(msg.username)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                        msg.userId === MOCKED_CURRENT_USER_ID 
                        ? "bg-primary/80 text-primary-foreground rounded-br-none" 
                        : "bg-card border border-border/50 rounded-bl-none"
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${msg.userId === MOCKED_CURRENT_USER_ID ? "text-primary-foreground/80" : "text-accent text-glow-accent"}`}>
                          {msg.userId === MOCKED_CURRENT_USER_ID ? "You" : msg.username}
                        </span>
                         <span className={`text-xs ${msg.userId === MOCKED_CURRENT_USER_ID ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          {formatDistanceToNowStrict(msg.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    {msg.userId === MOCKED_CURRENT_USER_ID && (
                      <Avatar className="h-8 w-8 border-2 border-primary">
                         <AvatarImage src={`https://placehold.co/40x40.png?text=${getAvatarFallback(MOCKED_CURRENT_USERNAME)}`} alt={MOCKED_CURRENT_USERNAME} data-ai-hint="abstract letter" />
                        <AvatarFallback className="bg-primary text-primary-foreground">{getAvatarFallback(MOCKED_CURRENT_USERNAME)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t border-border/30">
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow bg-input/50 border-border/70 focus:bg-input focus:border-primary"
              disabled={isSending}
            />
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground text-glow-accent" disabled={isSending || !newMessage.trim()}>
              {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="ml-2 sr-only sm:not-sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}
