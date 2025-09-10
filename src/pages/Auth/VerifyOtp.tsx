import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 4) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        alert(`Entered OTP: ${code}`);
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
                    <CardTitle className="text-2xl">Verify OTP</CardTitle>
                    <p className="text-muted-foreground">Enter the 5-digit code sent to your email</p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    className="w-12 h-12 text-center text-lg"
                                    required
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-redwhiteblued hover:opacity-90 transition-opacity"
                            onClick={() => navigate("/reset-password")}
                        >
                            Verify
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
