
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
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#FDE1D3] dark:bg-[#1A1F2C]">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="neo-brutal-card p-8 space-y-6 bg-white/80 border-[#D6BCFA] dark:bg-[#221F26] dark:border-[#403E43]">
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
            <Button
              onClick={handleUpgrade}
              className="neo-brutal-card w-full bg-[#7E69AB] hover:bg-[#9b87f5] dark:bg-[#1EAEDB] dark:hover:bg-[#0FA0CE] text-white hover:translate-x-0 hover:translate-y-0"
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
