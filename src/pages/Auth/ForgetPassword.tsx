import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "@/redux/ApiCalls/authApi";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgotPassword({ email }).unwrap();
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            console.error("❌ Forgot password failed:", err);
        }
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
                            type="submit" disabled={isLoading}
                            className="w-full bg-gradient-redwhiteblued hover:opacity-90 transition-opacity"
                        >
                            {isLoading ? "Sending..." : "Send OTP"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
