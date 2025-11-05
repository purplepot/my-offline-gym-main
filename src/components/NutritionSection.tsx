import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, UtensilsCrossed, Trash2, Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
  user_id: string;
}

interface Profile {
  daily_calorie_goal: number;
}

export function NutritionSection() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [profile, setProfile] = useState<Profile>({ daily_calorie_goal: 2000 });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMeals();
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('daily_calorie_goal')
      .eq('id', user!.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  const fetchMeals = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user!.id)
      .eq('date', today)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch meals');
    } else {
      setMeals(data || []);
    }
  };

  const todayCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const calorieProgress = (todayCalories / profile.daily_calorie_goal) * 100;

  const handleAddMeal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from('meals').insert({
      user_id: user!.id,
      name: formData.get('name') as string,
      calories: parseInt(formData.get('calories') as string),
      protein: 0,
      carbs: 0,
      fats: 0,
      date: new Date().toISOString().split('T')[0],
    });

    if (error) {
      toast.error('Failed to log meal');
    } else {
      toast.success("Meal logged successfully!");
      fetchMeals();
      e.currentTarget.reset();
    }
  };

  const handleDeleteMeal = async (id: string) => {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete meal');
    } else {
      toast.success("Meal deleted");
      fetchMeals();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Nutrition</h2>
        <div className="flex gap-2">
          <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calculator className="h-4 w-4" />
                Calculator
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Calorie Calculator</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Quick reference for common foods:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>Apple (medium)</span>
                    <span className="font-semibold">95 cal</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>Banana (medium)</span>
                    <span className="font-semibold">105 cal</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>Chicken breast (100g)</span>
                    <span className="font-semibold">165 cal</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>Brown rice (1 cup)</span>
                    <span className="font-semibold">216 cal</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>Egg (large)</span>
                    <span className="font-semibold">72 cal</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Log Meal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log a Meal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddMeal} className="space-y-4">
                <div>
                  <Label htmlFor="name">Food Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input id="calories" name="calories" type="number" min="0" required />
                </div>
                <Button type="submit" className="w-full">Log Meal</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Today's Calorie Budget</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Consumed</span>
            <span className="font-semibold">{todayCalories} / {profile.daily_calorie_goal} cal</span>
          </div>
          <Progress value={Math.min(calorieProgress, 100)} className="h-3" />
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-muted-foreground">
              {calorieProgress > 100 
                ? `${Math.round(todayCalories - profile.daily_calorie_goal)} cal over budget`
                : `${Math.round(profile.daily_calorie_goal - todayCalories)} cal remaining`
              }
            </span>
            {calorieProgress <= 100 && (
              <span className="text-sm font-medium text-green-600">On track! 🎯</span>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Today's Meals</h3>
        {meals.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <UtensilsCrossed className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No meals logged today. Start tracking your nutrition!</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {meals.map((meal) => (
              <Card key={meal.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <UtensilsCrossed className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{meal.name}</h4>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-primary">{meal.calories} cal</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMeal(meal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
