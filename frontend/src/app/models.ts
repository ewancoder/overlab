export enum ExcerciseType {
    Unknown = 0,
    BigCompound = 1,
    Compound = 2,
    Isolation = 3
}

export interface Excercise {
    id: string;
    name: string;
    description: string;
    type: ExcerciseType;
    history: ExcerciseHistoryEntry[];
    muscleGroups: MuscleGroup[];
    category: string;
}

export interface MuscleGroup {
    typeId: string;
    impact: MuscleGroupImpact;
}

export interface MuscleGroupType {
    id: string;
    name: string;
    description: string;
}

export interface ExcerciseHistoryEntry {
    date: Date;
    weight: number;
    reps: number[];
}

export interface Workout {
    startedAt: Date;
}

export interface WorkoutExcercise {
    specificExcerciseId?: string;
}

export enum MuscleGroupImpact {
    Unknown = 0,
    Primary = 1,
    Secondary = 2,
    Minimal = 3
}
