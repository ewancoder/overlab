import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'olab-workout',
    standalone: true,
    imports: [],
    templateUrl: './workout.component.html',
    styleUrl: './workout.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutComponent {
    @Input({ required: true }) day!: string;
}
