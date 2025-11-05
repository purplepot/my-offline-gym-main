import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Profile {
  daily_water_goal: number;
}

export function HydrationSection() {
  const [todayWater, setTodayWater] = useState(0);
  const [profile, setProfile] = useState<Profile>({ daily_water_goal: 2000 });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWaterIntake();
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('daily_water_goal')
      .eq('id', user!.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  const fetchWaterIntake = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('water_intake')
      .select('amount')
      .eq('user_id', user!.id)
      .eq('date', today);

    if (!error && data) {
      const total = data.reduce((sum, item) => sum + item.amount, 0);
      setTodayWater(total);
    }
  };

  const waterProgress = (todayWater / profile.daily_water_goal) * 100;
  const waterAmounts = [250, 500, 750, 1000]; // ml

  const handleAddWater = async (amount: number) => {
    const { error } = await supabase.from('water_intake').insert({
      user_id: user!.id,
      amount,
      date: new Date().toISOString().split('T')[0],
    });

    if (error) {
      toast.error('Failed to log water intake');
    } else {
      toast.success(`Added ${amount}ml of water! 💧`);
      fetchWaterIntake();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hydration</h2>
      </div>

      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-accent to-green-500">
            <Droplets className="h-12 w-12 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Today's Water Intake</h3>
            <p className="text-5xl font-bold mb-1">{todayWater}ml</p>
            <p className="text-muted-foreground">of {profile.daily_water_goal}ml goal</p>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <Progress value={Math.min(waterProgress, 100)} className="h-4" />
            <p className="text-sm text-muted-foreground">
              {waterProgress >= 100 
                ? "🎉 Daily goal achieved!"
                : `${profile.daily_water_goal - todayWater}ml remaining`
              }
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            {waterAmounts.map((amount) => (
              <Button
                key={amount}
                onClick={() => handleAddWater(amount)}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:bg-accent/10 hover:border-accent"
              >
                <Plus className="h-5 w-5" />
                <span className="font-semibold">{amount}ml</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-accent/10 to-green-500/10 border-accent/20">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Droplets className="h-5 w-5 text-accent" />
          Hydration Tips
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Drink water first thing in the morning</li>
          <li>• Keep a water bottle with you throughout the day</li>
          <li>• Drink before, during, and after workouts</li>
          <li>• Set hourly reminders to stay on track</li>
        </ul>
      </Card>
    </div>
  );
}
