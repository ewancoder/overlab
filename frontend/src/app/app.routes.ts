import { Routes } from '@angular/router';
import { WorkoutComponent } from './workout/workout.component';

export const routes: Routes = [{ path: 'workout/:day', component: WorkoutComponent }];
