import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ExcercisePickerComponent } from '../excercise-picker/excercise-picker.component';
import { FeWorkoutPlan } from '../models';
import { WorkoutService } from '../workout.service';

/// eslint-disable-next-line @typescript-eslint/no-explicit-any
//declare const Notification: any;

@Component({
    selector: 'olab-workout',
    standalone: true,
    imports: [ExcercisePickerComponent],
    templateUrl: './workout.component.html',
    styleUrl: './workout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutComponent implements OnInit {
    planSignal = signal<FeWorkoutPlan | null>(null);

    constructor(
        private service: WorkoutService,
        private router: Router
    ) {}

    ngOnInit() {
        this.service.getTodayWorkoutPlan().subscribe(plan => this.planSignal.set(plan));

        /*if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        setInterval(() => {
            new Notification(new Date());
        }, 5000);*/
    }

    startExcercise(planExcerciseIndex: string, excerciseId: string) {
        // Just redirect. The 'DO' component will update api with start / cancel / finish / update events.
        this.router.navigate(['/workout', planExcerciseIndex, excerciseId]);
    }

    getPerformedExcercises(plan: FeWorkoutPlan): string[] {
        return plan.excercises.map(excercise => excercise.performedExcerciseId!).filter(x => x);
    }
}
