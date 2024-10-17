import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FeWorkoutPlanExcercise } from '../models';

@Component({
    selector: 'olab-excercise-picker',
    standalone: true,
    imports: [],
    templateUrl: './excercise-picker.component.html',
    styleUrl: './excercise-picker.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExcercisePickerComponent {
    @Input({ required: true }) excercise!: FeWorkoutPlanExcercise;
    @ViewChild('picker') picker!: ElementRef<HTMLSelectElement>;
    @Output() excercisePicked = new EventEmitter<string>();

    pickExcercise() {
        this.excercisePicked.emit(this.picker.nativeElement.value);
    }
}
