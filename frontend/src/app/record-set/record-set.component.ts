import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'olab-record-set',
    imports: [],
    templateUrl: './record-set.component.html',
    styleUrl: './record-set.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordSetComponent {
    completeSet() {}
}
