import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
        return;
      }
      setUser(session.user);
    });
  }, [navigate]);

  const handleUpgrade = async () => {
    // This will be implemented when we add Stripe integration
    console.log("Upgrade to premium");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="neo-brutal-card p-8 space-y-6">
            <h1 className="text-3xl font-bold">Profile</h1>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Type</p>
                <p className="font-medium">Free Plan</p>
              </div>
            </div>
            <Button
              onClick={handleUpgrade}
              className="neo-brutal-card w-full hover:translate-x-0 hover:translate-y-0"
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;