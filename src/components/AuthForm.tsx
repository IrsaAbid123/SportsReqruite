import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Trophy, Users, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api'
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
interface AuthFormProps {
  onLogin?: (credentials: { email: string; password: string }) => void;
  onRegister?: (userData: { name: string; email: string; password: string; role: string }) => void;
}

export const AuthForm = ({ onLogin, onRegister }: AuthFormProps) => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "player",
    location: "",
    ageRanges: [] as string[],
    experienceLevels: [] as string[],
    positions: [] as string[],
  });
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY || '',
    libraries: ['places', 'maps'],
  });

  const ageRangeOptions = [
    "6u",
    "7u",
    "8u",
    "9u",
    "10u",
    "11u",
    "12u",
    "13u",
    "14u",
    "15u",
    "16u",
    "17u",
    "18u",
    "College",
  ]

  const experienceLevelOptions = ["A", "AA", "AAA", "Majors"]

  const positionOptions = ["C", "RHP", "LHP", "1B", "2B", "SS", "3B", "OF"]

  const handleMultiSelect = (
    value: string,
    currentArray: string[],
    field: "ageRanges" | "experienceLevels" | "positions",
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    setRegisterData({ ...registerData, [field]: newArray })
  }


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.(loginData);
    navigate("/");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onRegister?.(registerData);
    navigate("/");
  };

  const handlePlacesChanged = () => {
    const places = mapRef.current?.getPlaces();
    if (places && places.length > 0) {
      setRegisterData({
        ...registerData,
        location: places[0].formatted_address || registerData.location
      });
    }
  };

  const switchToLogin = () => setActiveTab("login");
  const switchToRegister = () => setActiveTab("register");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md bg-card shadow-elevated border-border/50">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="text-4xl font-bold bg-gradient-redwhiteblued bg-clip-text text-transparent">
              SportRecruit
            </div>
          </div>
          <CardTitle className="text-2xl">Join the Game</CardTitle>
          <p className="text-muted-foreground">Connect players, teams, and opportunities</p>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "login" | "register")} className="w-full">

            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Join Now</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                {/* 🔗 Links above button */}
                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={switchToRegister}
                    className=" hover:underline"
                  >
                    Don’t have an account?
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/forget-password")}
                    className="text-muted-foreground hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-redwhiteblued hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <StandaloneSearchBox onLoad={(ref) => mapRef.current = ref}
                      onPlacesChanged={handlePlacesChanged}>
                      <Input
                        id="location"
                        type="text"
                        placeholder="Enter your location here..."
                        maxLength={5}
                        value={registerData.location}
                        onChange={(e) => setRegisterData({ ...registerData, location: e.target.value })}
                      />
                    </StandaloneSearchBox>
                  </div>
                  {(registerData.role === "player" || registerData.role === "team") && (
                    <>
                      <div className="space-y-6">

                        {/* Age Ranges */}
                        <div className="space-y-3">
                          <Label htmlFor="age-ranges">Age Ranges</Label>

                          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                            {ageRangeOptions.map((age) => (
                              <div key={age} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`age-${age}`}
                                  checked={registerData.ageRanges.includes(age)}
                                  onCheckedChange={() => handleMultiSelect(age, registerData.ageRanges, "ageRanges")}
                                />
                                <Label htmlFor={`age-${age}`} className="text-sm cursor-pointer">
                                  {age}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Experience Levels */}
                        <div className="space-y-3">
                          <Label htmlFor="experience-levels">Experience Levels</Label>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {experienceLevelOptions.map((level) => (
                              <div key={level} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`exp-${level}`}
                                  checked={registerData.experienceLevels.includes(level)}
                                  onCheckedChange={() =>
                                    handleMultiSelect(level, registerData.experienceLevels, "experienceLevels")
                                  }
                                />
                                <Label htmlFor={`exp-${level}`} className="text-sm cursor-pointer">
                                  {level}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Positions */}
                        <div className="space-y-3">
                          <Label htmlFor="positions">Positions</Label>

                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {positionOptions.map((position) => (
                              <div key={position} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`pos-${position}`}
                                  checked={registerData.positions.includes(position)}
                                  onCheckedChange={() => handleMultiSelect(position, registerData.positions, "positions")}
                                />
                                <Label htmlFor={`pos-${position}`} className="text-sm cursor-pointer">
                                  {position}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Choose Your Role</Label>
                  <RadioGroup
                    value={registerData.role}
                    onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-secondary/20 transition-colors">
                      <RadioGroupItem value="player" id="player" />
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="player" className="font-medium cursor-pointer">
                            Player
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Showcase your skills and find opportunities
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-secondary/20 transition-colors">
                      <RadioGroupItem value="team" id="team" />
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-accent" />
                        <div>
                          <Label htmlFor="team" className="font-medium cursor-pointer">
                            Team/Coach
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Find talented players for your team
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-secondary/20 transition-colors">
                      <RadioGroupItem value="admin" id="admin" />
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-warning" />
                        <div>
                          <Label htmlFor="admin" className="font-medium cursor-pointer">
                            Administrator
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Manage platform and oversee all activities
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <p className="text-center text-sm mt-2">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={switchToLogin}
                    className="text-primary hover:underline"
                  >
                    Sign In
                  </button>
                </p>

                <Button
                  type="submit"
                  className="w-full bg-gradient-redwhiteblued hover:opacity-90 transition-opacity"
                >
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};