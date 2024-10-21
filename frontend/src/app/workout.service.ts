import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, interval, map, Observable, of, throwError } from 'rxjs';
import {
    Excercise,
    FeWorkoutPlan,
    NgAddSet,
    NgExercise,
    NgExercisePlan,
    NgWorkout,
    NgWorkoutExercise,
    NgWorkoutPlan,
    Set as WorkoutSet
} from './models';

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

    ///
    // Old methods below. Ng is above.

    // TODO: Move this method to service-agnostic file.
    public getTodayWorkoutPlan(): Observable<FeWorkoutPlan> {
        return this.http.get<FeWorkoutPlan>(`${apiUri}/workout/plan`).pipe(map(this.planWithDates), delay(200));
    }

    // Should create a record of current excercise with the start Date.
    public startExcercise(workoutExcerciseIndex: string, excerciseId: string): Observable<Excercise> {
        return this.http
            .post<Excercise>(`${apiUri}/workout/excercise`, { workoutExcerciseIndex, excerciseId })
            .pipe(map(this.excerciseWithDates), delay(200));
    }

    public finishExcercise(): Observable<boolean> {
        return this.http.post<boolean>(`${apiUri}/workout/excercise/finish`, {}).pipe(delay(200));
    }

    private planWithDates(plan: FeWorkoutPlan): FeWorkoutPlan {
        if (plan.startedAt) {
            plan.startedAt = new Date(plan.startedAt);
        }

        if (plan.lastExcerciseFinishedAt) {
            plan.lastExcerciseFinishedAt = new Date(plan.lastExcerciseFinishedAt);
        }

        return plan;
    }

    private setsWithDates(sets: WorkoutSet[]): WorkoutSet[] {
        for (const set of sets) {
            set.date = new Date(set.date);
        }

        return sets;
    }

    private excerciseWithDates(excercise: Excercise): Excercise {
        for (const hist of excercise.progressHistory) {
            hist.date = new Date(hist.date);
        }

        return excercise;
    }
}
