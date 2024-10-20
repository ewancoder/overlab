import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ExcercisePickerComponent } from '../excercise-picker/excercise-picker.component';
import { NgWorkout, NgWorkoutPlan } from '../models';
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
    workoutTimerSignal = signal<Observable<string> | undefined>(undefined);
    restTimerSignal = signal<Observable<string> | undefined>(undefined);

    currentWorkout = signal<NgWorkout | null>(null);
    allWorkoutPlans = signal<NgWorkoutPlan[]>([]);
    todayWorkoutPlanId = signal<string | null>(null);

    constructor(
        private service: WorkoutService,
        private router: Router
    ) {}

    ngOnInit() {
        this.service.getAllWorkoutPlans().subscribe(wps => this.allWorkoutPlans.set(wps));
        this.service.getWorkoutPlanForToday().subscribe(wp => this.todayWorkoutPlanId.set(wp.id));

        this.service.getCurrentWorkout().subscribe(workout => {
            this.currentWorkout.set(workout);
            this.workoutTimerSignal.set(this.service.createStopwatch(workout.startedAtUtc));
            const lastSetsOfFinishedExercises = workout.workoutExercises
                .filter(e => e.isFinished && e.sets.length > 0)
                .map(e => e.sets.at(-1)!.recordedAtUtc);
            if (lastSetsOfFinishedExercises.length > 0) {
                const maxDate = new Date(Math.max(...lastSetsOfFinishedExercises.map(Number)));
                this.restTimerSignal.set(this.service.createStopwatch(maxDate));
            }
        });
    }

    startExcercise(planExcerciseIndex: string, excerciseId: string) {
        // Just redirect. The 'DO' component will update api with start / cancel / finish / update events.
        this.router.navigate(['/workout', planExcerciseIndex, excerciseId]);
    }

    getPerformedExcercises(workout: NgWorkout): string[] {
        return workout.workoutExercises.map(excercise => excercise.exerciseId!).filter(x => x);
    }
}
