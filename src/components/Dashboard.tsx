import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Flame, Droplets, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function Dashboard() {
  const [profile, setProfile] = useState({ name: 'User', daily_calorie_goal: 2000, daily_water_goal: 2000 });
  const [todayWorkouts, setTodayWorkouts] = useState<any[]>([]);
  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [todayWater, setTodayWater] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();

    if (profileData) setProfile(profileData);

    // Fetch today's workouts
    const { data: workoutsData } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user!.id)
      .eq('date', today);

    if (workoutsData) setTodayWorkouts(workoutsData);

    // Fetch today's meals
    const { data: mealsData } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user!.id)
      .eq('date', today);

    if (mealsData) setTodayMeals(mealsData);

    // Fetch today's water intake
    const { data: waterData } = await supabase
      .from('water_intake')
      .select('amount')
      .eq('user_id', user!.id)
      .eq('date', today);

    if (waterData) {
      const total = waterData.reduce((sum, item) => sum + item.amount, 0);
      setTodayWater(total);
    }
  };

  const totalWorkoutMinutes = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const calorieProgress = (totalCalories / profile.daily_calorie_goal) * 100;
  const waterProgress = (todayWater / profile.daily_water_goal) * 100;

  const stats = [
    {
      icon: Activity,
      label: "Workouts Today",
      value: todayWorkouts.length,
      subtitle: `${totalWorkoutMinutes} minutes`,
      gradient: "from-primary to-orange-500",
    },
    {
      icon: Flame,
      label: "Calories",
      value: totalCalories,
      subtitle: `of ${profile.daily_calorie_goal} goal`,
      progress: Math.min(calorieProgress, 100),
      gradient: "from-secondary to-blue-500",
    },
    {
      icon: Droplets,
      label: "Hydration",
      value: `${todayWater}ml`,
      subtitle: `of ${profile.daily_water_goal}ml goal`,
      progress: Math.min(waterProgress, 100),
      gradient: "from-accent to-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile.name}!</h1>
          <p className="text-muted-foreground mt-1">Here's your fitness summary for today</p>
        </div>
        <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
                {stat.progress !== undefined && (
                  <Progress value={stat.progress} className="h-2 mt-3" />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-none">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Keep pushing forward! 💪</h3>
            <p className="text-muted-foreground">
              You're making great progress. Remember, consistency is key to reaching your fitness goals.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
