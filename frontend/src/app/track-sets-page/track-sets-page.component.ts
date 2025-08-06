import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Set } from '../set/set.component';
import { RepType } from '../rep/rep.component';
import { PerformanceComponent } from '../performance/performance.component';

@Component({
    selector: 'olab-track-sets-page',
    imports: [PerformanceComponent],
    templateUrl: './track-sets-page.component.html',
    styleUrl: './track-sets-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackSetsPageComponent {
    constructor() {
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
