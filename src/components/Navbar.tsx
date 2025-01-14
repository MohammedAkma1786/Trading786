import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create supabase client if credentials are available
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!supabase) {
      toast.error("Supabase configuration is missing. Some features may not work.");
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (!supabase) {
      toast.error("Authentication is not available at the moment");
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  const handleSignOut = async () => {
    if (!supabase) {
      toast.error("Authentication is not available at the moment");
      return;
    }

    await supabase.auth.signOut();
  };

  return (
    <nav className="w-full border-b-2 border-black bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Crypto Tracker</h1>
        <div className="flex gap-4">
          {user ? (
            <>
              <Button
                className="neo-brutal-card hover:translate-x-0 hover:translate-y-0"
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
              <Button
                variant="outline"
                className="neo-brutal-card hover:translate-x-0 hover:translate-y-0"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              className="neo-brutal-card hover:translate-x-0 hover:translate-y-0"
              onClick={handleSignIn}
            >
              Sign In with GitHub
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};