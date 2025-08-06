import { Injectable } from '@angular/core';
import { Set } from './set/set.component';
import { Observable } from 'rxjs';
import { Rep } from './rep/rep.component';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';

@Injectable({ providedIn: 'root' })
export class ApiService implements IApiService {
    private exercisesUri = `${config.apiUri}/exercises`;
    constructor(private http: HttpClient) {}

    getAllExercises(): Observable<string[]> {
        return this.http.get<string[]>(this.exercisesUri);
    }

    getAllForExercise(exercise: string): Observable<Set[]> {
        return this.http.get<Set[]>(`${this.exercisesUri}/exercises/${exercise}/sets`);
    }

    completeSet(exercise: string, rep: Rep): Observable<Set> {
        return this.http.post<Set>(
            `${this.exercisesUri}/exercises/${exercise}/sets?reps=${rep}`,
            null
        );
    }
}

export interface IApiService {
    getAllExercises(): Observable<string[]>;
    getAllForExercise(exercise: string): Observable<Set[]>;
    completeSet(exercise: string, rep: Rep): Observable<Set>;
}
