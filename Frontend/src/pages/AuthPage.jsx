import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Home, LogIn, UserPlus } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("buyer"); // Default role for signup
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        // Pass null for role to allow the store to handle it, or we can check after login
        const success = await login(email, password, null);
        
        if (success) {
          const user = useAuthStore.getState().user;
          
          // CRITICAL: Prevent Admin login from public page
          if (user.role === 'admin') {
             // Logs out immediately if they somehow logged in as admin here
             // (Though backend should ideally handle this, we enforce it here too)
             useAuthStore.getState().logout(); 
             toast({
               title: "Access Denied",
               description: "Administrators must use the tailored Admin Login page.",
               variant: "destructive",
             });
             return;
          }

          toast({
            title: "Login successful",
            description: `Welcome back, ${user.name}`,
          });
          
          // Role-based Redirects
          if (user.role === 'seller') {
            navigate(user.profileCompleted ? "/dashboard" : "/complete-profile");
          } else {
            // Buyer — go to /buy unless they were redirected from a specific page
            const destination = (from && from !== "/" && from !== "/login") ? from : "/buy";
            navigate(destination); 
          }
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
        }
      } else {
        // --- REGISTER LOGIC ---
        const success = await register(name, email, password, role);
        
        if (success) {
          const user = useAuthStore.getState().user;
          toast({
            title: "Registration successful",
            description: "Account created successfully!",
          });

          // Role-based Redirects
          if (user.role === 'seller') {
            navigate("/complete-profile");
          } else {
            navigate("/buy");
          }
        } else {
          toast({
            title: "Registration failed",
            description: "Could not create account. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset form errors or state if needed
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">Rachna Innovative</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {isLogin ? <LogIn className="w-6 h-6 text-primary" /> : <UserPlus className="w-6 h-6 text-primary" />}
            </div>
            <CardTitle className="text-2xl">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to your account to continue" : "Join us to find or list properties"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="role">I want to</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buy or Rent Properties</SelectItem>
                      <SelectItem value="seller">List & Sell Properties</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading 
                  ? (isLogin ? "Signing in..." : "Creating account...") 
                  : (isLogin ? "Sign in" : "Sign up")
                }
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <Button variant="link" className="p-0 h-auto font-semibold" onClick={toggleMode}>
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </div>
            
            {/* Admin Login Link */}
            {isLogin && (
                <div className="text-center text-xs">
                    <Button variant="link" className="text-muted-foreground p-0 h-auto" onClick={() => navigate('/admin/login')}>
                        Admin Login
                    </Button>
                </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
