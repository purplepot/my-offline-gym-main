import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Activity, Flame, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function ProgressSection() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [waterIntakes, setWaterIntakes] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    // Fetch workouts
    const { data: workoutsData } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user!.id);
    if (workoutsData) setWorkouts(workoutsData);

    // Fetch meals
    const { data: mealsData } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user!.id);
    if (mealsData) setMeals(mealsData);

    // Fetch water intake
    const { data: waterData } = await supabase
      .from('water_intake')
      .select('*')
      .eq('user_id', user!.id);
    if (waterData) setWaterIntakes(waterData);
  };

  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  // Aggregate data by day
  const workoutData = last7Days.map(date => {
    const dayWorkouts = workouts.filter(w => w.date === date);
    const totalMinutes = dayWorkouts.reduce((sum, w) => sum + w.duration, 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: totalMinutes,
    };
  });

  const calorieData = last7Days.map(date => {
    const dayMeals = meals.filter(m => m.date === date);
    const totalCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      calories: totalCalories,
    };
  });

  const waterData = last7Days.map(date => {
    const dayWater = waterIntakes
      .filter(w => w.date === date)
      .reduce((sum, w) => sum + w.amount, 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      ml: dayWater,
    };
  });

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalWorkoutMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
  const avgWorkoutDuration = totalWorkouts > 0 ? Math.round(totalWorkoutMinutes / totalWorkouts) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Progress & Stats</h2>
        <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Workouts</p>
              <p className="text-2xl font-bold">{totalWorkouts}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Avg. duration: {avgWorkoutDuration} min
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Flame className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Meals</p>
              <p className="text-2xl font-bold">{meals.length}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Logged across all days
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Droplets className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Water Records</p>
              <p className="text-2xl font-bold">{waterIntakes.length}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Stay hydrated! 💧
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Workout Minutes</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={workoutData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Calorie Intake</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={calorieData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="calories" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--secondary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Hydration (ml)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="ml" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--accent))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
