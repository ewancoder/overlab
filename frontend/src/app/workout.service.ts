import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Excercise, ExcerciseType, MuscleGroupImpact, Workout } from './models';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
    constructor(private http: HttpClient) {}

    private fakeWorkout: Workout | null = null;

    public startOrGetWorkout(): Observable<Workout> {
        this.fakeWorkout = {
            startedAt: new Date()
        };

        return of(this.fakeWorkout).pipe(delay(2000));
    }

    public cancelWorkout(): Observable<void> {
        return of().pipe(delay(2000));
    }

    public finishWorkout(): Observable<void> {
        return of().pipe(delay(2000));
    }
}

const data: Excercise[] = [
    {
        id: 'face-pull',
        name: 'Face Pull',
        type: ExcerciseType.Compound,
        description:
            'Use two ropes to not limit range of motion. Pull them on the level of sight. Your thumbs should point behind you. Carefully and very slowly to not damage the shoulders. Do not jerk.',
        history: [
            {
                date: new Date(2024, 10, 17, 16),
                weight: 7.5,
                reps: [10, 10, 10]
            }
        ],
        muscleGroups: [
            { typeId: 'rear-deltoid', impact: MuscleGroupImpact.Primary },
            { typeId: 'rotator-cuff', impact: MuscleGroupImpact.Primary },
            { typeId: 'trapezius', impact: MuscleGroupImpact.Secondary },
            { typeId: 'lateral-deltoid', impact: MuscleGroupImpact.Secondary }
        ],
        category: 'back'
    }
];
