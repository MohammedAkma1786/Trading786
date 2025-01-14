import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
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
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  const handleSignOut = async () => {
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