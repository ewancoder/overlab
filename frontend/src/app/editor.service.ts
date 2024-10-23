import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgExercise, NgExercisePlan, NgWorkoutPlan } from './models';

const apiUri = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class EditorService {
    constructor(private http: HttpClient) {}

    public getAllExercises() {
        return this.http.get<NgExercise[]>(`${apiUri}/exercises`);
    }

    public getAllExercisePlans() {
        return this.http.get<NgExercisePlan[]>(`${apiUri}/exercise-plans`);
    }

    public getAllWorkoutPlans() {
        return this.http.get<NgWorkoutPlan[]>(`${apiUri}/workout-plans`);
    }

    public createExercise(exercise: NgExercise) {
        return this.http.post<NgExercise>(`${apiUri}/exercises`, exercise);
    }

    public createExercisePlan(exercisePlan: NgExercisePlan) {
        return this.http.post<NgExercisePlan>(`${apiUri}/exercise-plans`, exercisePlan);
    }

    public createWorkoutPlan(workoutPlan: NgWorkoutPlan) {
        return this.http.post<NgWorkoutPlan>(`${apiUri}/workout-plans`, workoutPlan);
    }

    public updateExercise(exerciseId: string, exercise: NgExercise) {
        return this.http.put<NgExercise>(`${apiUri}/exercises/${exerciseId}`, exercise);
    }

    public updateExercisePlan(exercisePlanId: string, exercisePlan: NgExercisePlan) {
        return this.http.put<NgExercisePlan>(`${apiUri}/exercise-plans/${exercisePlanId}`, exercisePlan);
    }

    public updateWorkoutPlan(workoutPlanId: string, workoutPlan: NgWorkoutPlan) {
        return this.http.put<NgWorkoutPlan>(`${apiUri}/workout-plans/${workoutPlanId}`, workoutPlan);
    }

    public deleteExercise(exerciseId: string) {
        return this.http.delete<NgExercise>(`${apiUri}/exercises/${exerciseId}`);
    }

    public deleteExercisePlan(exercisePlanId: string) {
        return this.http.delete<NgExercisePlan>(`${apiUri}/exercise-plans/${exercisePlanId}`);
    }

    public deleteWorkoutPlan(workoutPlanId: string) {
        return this.http.delete<NgWorkoutPlan>(`${apiUri}/workout-plans/${workoutPlanId}`);
    }
}
