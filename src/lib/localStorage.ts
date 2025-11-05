// Local storage utilities for the fitness app

export interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number; // in minutes
  exercises: Exercise[];
  caloriesBurned?: number;
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
}

export interface Meal {
  id: string;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
}

export interface WaterIntake {
  id: string;
  date: string;
  amount: number; // in ml
}

export interface UserProfile {
  name: string;
  dailyCalorieGoal: number;
  dailyWaterGoal: number; // in ml
  workoutReminder?: string;
  hydrationReminder?: string;
}

const STORAGE_KEYS = {
  WORKOUTS: 'fitness_app_workouts',
  MEALS: 'fitness_app_meals',
  WATER: 'fitness_app_water',
  PROFILE: 'fitness_app_profile',
};

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage: ${key}`, error);
  }
}

// Workout functions
export function getWorkouts(): Workout[] {
  return getFromStorage<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
}

export function saveWorkout(workout: Workout): void {
  const workouts = getWorkouts();
  workouts.push(workout);
  saveToStorage(STORAGE_KEYS.WORKOUTS, workouts);
}

export function deleteWorkout(id: string): void {
  const workouts = getWorkouts().filter(w => w.id !== id);
  saveToStorage(STORAGE_KEYS.WORKOUTS, workouts);
}

// Meal functions
export function getMeals(): Meal[] {
  return getFromStorage<Meal[]>(STORAGE_KEYS.MEALS, []);
}

export function saveMeal(meal: Meal): void {
  const meals = getMeals();
  meals.push(meal);
  saveToStorage(STORAGE_KEYS.MEALS, meals);
}

export function deleteMeal(id: string): void {
  const meals = getMeals().filter(m => m.id !== id);
  saveToStorage(STORAGE_KEYS.MEALS, meals);
}

// Water intake functions
export function getWaterIntakes(): WaterIntake[] {
  return getFromStorage<WaterIntake[]>(STORAGE_KEYS.WATER, []);
}

export function saveWaterIntake(intake: WaterIntake): void {
  const intakes = getWaterIntakes();
  intakes.push(intake);
  saveToStorage(STORAGE_KEYS.WATER, intakes);
}

// Profile functions
export function getUserProfile(): UserProfile {
  return getFromStorage<UserProfile>(STORAGE_KEYS.PROFILE, {
    name: 'User',
    dailyCalorieGoal: 2000,
    dailyWaterGoal: 2000,
  });
}

export function saveUserProfile(profile: UserProfile): void {
  saveToStorage(STORAGE_KEYS.PROFILE, profile);
}

// Utility functions for today's data
export function getTodayWorkouts(): Workout[] {
  const today = new Date().toISOString().split('T')[0];
  return getWorkouts().filter(w => w.date === today);
}

export function getTodayMeals(): Meal[] {
  const today = new Date().toISOString().split('T')[0];
  return getMeals().filter(m => m.date === today);
}

export function getTodayWater(): number {
  const today = new Date().toISOString().split('T')[0];
  return getWaterIntakes()
    .filter(w => w.date === today)
    .reduce((sum, w) => sum + w.amount, 0);
}
