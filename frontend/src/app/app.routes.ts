import { Routes } from '@angular/router';
import { DoExcerciseComponent } from './do-excercise/do-excercise.component';
import { WorkoutComponent } from './workout/workout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/workout', pathMatch: 'full' },
    { path: 'workout', component: WorkoutComponent },
    { path: 'workout/:workoutExcerciseIndex/:excerciseId', component: DoExcerciseComponent }
];
