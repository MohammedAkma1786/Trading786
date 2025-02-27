
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Successfully signed in!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Error signing in");
      console.error("Error signing in:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Successfully signed up! Please check your email for confirmation.");
    } catch (error) {
      toast.error(error.message || "Error signing up");
      console.error("Error signing up:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Error signing out:", error);
    }
  };

  const handleUpgrade = async () => {
    // This will be implemented when we add Stripe integration
    toast.info("Upgrade to premium feature coming soon!");
    console.log("Upgrade to premium");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EFE6] to-[#D4C9B9] dark:bg-[#1A1F2C]">
        <Navbar />
        <div className="container py-8">
          <div className="max-w-md mx-auto">
            <div className="neo-brutal-card p-8 space-y-6 bg-white/90 border-[#6E59A5] dark:bg-[#221F26] dark:border-[#403E43]">
              <p className="text-center text-[#333333] dark:text-[#F1F0FB]">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EFE6] to-[#D4C9B9] dark:bg-[#1A1F2C]">
        <Navbar />
        <div className="container py-8">
          <div className="max-w-2xl mx-auto">
            <div className="neo-brutal-card p-8 space-y-6 bg-white/90 border-[#6E59A5] dark:bg-[#221F26] dark:border-[#403E43]">
              <h1 className="text-3xl font-bold text-[#333333] dark:text-[#F1F0FB]">Profile</h1>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#555555] dark:text-[#8E9196]">Email</p>
                  <p className="font-medium text-[#333333] dark:text-[#F1F0FB]">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#555555] dark:text-[#8E9196]">Account Type</p>
                  <p className="font-medium text-[#333333] dark:text-[#F1F0FB]">Free Plan</p>
                </div>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={handleUpgrade}
                  className="neo-brutal-card w-full bg-[#6E59A5] hover:bg-[#7E69AB] dark:bg-[#1EAEDB] dark:hover:bg-[#0FA0CE] text-white hover:translate-x-0 hover:translate-y-0"
                >
                  Upgrade to Premium
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full border-[#6E59A5] dark:border-[#403E43] text-[#6E59A5] dark:text-[#F1F0FB]"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EFE6] to-[#D4C9B9] dark:bg-[#1A1F2C]">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-md mx-auto">
          <div className="neo-brutal-card p-8 space-y-6 bg-white/90 border-[#6E59A5] dark:bg-[#221F26] dark:border-[#403E43]">
            <h1 className="text-3xl font-bold text-center text-[#333333] dark:text-[#F1F0FB] mb-6">
              CryptoCanvas
            </h1>
            
            <Tabs defaultValue="sign-in" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sign-in">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#333333] dark:text-[#F1F0FB]">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-[#6E59A5] dark:border-[#403E43]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#333333] dark:text-[#F1F0FB]">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-[#6E59A5] dark:border-[#403E43]"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={authLoading}
                    className="neo-brutal-card w-full bg-[#6E59A5] hover:bg-[#7E69AB] dark:bg-[#1EAEDB] dark:hover:bg-[#0FA0CE] text-white hover:translate-x-0 hover:translate-y-0 mt-6"
                  >
                    {authLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="sign-up">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#333333] dark:text-[#F1F0FB]">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-[#6E59A5] dark:border-[#403E43]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#333333] dark:text-[#F1F0FB]">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-[#6E59A5] dark:border-[#403E43]"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={authLoading}
                    className="neo-brutal-card w-full bg-[#6E59A5] hover:bg-[#7E69AB] dark:bg-[#1EAEDB] dark:hover:bg-[#0FA0CE] text-white hover:translate-x-0 hover:translate-y-0 mt-6"
                  >
                    {authLoading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
