import { Routes } from '@angular/router';
import { ExerciseTrackerComponent } from './exercise-tracker/exercise-tracker.component';
import { ExerciseHistoryComponent } from './exercise-history/exercise-history.component';
import { AirtoolsComponent } from './airtools/airtools.component';

export const routes: Routes = [
    { path: '', redirectTo: '/sets/test', pathMatch: 'full' },
    {
        path: 'sets',
        component: ExerciseTrackerComponent,
        children: [{ path: ':exercise', component: ExerciseHistoryComponent }]
    },
    { path: 'air', component: AirtoolsComponent }
];
