import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Rocket, Star, Menu, X } from "lucide-react";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Link to="/" className="text-xl font-bold dark:text-white">
            CryptoCanvas
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 dark:text-white" />
            ) : (
              <Menu className="h-6 w-6 dark:text-white" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/high-potential" className="flex items-center space-x-2 dark:text-gray-300 hover:text-primary transition-colors">
              <Rocket className="h-5 w-5" />
              <span>High Potential</span>
            </Link>
            {user && (
              <Link to="/favorites" className="flex items-center space-x-2 dark:text-gray-300 hover:text-primary transition-colors">
                <Star className="h-5 w-5" />
                <span>Favorites</span>
              </Link>
            )}
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <Link
              to="/high-potential"
              className="flex items-center space-x-2 dark:text-gray-300 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Rocket className="h-5 w-5" />
              <span>High Potential</span>
            </Link>
            {user && (
              <Link
                to="/favorites"
                className="flex items-center space-x-2 dark:text-gray-300 hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Star className="h-5 w-5" />
                <span>Favorites</span>
              </Link>
            )}
            <div className="flex flex-col space-y-4">
              <ThemeToggle />
              {user ? (
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full dark:border-gray-700 dark:text-gray-300">
                    Profile
                  </Button>
                </Link>
              ) : (
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full dark:border-gray-700 dark:text-gray-300">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};