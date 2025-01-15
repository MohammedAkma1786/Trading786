import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Rocket } from "lucide-react";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();
  }, []);

  return (
    <nav className="border-b-2 border-black dark:border-gray-700 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold dark:text-white">
              CryptoCanvas
            </Link>
            <Link to="/high-potential" className="flex items-center space-x-2 dark:text-gray-300 hover:text-primary transition-colors">
              <Rocket className="h-5 w-5" />
              <span>High Potential</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <Link to="/profile">
                <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                  Profile
                </Button>
              </Link>
            ) : (
              <Link to="/profile">
                <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};