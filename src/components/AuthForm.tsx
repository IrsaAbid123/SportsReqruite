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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation, useRegisterUserMutation } from "@/redux/ApiCalls/authApi";
import { useUser } from "@/context/UserContext";
import { ageRangeOptions, experienceLevelOptions, positionOptions } from "@/constants/UserDataEnums";
interface AuthFormProps {
  onLogin?: (credentials: { email: string; password: string }) => void;
  onRegister?: (userData: { name: string; email: string; password: string; role: string }) => void;
}

export const AuthForm = ({ onLogin, onRegister }: AuthFormProps) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [positionSelectOpen, setPositionSelectOpen] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "player",
    location: "",
    ageRanges: [] as string[],
    experienceLevels: [] as string[],
    positions: [] as string[],
  });

  // ✅ RTK mutation hook
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY || '',
    libraries: ['places', 'maps'],
  });


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { email: loginData.email, password: loginData.password };
      const response = await loginUser(payload).unwrap();

      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);

      navigate("/");
    } catch (err) {
      console.error("❌ Login Failed:", err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const payload = {
        fullname: `${registerData.firstName} ${registerData.lastName}`,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role,
        location: registerData.location,
        age: registerData.ageRanges[0] || "",
        experienceLevel: registerData.experienceLevels[0] || "",
        position: registerData.positions.join(", "),
      };
      const response = await registerUser(payload).unwrap();

      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);

      navigate("/");
    } catch (err) {
      console.error("❌ Register Failed:", err);
    }
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
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-redwhiteblued bg-clip-text text-transparent">
              SportRecruit
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl">Join the Game</CardTitle>
          <p className="text-muted-foreground text-sm sm:text-base">Connect players, teams, and opportunities</p>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstname">First Name</Label>
                      <Input
                        id="register-firstname"
                        type="text"
                        placeholder="John"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-lastname">Second Name Initial</Label>
                      <Input
                        id="register-lastname"
                        type="text"
                        placeholder="D"
                        value={registerData.lastName}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow single letter and convert to uppercase
                          if (value.length <= 1 && /^[A-Za-z]*$/.test(value)) {
                            setRegisterData({ ...registerData, lastName: value.toUpperCase() });
                          }
                        }}
                        maxLength={1}
                        required
                      />
                    </div>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Label htmlFor="location">Location (Address, City, or ZIP Code)</Label>
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
                      {/* Age Range */}
                      <div className="space-y-3">
                        <Label htmlFor="age-ranges">Age Range</Label>
                        <Select
                          value={registerData.ageRanges[0] || ""}
                          onValueChange={(val) =>
                            setRegisterData({ ...registerData, ageRanges: [val] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Age Range" />
                          </SelectTrigger>
                          <SelectContent>
                            {ageRangeOptions.map((age) => (
                              <SelectItem key={age} value={age}>
                                {age}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Experience Level */}
                      <div className="space-y-3">
                        <Label htmlFor="experience-levels">Experience Level</Label>
                        <Select
                          value={registerData.experienceLevels[0] || ""}
                          onValueChange={(val) =>
                            setRegisterData({ ...registerData, experienceLevels: [val] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Experience Level" />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceLevelOptions.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Position */}
                      <div className="space-y-3">
                        <Label htmlFor="positions">Position(s)</Label>
                        <Popover open={positionSelectOpen} onOpenChange={setPositionSelectOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={positionSelectOpen}
                              className="w-full justify-between"
                            >
                              {registerData.positions.length > 0
                                ? `${registerData.positions.length} position(s) selected`
                                : "Select positions..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search positions..." />
                              <CommandList>
                                <CommandEmpty>No positions found.</CommandEmpty>
                                <CommandGroup>
                                  {positionOptions.map((position) => (
                                    <CommandItem
                                      key={position}
                                      value={position}
                                      onSelect={() => {
                                        if (registerData.positions.includes(position)) {
                                          setRegisterData({
                                            ...registerData,
                                            positions: registerData.positions.filter(p => p !== position)
                                          });
                                        } else {
                                          setRegisterData({
                                            ...registerData,
                                            positions: [...registerData.positions, position]
                                          });
                                        }
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${registerData.positions.includes(position) ? "opacity-100" : "opacity-0"
                                          }`}
                                      />
                                      {position}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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

                    {/* <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-secondary/20 transition-colors">
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
                    </div> */}
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