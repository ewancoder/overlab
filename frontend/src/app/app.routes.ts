import { Routes } from '@angular/router';
import { ExerciseComponent } from './exercise/exercise.component';

export const routes: Routes = [
    { path: '', redirectTo: '/exercises/deadlift', pathMatch: 'full' },
    { path: 'exercises/:exerciseId', component: ExerciseComponent }
];
