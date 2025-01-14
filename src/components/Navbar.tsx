import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setUser(session?.user ?? null);
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        toast.success('Successfully signed in!');
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        toast.success('Successfully signed out!');
        navigate('/');
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
        console.log('User updated:', session?.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log("Starting GitHub sign-in process...");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error("Auth error:", error);
        toast.error(`Authentication failed: ${error.message}`);
        throw error;
      }

      console.log("Auth response:", data);
    } catch (error) {
      console.error("Full error:", error);
      if (error instanceof AuthError) {
        toast.error(`Authentication failed: ${error.message}`);
      } else {
        toast.error("Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Sign out error:", error);
      if (error instanceof AuthError) {
        toast.error("Failed to sign out. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading}
              >
                Profile
              </Button>
              <Button
                variant="outline"
                className="neo-brutal-card hover:translate-x-0 hover:translate-y-0"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                {isLoading ? "Signing out..." : "Sign Out"}
              </Button>
            </>
          ) : (
            <Button
              className="neo-brutal-card hover:translate-x-0 hover:translate-y-0"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In with GitHub"}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};