import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Exercise, ExercisesService } from '../exercises.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'olab-exercise-picker',
    imports: [AsyncPipe, RouterLink],
    templateUrl: './exercise-picker.component.html',
    styleUrl: './exercise-picker.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisePickerComponent {
    constructor(protected service: ExercisesService) {}

    protected getExerciseInfo(exercise: Exercise) {
        if (exercise.history.length === 0) return undefined;
        const sets = exercise.history[exercise.history.length - 1].sets;

        return sets.map(set => set.reps).join(' ');
    }
}
