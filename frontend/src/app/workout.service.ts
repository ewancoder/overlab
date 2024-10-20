import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, interval, map, Observable } from 'rxjs';
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
        return this.http.get<NgWorkout>(`${apiUri}/workout/current`);
    }

    public getAllWorkoutPlans() {
        return this.http.get<NgWorkoutPlan[]>(`${apiUri}/workout-plans`);
    }

    public getWorkoutPlanForToday() {
        return this.http.get<NgWorkoutPlan>(`${apiUri}/workout-plans/today`);
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

    ///
    // Old methods below. Ng is above.

    // TODO: Move this method to service-agnostic file.
    public createStopwatch(dateFrom: Date) {
        return interval(1000).pipe(map(() => new Date(new Date().getTime() - dateFrom.getTime()).toISOString().slice(11, 19)));
    }

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
