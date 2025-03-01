import { Routes } from '@angular/router';
import { ExerciseComponent } from './exercise/exercise.component';
import { ExercisePickerComponent } from './exercise-picker/exercise-picker.component';

export const routes: Routes = [
    { path: '', redirectTo: '/exercises', pathMatch: 'full' },
    { path: 'exercises/:exerciseId', component: ExerciseComponent },
    { path: 'exercises', component: ExercisePickerComponent }
];
