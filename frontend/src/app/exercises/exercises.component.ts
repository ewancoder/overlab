import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EditorService } from '../editor.service';
import { NgExercise } from '../models';

@Component({
    selector: 'olab-exercises',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './exercises.component.html',
    styleUrl: './exercises.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesComponent {
    exercises = signal<NgExercise[] | undefined>(undefined);

    constructor(private service: EditorService) {
        service.getAllExercises().subscribe(exercises => this.exercises.set(exercises));
    }
}
