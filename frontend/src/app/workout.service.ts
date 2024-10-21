import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, interval, map, of, throwError } from 'rxjs';
import { NgAddSet, NgExercise, NgExercisePlan, NgWorkout, NgWorkoutExercise, NgWorkoutPlan } from './models';

const apiUri = 'http://localhost:5000/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handle404(error: any) {
    if (error.status === 404) {
        return of(null);
    }

    return throwError(() => error);
}

function workoutWithDates(workout: NgWorkout | null) {
    if (!workout) return null;

    workout.startedAtUtc = new Date(workout.startedAtUtc);
    return workout;
}

@Injectable({ providedIn: 'root' })
export class WorkoutService {
    constructor(private http: HttpClient) {}

    public getAllExercises() {
        return this.http.get<NgExercise[]>(`${apiUri}/exercises`);
    }

    public getAllExercisePlans() {
        return this.http.get<NgExercisePlan[]>(`${apiUri}/exercise-plans`);
    }

    public getCurrentExercise() {
        return this.http.get<NgWorkoutExercise | null>(`${apiUri}/workout/exercises/current`).pipe(catchError(handle404));
    }

    public getCurrentWorkout() {
        return this.http.get<NgWorkout>(`${apiUri}/workout/current`).pipe(catchError(handle404)).pipe(map(workoutWithDates));
    }

    public getAllWorkoutPlans() {
        return this.http.get<NgWorkoutPlan[]>(`${apiUri}/workout-plans`);
    }

    public getWorkoutPlanForToday() {
        return this.http.get<NgWorkoutPlan>(`${apiUri}/workout-plans/today`).pipe(catchError(handle404));
    }

    public startWorkout(workoutPlanId: string) {
        return this.http.post<NgWorkout>(`${apiUri}/workout-plans/${workoutPlanId}/start`, null);
    }

    public cancelWorkout() {
        return this.http.post<NgWorkout>(`${apiUri}/workout/cancel`, null);
    }

    public startExercise(workoutExerciseId: string, exerciseId: string) {
        return this.http.post<NgWorkoutExercise>(`${apiUri}/workout/exercises/${workoutExerciseId}/start/${exerciseId}`, null);
    }

    public addSet(addSet: NgAddSet) {
        return this.http.post<NgWorkoutExercise>(`${apiUri}/workout/sets`, addSet);
    }

    public finishExercise() {
        return this.http.post<NgWorkoutExercise>(`${apiUri}/workout/exercises/finish`, null);
    }

    public cancelExercise() {
        return this.http.post<NgWorkoutExercise>(`${apiUri}/workout/exercises/cancel`, null);
    }

    public addExerciseToWorkout(exercisePlanId: string) {
        return this.http.post<NgWorkoutExercise>(`${apiUri}/workout/exercises/${exercisePlanId}`, null);
    }

    public removeExerciseFromWorkout(workoutExerciseId: string) {
        return this.http.delete<NgWorkoutExercise>(`${apiUri}/workout/exercises/${workoutExerciseId}`);
    }

    public updateWorkoutExerciseNotes(workoutExerciseId: string, notes: string) {
        return this.http.put<NgWorkoutExercise>(`${apiUri}/workout/exercises/${workoutExerciseId}`, { notes: notes });
    }

    public updateWorkoutNotes(workoutId: string, notes: string) {
        return this.http.put<NgWorkout>(`${apiUri}/workout/${workoutId}`, { notes: notes });
    }

    public createStopwatch(dateFrom: Date) {
        return interval(1000).pipe(map(() => new Date(new Date().getTime() - dateFrom.getTime()).toISOString().slice(11, 19)));
    }
}
