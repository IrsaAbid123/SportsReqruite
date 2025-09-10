import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`OTP sent to ${email}`);
        navigate("/verify-otp");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
            <Card className="w-full max-w-md bg-card shadow-elevated border-border/50">
                <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                        <div className="text-4xl font-bold bg-gradient-redwhiteblued bg-clip-text text-transparent">
                            SportRecruit
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <p className="text-muted-foreground">Enter your email to receive OTP</p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <Input
                                id="reset-email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-redwhiteblued hover:opacity-90 transition-opacity"
                        >
                            Send OTP
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
