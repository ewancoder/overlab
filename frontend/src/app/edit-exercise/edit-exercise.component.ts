import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'olab-edit-exercise',
    standalone: true,
    imports: [],
    templateUrl: './edit-exercise.component.html',
    styleUrl: './edit-exercise.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditExerciseComponent {
    @Input({ required: true }) exerciseId!: string;
}
