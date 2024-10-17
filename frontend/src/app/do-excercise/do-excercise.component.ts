import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { Excercise } from '../models';
import { WorkoutService } from '../workout.service';

@Component({
    selector: 'olab-do-excercise',
    standalone: true,
    imports: [DatePipe],
    templateUrl: './do-excercise.component.html',
    styleUrl: './do-excercise.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoExcerciseComponent implements OnInit {
    @Input({ required: true }) workoutExcerciseIndex!: string;
    @Input({ required: true }) excerciseId!: string;
    public excercise: WritableSignal<Excercise | undefined> = signal(undefined);

    constructor(private service: WorkoutService) {}

    ngOnInit() {
        console.log(this.workoutExcerciseIndex + this.excerciseId);
    }

    start() {
        this.service.startExcercise().subscribe(excercise => this.excercise.set(excercise));
    }
}
