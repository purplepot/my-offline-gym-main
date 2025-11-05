import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Bell, Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export function SettingsSection() {
  const [profile, setProfile] = useState({ name: '', daily_calorie_goal: 2000, daily_water_goal: 2000 });
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        name: formData.get('name') as string,
        daily_calorie_goal: parseInt(formData.get('calorieGoal') as string),
        daily_water_goal: parseInt(formData.get('waterGoal') as string),
      })
      .eq('id', user!.id);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success("Profile updated successfully!");
      fetchProfile();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
        <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary">
          <Settings className="h-6 w-6 text-white" />
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </h3>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={profile.name}
              required 
            />
          </div>
          <div>
            <Label htmlFor="calorieGoal">Daily Calorie Goal</Label>
            <Input 
              id="calorieGoal" 
              name="calorieGoal" 
              type="number" 
              min="500"
              defaultValue={profile.daily_calorie_goal}
              required 
            />
          </div>
          <div>
            <Label htmlFor="waterGoal">Daily Water Goal (ml)</Label>
            <Input 
              id="waterGoal" 
              name="waterGoal" 
              type="number" 
              min="500"
              step="100"
              defaultValue={profile.daily_water_goal}
              required 
            />
          </div>
          <Button type="submit" className="w-full">Save Profile</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-muted-foreground">
                Reminders for workouts and hydration
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-none">
        <h3 className="font-semibold mb-2">About This App</h3>
        <p className="text-sm text-muted-foreground">
          Your fitness data is securely stored in Supabase. All data is protected with 
          Row Level Security, ensuring your information stays private and secure.
        </p>
      </Card>
    </div>
  );
}
