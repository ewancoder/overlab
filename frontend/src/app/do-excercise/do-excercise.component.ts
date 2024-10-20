import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Excercise, NgWorkoutExerciseSet } from '../models';
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
    @Input({ required: true }) workoutExcerciseIndex!: string;
    @Input({ required: true }) excerciseId!: string;
    restTimerSignal = signal<Observable<string> | undefined>(undefined);

    public excercise: WritableSignal<Excercise | undefined> = signal(undefined);
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
        console.log(this.workoutExcerciseIndex + this.excerciseId);
    }

    startExcercise() {
        this.service
            .startExcercise(this.workoutExcerciseIndex, this.excerciseId)
            .subscribe(excercise => this.excercise.set(excercise));
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
        this.service.finishExcercise().subscribe(() => this.router.navigate(['/workout']));
    }
}
