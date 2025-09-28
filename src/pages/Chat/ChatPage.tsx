"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Send,
    Paperclip,
    Smile,
    MoreVertical,
    Phone,
    Video,
    Search,
    Heart,
    Reply,
    Forward,
    Copy,
    Trash2,
} from "lucide-react"

interface Message {
    id: string
    content: string
    sender: "user" | "other"
    timestamp: Date
    status: "sent" | "delivered" | "read"
    reactions?: string[]
}

interface Contact {
    id: string
    name: string
    avatar: string
    status: "online" | "offline" | "away"
    lastSeen?: string
}

export function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            content: "Hey! How's your day going?",
            sender: "other",
            timestamp: new Date(Date.now() - 3600000),
            status: "read",
        },
        {
            id: "2",
            content: "Pretty good! Just working on some new features. What about you?",
            sender: "user",
            timestamp: new Date(Date.now() - 3500000),
            status: "read",
        },
        {
            id: "3",
            content: "Same here! I'm excited to show you what I've been building 🚀",
            sender: "other",
            timestamp: new Date(Date.now() - 3400000),
            status: "read",
            reactions: ["🔥", "👍"],
        },
        {
            id: "4",
            content: "That sounds amazing! Can't wait to see it. When do you think it'll be ready?",
            sender: "user",
            timestamp: new Date(Date.now() - 3300000),
            status: "delivered",
        },
    ])

    const [newMessage, setNewMessage] = useState("")
    const [selectedContact] = useState<Contact>({
        id: "1",
        name: "Alex Johnson",
        avatar: "/professional-avatar.png",
        status: "online",
    })
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message: Message = {
                id: Date.now().toString(),
                content: newMessage,
                sender: "user",
                timestamp: new Date(),
                status: "sent",
            }
            setMessages((prev) => [...prev, message])
            setNewMessage("")

            // Simulate typing indicator and response
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false)
                const response: Message = {
                    id: (Date.now() + 1).toString(),
                    content: "Thanks for your message! I'll get back to you soon.",
                    sender: "other",
                    timestamp: new Date(),
                    status: "sent",
                }
                setMessages((prev) => [...prev, response])
            }, 2000)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online":
                return "bg-green-500"
            case "away":
                return "bg-yellow-500"
            default:
                return "bg-gray-400"
        }
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <div className="w-80 border-r border-border bg-card hidden lg:flex flex-col">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-card-foreground">Messages</h2>
                        <Button variant="ghost" size="sm">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search conversations..." className="pl-10 bg-background" />
                    </div>
                </div>

                {/* Contacts List */}
                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {[
                            selectedContact,
                            { id: "2", name: "Sarah Wilson", avatar: "/diverse-female-avatar.png", status: "away" as const },
                            {
                                id: "3",
                                name: "Mike Chen",
                                avatar: "/male-avatar.png",
                                status: "offline" as const,
                                lastSeen: "2h ago",
                            },
                        ].map((contact) => (
                            <Card key={contact.id} className="p-3 mb-2 cursor-pointer hover:bg-accent/50 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                                            <AvatarFallback>
                                                {contact.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(contact.status)}`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-card-foreground truncate">{contact.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {contact.status === "online" ? "Online" : contact.lastSeen || "Offline"}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                                        2
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
                                    <AvatarFallback>
                                        {selectedContact.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(selectedContact.status)}`}
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-card-foreground">{selectedContact.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isTyping ? "Typing..." : selectedContact.status === "online" ? "Online" : "Last seen 2h ago"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                                <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Video className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Search className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                                    <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} group`}
                            >
                                <div
                                    className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ${message.sender === "user" ? "order-2" : "order-1"}`}
                                >
                                    <div
                                        className={`relative px-4 py-2 rounded-2xl ${message.sender === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-md"
                                            : "bg-card text-card-foreground rounded-bl-md border"
                                            } shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                        {message.reactions && (
                                            <div className="flex space-x-1 mt-2">
                                                {message.reactions.map((reaction, index) => (
                                                    <span key={index} className="text-xs bg-background/20 rounded-full px-2 py-1">
                                                        {reaction}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Message Actions */}
                                        <div
                                            className={`absolute top-0 ${message.sender === "user" ? "-left-20" : "-right-20"} opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1`}
                                        >
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-background shadow-sm">
                                                <Heart className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-background shadow-sm">
                                                <Reply className="h-3 w-3" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-background shadow-sm">
                                                        <MoreVertical className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        <Forward className="h-4 w-4 mr-2" />
                                                        Forward
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Copy className="h-4 w-4 mr-2" />
                                                        Copy
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center mt-1 space-x-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                                        {message.sender === "user" && (
                                            <div className="flex space-x-1">
                                                {message.status === "sent" && <div className="w-2 h-2 rounded-full bg-muted-foreground" />}
                                                {message.status === "delivered" && <div className="w-2 h-2 rounded-full bg-accent" />}
                                                {message.status === "read" && <div className="w-2 h-2 rounded-full bg-primary" />}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                        <div
                                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}
                                        />
                                        <div
                                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
                    <div className="flex items-end space-x-2">
                        <Button variant="ghost" size="sm" className="mb-2">
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 relative">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="pr-12 py-3 rounded-2xl bg-background border-border focus:ring-2 focus:ring-primary/20"
                            />
                            <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <Smile className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="mb-2 rounded-full w-10 h-10 p-0 bg-primary hover:bg-primary/90"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
