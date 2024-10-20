import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    signal,
    ViewChild
} from '@angular/core';
import { map } from 'rxjs';
import { NgExercisePlan, NgWorkoutExercise } from '../models';
import { WorkoutService } from '../workout.service';

@Component({
    selector: 'olab-excercise-picker',
    standalone: true,
    imports: [AsyncPipe],
    templateUrl: './excercise-picker.component.html',
    styleUrl: './excercise-picker.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExcercisePickerComponent implements OnInit {
    @Input({ required: true }) excercise!: NgWorkoutExercise;
    @Input({ required: true }) performedExcerciseIds!: string[];
    @ViewChild('picker') picker!: ElementRef<HTMLSelectElement>;
    @Output() excercisePicked = new EventEmitter<string>();
    exercisePlanSignal = signal<NgExercisePlan | undefined>(undefined);

    constructor(private service: WorkoutService) {}

    ngOnInit() {
        this.service.getAllExercisePlans().subscribe(plans => {
            const plan = plans.find(p => p.id === this.excercise.exercisePlanId);
            this.exercisePlanSignal.set(plan);
        });
    }

    pickExcercise() {
        this.excercisePicked.emit(this.picker.nativeElement.value);
    }

    wasExcercisePerformed(excerciseId: string) {
        return this.performedExcerciseIds.indexOf(excerciseId) >= 0;
    }

    getExercisePlan$(exercisePlanId: string) {
        return this.service.getAllExercisePlans().pipe(map(plans => plans.find(p => p.id === exercisePlanId)));
    }
}
