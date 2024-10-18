import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, interval, map, Observable, of } from 'rxjs';
import { Excercise, ExcerciseType, FeWorkoutPlan, MuscleGroupImpact, Set as WorkoutSet } from './models';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
    constructor(private http: HttpClient) {}

    // TODO: Move this method to service-agnostic file.
    public createStopwatch(dateFrom: Date) {
        return interval(1000).pipe(map(() => new Date(new Date().getTime() - dateFrom.getTime()).toISOString().slice(11, 19)));
    }

    public getTodayWorkoutPlan(): Observable<FeWorkoutPlan> {
        return of({
            id: 'full-body-3',
            startedAt: new Date() /* Should get it by taking the start time of the first excercise. */,
            lastExcerciseFinishedAt: new Date(),
            excercises: [
                { id: '1', excerciseIds: ['deadlift'] },
                { id: '2', excerciseIds: ['high-to-low-cable-fly'] },
                {
                    id: '3',
                    excerciseIds: [
                        'chest-supported-row',
                        'unilateral-db-row',
                        'unilateral-cable-row',
                        'machine-row',
                        'lat-prayer'
                    ],
                    performedExcerciseId: 'machine-row'
                },
                {
                    id: '4',
                    excerciseIds: ['skull-crusher', 'unilateral-upright-cable-tricep-kickback', 'overhead-cable-tricep-extension']
                },
                {
                    id: '5',
                    excerciseIds: [
                        'chest-supported-row',
                        'unilateral-db-row',
                        'unilateral-cable-row',
                        'machine-row',
                        'lat-prayer'
                    ]
                },
                {
                    id: '6',
                    excerciseIds: ['incline-db-biceps-curl', 'standing-db-biceps-curl']
                }
            ]
        }).pipe(delay(200));
    }

    // Should create a record of current excercise with the start Date.
    public startExcercise(): Observable<Excercise> {
        const excercise: Excercise = {
            id: 'deadlift',
            name: 'Deadlift',
            description: "Big ol' deadlift",
            category: 'back',
            muscleGroups: [
                { typeId: 'back-muscle', impact: MuscleGroupImpact.Primary },
                { typeId: 'legs', impact: MuscleGroupImpact.Primary },
                { typeId: 'forearm', impact: MuscleGroupImpact.Secondary },
                { typeId: 'toes', impact: MuscleGroupImpact.Minimal }
            ],
            progressHistory: [
                {
                    date: new Date(),
                    weight: 105,
                    sets: [
                        { date: new Date(), reps: '5*' },
                        { date: new Date(), reps: '3*+2' },
                        { date: new Date(), weight: 80, reps: '5*' }
                    ]
                },
                {
                    date: new Date(),
                    weight: 110,
                    sets: [
                        { date: new Date(), reps: '6*' },
                        { date: new Date(), reps: '4*+2' },
                        { date: new Date(), weight: 80, reps: '9' }
                    ]
                }
            ],
            type: ExcerciseType.BigCompound
        };

        return of(excercise).pipe(delay(200));
    }

    // Adds a new set to the current excercise, and returns currently done list of sets (to not lose sync with the server).
    public addSet(weight: number, reps: string): Observable<WorkoutSet[]> {
        const set: WorkoutSet = {
            date: new Date(),
            weight: weight,
            reps: reps
        };

        return of([set]).pipe(delay(2000));
    }

    public finishExcercise(): Observable<boolean> {
        // TODO: Record finish excercise date.
        return of(true).pipe(delay(2000));
    }
}
