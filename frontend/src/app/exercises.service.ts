import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExercisesService {
    private readonly data$ = new BehaviorSubject<Exercise[]>([]);

    constructor() {
        //const data = localStorage.getItem('overlab_data') ?? '[]';
        const data =
            localStorage.getItem('overlab_data') ??
            JSON.stringify([
                {
                    id: 'deadlift',
                    name: 'Deadlift',
                    history: [
                        {
                            sets: [
                                {
                                    timestamp: new Date(2024, 1, 1),
                                    reps: '8'
                                },
                                {
                                    timestamp: new Date(2024, 2, 2),
                                    reps: '80'
                                }
                            ]
                        },
                        {
                            sets: [
                                {
                                    timestamp: new Date(2024, 3, 3),
                                    reps: '30*+3'
                                }
                            ]
                        }
                    ]
                }
            ]);
        this.data$.next(
            (JSON.parse(data) as Exercise[]).map(e => {
                e.history.forEach(h => h.sets.forEach(s => (s.timestamp = new Date(s.timestamp))));
                return e;
            }) ?? []
        );
    }

    public get exercises$(): Observable<Exercise[]> {
        return this.data$.asObservable();
    }

    public getExercise$(exerciseId: string): Observable<Exercise> {
        return this.exercises$.pipe(map(exercises => exercises.find(e => e.id === exerciseId)!)); // TODO: Remove ! and handle not found exercises.
    }
}

export interface Exercise {
    id: string;
    name: string;
    history: ExercisePerformed[];
}

export interface ExercisePerformed {
    sets: ExerciseSet[];
}

export interface ExerciseSet {
    reps: string;
    timestamp: Date;
}
