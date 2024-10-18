import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Excercise, Set } from '../models';
import { WorkoutService } from '../workout.service';

@Component({
    selector: 'olab-do-excercise',
    standalone: true,
    imports: [DatePipe, ReactiveFormsModule],
    templateUrl: './do-excercise.component.html',
    styleUrl: './do-excercise.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoExcerciseComponent implements OnInit {
    @Input({ required: true }) workoutExcerciseIndex!: string;
    @Input({ required: true }) excerciseId!: string;

    public excercise: WritableSignal<Excercise | undefined> = signal(undefined);
    public currentSetsSignal: WritableSignal<Set[]> = signal([]);
    public addSetForm = new FormGroup({
        weight: new FormControl(20, Validators.required),
        reps: new FormControl('', Validators.required)
    });

    constructor(private service: WorkoutService) {}

    ngOnInit() {
        console.log(this.workoutExcerciseIndex + this.excerciseId);
    }

    start() {
        this.service.startExcercise().subscribe(excercise => this.excercise.set(excercise));
    }

    addSet() {
        this.service
            .addSet(this.addSetForm.controls.weight.value!, this.addSetForm.controls.reps.value!)
            .subscribe(currentSets => {
                this.currentSetsSignal.set(currentSets);
                this.addSetForm.controls.reps.reset();
            });
    }
}
