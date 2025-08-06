import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild
} from '@angular/core';
import { Set } from '../set/set.component';
import { RepType } from '../rep/rep.component';
import { PerformanceHistoryComponent } from '../performance-history/performance-history.component';
import { RecordSetComponent } from '../record-set/record-set.component';

@Component({
    selector: 'olab-track-sets-page',
    imports: [PerformanceHistoryComponent, RecordSetComponent],
    templateUrl: './track-sets-page.component.html',
    styleUrl: './track-sets-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackSetsPageComponent implements AfterViewInit {
    constructor() {
        this.sets.push(this.sets[0]);
        this.sets.push(this.sets[0]);
        this.sets.push(this.sets[0]);
        this.sets.push(this.sets[0]);
    }

    @ViewChild('history') historyElement!: ElementRef<HTMLDivElement>;

    ngAfterViewInit() {
        this.historyElement.nativeElement.scrollTop =
            this.historyElement.nativeElement.scrollHeight;
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
