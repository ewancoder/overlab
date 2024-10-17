import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
    public workout: Workout | undefined;

    constructor(private http: HttpClient) {}

    public startWorkout(day: string): Observable<void> {
        console.log(`Starting workout for day ${day}`);
        return of().pipe(delay(5000));
    }

    public cancelWorkout(): Observable<void> {
        return of().pipe(delay(5000));
    }

    public finishWorkout(): Observable<void> {
        return of().pipe(delay(5000));
    }
}

export interface Workout {
    startedAt?: Date;
    day: string;
}
