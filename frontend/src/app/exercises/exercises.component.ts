import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'olab-exercises',
    standalone: true,
    imports: [],
    templateUrl: './exercises.component.html',
    styleUrl: './exercises.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesComponent {}
