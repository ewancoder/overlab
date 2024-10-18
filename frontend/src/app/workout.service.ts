import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Excercise, ExcerciseType, FeWorkoutPlan, MuscleGroupImpact } from './models';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
    constructor(private http: HttpClient) {}

    public getTodayWorkoutPlan(): Observable<FeWorkoutPlan> {
        return of({
            id: 'full-body-3',
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
                    ]
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
        });
    }

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
                { date: new Date(), weight: 105, sets: [{ reps: '5*' }, { reps: '3*+2' }, { weight: 80, reps: '5*' }] },
                { date: new Date(), weight: 110, sets: [{ reps: '6*' }, { reps: '4*+2' }, { weight: 80, reps: '9' }] }
            ],
            type: ExcerciseType.BigCompound
        };

        return of(excercise).pipe(delay(200));
    }
}
