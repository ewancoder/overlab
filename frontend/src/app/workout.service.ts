import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FeWorkoutPlan } from './models';

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
}
