import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Workout } from '../models';
import { WorkoutService } from '../workout.service';

@Component({
    selector: 'olab-workout',
    standalone: true,
    imports: [],
    templateUrl: './workout.component.html',
    styleUrl: './workout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutComponent implements OnInit {
    workoutSignal = signal<Workout | null>(null);

    constructor(private service: WorkoutService) {}

    ngOnInit() {
        this.service.startOrGetWorkout().subscribe(workout => this.workoutSignal.set(workout));
    }
}
