import { Routes } from '@angular/router';
import { EditExerciseComponent } from './edit-exercise/edit-exercise.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { WorkoutComponent } from './workout/workout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/workout', pathMatch: 'full' },
    { path: 'workout', component: WorkoutComponent },
    { path: 'editor/exercises', component: ExercisesComponent },
    { path: 'editor/exercises/:exerciseId', component: EditExerciseComponent }
];
