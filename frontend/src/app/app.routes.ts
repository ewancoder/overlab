import { Routes } from '@angular/router';
import { WorkoutComponent } from './workout/workout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/workout', pathMatch: 'full' },
    { path: 'workout', component: WorkoutComponent }
];
