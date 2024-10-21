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
    allWorkoutPlansSignal = signal<NgWorkoutPlan[]>([]);
    todayWorkoutPlanSignal = signal<NgWorkoutPlan | null | undefined>(undefined);
    currentWorkoutSignal = signal<NgWorkout | null | undefined>(undefined);
    workoutTimerSignal = signal<Observable<string> | undefined>(undefined);
    restTimerSignal = signal<Observable<string> | undefined>(undefined);

    constructor(
        private service: WorkoutService,
        private router: Router
    ) {}

    ngOnInit() {
        this.service.getAllWorkoutPlans().subscribe(wps => this.allWorkoutPlansSignal.set(wps));
        this.service.getWorkoutPlanForToday().subscribe(wp => this.todayWorkoutPlanSignal.set(wp));

        this.service.getCurrentWorkout().subscribe(workout => {
            this.setCurrentWorkout(workout);
        });
    }

    startExcercise(workoutExerciseId: string, excerciseId: string) {
        // Just redirect. The 'DO' component will update api with start / cancel / finish / update events.
        this.router.navigate(['/workout', workoutExerciseId, excerciseId]);
    }

    getPerformedExcercises(workout: NgWorkout): string[] {
        return workout.workoutExercises.map(excercise => excercise.exerciseId!).filter(x => x);
    }

    startWorkout(workoutPlanId: string) {
        this.service.startWorkout(workoutPlanId).subscribe(workout => this.setCurrentWorkout(workout));
    }

    private setCurrentWorkout(workout: NgWorkout | null) {
        this.currentWorkoutSignal.set(workout);
        if (workout === null) return;

        this.workoutTimerSignal.set(this.service.createStopwatch(workout.startedAtUtc));
        const lastSetsOfFinishedExercises = workout.workoutExercises
            .filter(e => e.isFinished && e.sets.length > 0)
            .map(e => e.sets.at(-1)!.recordedAtUtc);
        if (lastSetsOfFinishedExercises.length > 0) {
            const maxDate = new Date(Math.max(...lastSetsOfFinishedExercises.map(Number)));
            this.restTimerSignal.set(this.service.createStopwatch(maxDate));
        }
    }
}
