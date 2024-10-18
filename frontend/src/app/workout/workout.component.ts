import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ExcercisePickerComponent } from '../excercise-picker/excercise-picker.component';
import { FeWorkoutPlan } from '../models';
import { WorkoutService } from '../workout.service';

/// eslint-disable-next-line @typescript-eslint/no-explicit-any
//declare const Notification: any;

@Component({
    selector: 'olab-workout',
    standalone: true,
    imports: [AsyncPipe, ExcercisePickerComponent],
    templateUrl: './workout.component.html',
    styleUrl: './workout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutComponent implements OnInit {
    planSignal = signal<FeWorkoutPlan | null>(null);
    timerSignal = signal<Observable<string> | undefined>(undefined);
    restTimerSignal = signal<Observable<string> | undefined>(undefined);

    constructor(
        private service: WorkoutService,
        private router: Router
    ) {}

    ngOnInit() {
        this.service.getTodayWorkoutPlan().subscribe(plan => {
            this.timerSignal.set(this.service.createStopwatch(plan.startedAt));
            if (plan.lastExcerciseFinishedAt) {
                this.restTimerSignal.set(this.service.createStopwatch(plan.lastExcerciseFinishedAt));
            }
            this.planSignal.set(plan);
        });

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
