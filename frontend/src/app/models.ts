export enum ExcerciseType {
    Unset = 0,
    BigCompound = 1,
    Compound = 2,
    Isolation = 3
}

export interface Excercise {
    id: string;
    name: string;
    description: string;
    type: ExcerciseType;
    progressHistory: ExcerciseProgress[];
    muscleGroups: ExcerciseMuscleGroup[];
    category: string;
}

export interface ExcerciseCategory {
    id: string;
    name: string;
    description: string;
    muscleGroupTypes: string[];
}

export interface ExcerciseMuscleGroup {
    typeId: string;
    impact: MuscleGroupImpact;
}

export interface MuscleGroupType {
    id: string;
    name: string;
    description: string;
}

export interface ExcerciseProgress {
    date: Date;
    weight: number;
    sets: Set[];
}

export interface Set {
    date: Date;
    weight?: number; // Overrides the weight set for the ExcerciseProgress.
    reps: string /* A pattern of reps: 5 means 5 lifts, 5* means 10 lifts with every 2nd one as partial, 5+3 means 5 regular lifts and 3 partial. */;
    // TODO: Alternative pattern: 20kg5+3, means 20kg overrides the weight set for the set, 5+3 is like above.
}

export interface Workout {
    startedAt: Date;
    workoutPlanId: string;
    excercises: WorkoutExcercise[];
}

export interface WorkoutPlan {
    id: string;
    mandatoryExcerciseIds: string[];
    focusCategories: string[];
    restCategories: string[];
}

export interface WorkoutExcercise {
    excerciseId: string;
    progress: ExcerciseProgress;
}

export enum MuscleGroupImpact {
    Unknown = 0,
    Primary = 1,
    Secondary = 2,
    Minimal = 3
}

/// Frontend models below, will be generated/calculated by backend.

export interface FeWorkoutPlan {
    id: string;
    startedAt?: Date;
    lastExcerciseFinishedAt?: Date;

    // Generated list of generated excercises for today, but can be removed & can be added more.
    // Probably can be added, but not removed! I still need to hit all muscles.
    // Remove only if some particular muscle group is still sore.
    // They will be sorted by priority (big compound first, then compound, only then isolation).
    // Plus they will be shuffled in specific way:
    // 1. To make sure I give the same muscle group a rest
    // 2. Based on custom rules (like RDL before Pullups, and not straight one after another - needs a rest)
    excercises: FeWorkoutPlanExcercise[];
}

// Generated based on mandatory focus & rest categories, and mandatory excercises.
export interface FeWorkoutPlanExcercise {
    id: string; // Unique index of an item in this plan. Used to mark selected excercises.
    excerciseIds: string[]; // Contains a list of all possible excercises variations I can choose from.
    performedExcerciseId?: string;
}

// I will load ALL possible excercises into memory from API, and just serve them by IDs.
// Also ID itself can be human-readable cause these are well-known excercises.

// TODO: Make sure you do NOT do the SAME excercise twice in one day (exclude anything you do from future picks)
