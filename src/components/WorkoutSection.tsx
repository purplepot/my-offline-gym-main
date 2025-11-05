import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Timer, Dumbbell, Trash2, Play, Pause } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Workout {
  id: string;
  exercise: string;
  duration: number;
  calories: number;
  date: string;
  user_id: string;
}

export function WorkoutSection() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch workouts');
    } else {
      setWorkouts(data || []);
    }
  };

  const handleStartTimer = () => {
    if (isTimerRunning) {
      if (timerInterval) clearInterval(timerInterval);
      setIsTimerRunning(false);
      toast.success(`Workout completed: ${Math.floor(timerSeconds / 60)} minutes`);
    } else {
      setIsTimerRunning(true);
      const interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const handleResetTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleAddWorkout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from('workouts').insert({
      user_id: user!.id,
      exercise: formData.get('exerciseName') as string,
      duration: parseInt(formData.get('duration') as string),
      calories: parseInt(formData.get('duration') as string) * 5, // rough estimate
      date: new Date().toISOString().split('T')[0],
    });

    if (error) {
      toast.error('Failed to log workout');
    } else {
      toast.success("Workout logged successfully!");
      fetchWorkouts();
      e.currentTarget.reset();
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete workout');
    } else {
      toast.success("Workout deleted");
      fetchWorkouts();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workouts</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log a Workout</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" name="duration" type="number" min="1" required />
              </div>
              <div>
                <Label htmlFor="exerciseName">Exercise Name</Label>
                <Input id="exerciseName" name="exerciseName" required />
              </div>
              <Button type="submit" className="w-full">Log Workout</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Workout Timer
          </h3>
          <Button variant="outline" size="sm" onClick={handleResetTimer}>
            Reset
          </Button>
        </div>
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold tabular-nums">{formatTime(timerSeconds)}</div>
          <Button 
            onClick={handleStartTimer} 
            size="lg" 
            className="gap-2"
          >
            {isTimerRunning ? (
              <>
                <Pause className="h-5 w-5" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Start
              </>
            )}
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Workouts</h3>
        {workouts.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Dumbbell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No workouts logged yet. Start your fitness journey!</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {workouts.slice(0, 6).map((workout) => (
              <Card key={workout.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Dumbbell className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{workout.exercise}</h4>
                        <p className="text-sm text-muted-foreground">{workout.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Duration: {workout.duration} minutes | ~{workout.calories} cal
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteWorkout(workout.id)}
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
