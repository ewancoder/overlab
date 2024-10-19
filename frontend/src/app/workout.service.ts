import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, interval, map, Observable } from 'rxjs';
import { Excercise, FeWorkoutPlan, Set as WorkoutSet } from './models';

const apiUri = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
    constructor(private http: HttpClient) {}

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

    // Adds a new set to the current excercise, and returns currently done list of sets (to not lose sync with the server).
    public addSet(weight: number, reps: string): Observable<WorkoutSet[]> {
        return this.http.post<WorkoutSet[]>(`${apiUri}/workout/sets`, { weight, reps }).pipe(map(this.setsWithDates), delay(200));
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
