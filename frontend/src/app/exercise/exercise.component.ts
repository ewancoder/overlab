import { Component, Input, OnInit } from '@angular/core';
import { Exercise, ExercisePerformed, ExercisesService } from '../exercises.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'olab-exercise',
    imports: [AsyncPipe],
    templateUrl: './exercise.component.html',
    styleUrl: './exercise.component.scss'
})
export class ExerciseComponent implements OnInit {
    protected exercise$!: Observable<Exercise>;
    @Input({ required: true }) exerciseId!: string;

    constructor(private service: ExercisesService) {}

    ngOnInit() {
        this.exercise$ = this.service.getExercise$(this.exerciseId);
    }

    protected getDate(performed: ExercisePerformed) {
        return performed.sets[0].timestamp.toLocaleDateString('en-US');
    }

    protected submitRep() {
        alert('submit');
    }
}
