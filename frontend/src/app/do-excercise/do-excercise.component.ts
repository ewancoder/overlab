import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgExercise, NgWorkoutExercise, NgWorkoutExerciseSet } from '../models';
import { WorkoutService } from '../workout.service';

@Component({
    selector: 'olab-do-excercise',
    standalone: true,
    imports: [AsyncPipe, DatePipe, ReactiveFormsModule],
    templateUrl: './do-excercise.component.html',
    styleUrl: './do-excercise.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoExcerciseComponent implements OnInit {
    @Input({ required: true }) workoutExercise!: NgWorkoutExercise;
    @Output() exerciseFinished = new EventEmitter<NgWorkoutExercise>();
    restTimerSignal = signal<Observable<string> | undefined>(undefined);

    public exerciseSignal: WritableSignal<NgExercise | undefined> = signal(undefined);
    public currentSetsSignal: WritableSignal<NgWorkoutExerciseSet[]> = signal([]);
    public addSetForm = new FormGroup({
        weight: new FormControl(20, Validators.required),
        reps: new FormControl('', Validators.required)
    });

    constructor(
        private service: WorkoutService,
        private router: Router
    ) {}

    ngOnInit() {
        this.service
            .getAllExercises()
            .subscribe(exercises => this.exerciseSignal.set(exercises.find(e => e.id == this.workoutExercise.exerciseId)));

        this.currentSetsSignal.set(this.workoutExercise.sets);

        if (this.workoutExercise.sets.length > 0) {
            this.restTimerSignal.set(this.service.createStopwatch(this.workoutExercise.sets.at(-1)!.recordedAtUtc));
        }
    }

    addSet() {
        this.service
            .addSet({ weight: this.addSetForm.controls.weight.value!, reps: this.addSetForm.controls.reps.value! })
            .subscribe(workoutExercise => {
                this.currentSetsSignal.set(workoutExercise.sets);
                this.addSetForm.controls.reps.reset();
                this.restTimerSignal.set(this.service.createStopwatch(workoutExercise.sets.at(-1)!.recordedAtUtc));
            });
    }

    finishExcercise() {
        this.service.finishExercise().subscribe(exercise => {
            if (exercise.isFinished) {
                this.exerciseFinished.emit(exercise);
            }
        });
    }
}
