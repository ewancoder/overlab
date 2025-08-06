import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    ViewChild
} from '@angular/core';
import { Set } from '../set/set.component';
import { RepType } from '../rep/rep.component';
import { PerformanceHistoryComponent } from '../performance-history/performance-history.component';
import { RecordSetComponent } from '../record-set/record-set.component';

@Component({
    selector: 'olab-exercise-history',
    imports: [PerformanceHistoryComponent],
    templateUrl: './exercise-history.component.html',
    styleUrl: './exercise-history.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseHistoryComponent {
    @Input({ required: true }) exercise!: string;

    constructor() {
        // TODO: Get sets for history based on exercise, and complete sets for specific exercise.
        this.sets.push(this.sets[0]);
        this.sets.push(this.sets[0]);
        this.sets.push(this.sets[0]);
        this.sets.push(this.sets[0]);
    }

    sets: Set[] = [
        {
            date: new Date(),
            reps: [
                {
                    weight: 25,
                    type: RepType.Regular,
                    amount: 10
                },
                {
                    weight: 25,
                    type: RepType.AlternatingWithLongLengthPartial,
                    amount: 7
                },
                {
                    weight: 25,
                    type: RepType.AlternatingWithLongLengthPartial,
                    amount: 4
                },
                {
                    weight: 20,
                    type: RepType.AlternatingWithLongLengthPartial,
                    amount: 8
                },
                {
                    weight: 20,
                    type: RepType.LongLengthPartial,
                    amount: 5
                },
                {
                    weight: 17.5,
                    type: RepType.LongLengthPartial,
                    amount: 6
                }
            ]
        }
    ];
}
