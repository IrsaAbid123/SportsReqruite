"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Code, MessageCircle, Link, Facebook, Twitter, Mail } from "lucide-react"

interface ShareCardProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    url: string
}

const socialPlatforms = [
    {
        name: "Embed",
        icon: Code,
        color: "bg-slate-100 hover:bg-slate-200 text-slate-700",
        action: (url: string) => console.log("Embed:", url),
    },
    {
        name: "WhatsApp",
        icon: MessageCircle,
        color: "bg-green-100 hover:bg-green-200 text-green-700",
        action: (url: string) => window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank"),
    },
    {
        name: "goo",
        icon: Link,
        color: "bg-red-100 hover:bg-red-200 text-red-700",
        action: (url: string) => console.log("Goo.gl:", url),
    },
    {
        name: "Facebook",
        icon: Facebook,
        color: "bg-blue-100 hover:bg-blue-200 text-blue-700",
        action: (url: string) =>
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank"),
    },
    {
        name: "X",
        icon: Twitter,
        color: "bg-slate-100 hover:bg-slate-200 text-slate-700",
        action: (url: string) => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, "_blank"),
    },
    {
        name: "Email",
        icon: Mail,
        color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
        action: (url: string) => window.open(`mailto:?body=${encodeURIComponent(url)}`, "_blank"),
    },
]

export function ShareCard({ open, onOpenChange, url }: ShareCardProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white border-gray-200 text-gray-900">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 text-lg font-medium">Share</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex justify-between items-center gap-2">
                        {socialPlatforms.map((platform) => {
                            const IconComponent = platform.icon
                            return (
                                <div key={platform.name} className="flex flex-col items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`w-12 h-12 rounded-full ${platform.color}`}
                                        onClick={() => platform.action(url)}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                    </Button>
                                    <span className="text-xs text-gray-600">{platform.name}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <Input
                            type="text"
                            readOnly
                            value={url}
                            className="flex-1 bg-transparent border-none text-gray-900 text-sm focus:ring-0 focus:outline-none"
                        />
                        <Button
                            size="sm"
                            onClick={handleCopy}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 mr-1" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
