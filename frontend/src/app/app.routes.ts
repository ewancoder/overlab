import { Routes } from '@angular/router';
import { TrackSetsPageComponent } from './track-sets-page/track-sets-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/sets/test', pathMatch: 'full' },
    { path: 'sets/:exercise', component: TrackSetsPageComponent }
];
