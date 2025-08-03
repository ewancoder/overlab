import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Rep } from '../rep/rep.component';
import { SubsetComponent } from '../subset/subset.component';

@Component({
    selector: 'olab-set',
    imports: [SubsetComponent],
    templateUrl: './set.component.html',
    styleUrl: './set.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetComponent {
    @Input() isCompact = false;
    @Input() showType = true;
    @Input({ required: true }) set!: Set;

    protected getSubSets() {
        let weight = 0;
        let subSets: SubSet[] = [];
        let currentSubSet: SubSet | undefined;
        for (const rep of this.set.reps) {
            if (weight === 0) {
                weight = rep.weight;
                currentSubSet = {
                    weight: weight,
                    reps: [rep]
                };
                continue;
            }

            if (weight === rep.weight) {
                currentSubSet!.reps.push(rep);
                continue;
            }

            subSets.push(currentSubSet!);
            weight = rep.weight;
            currentSubSet = {
                weight: rep.weight,
                reps: [rep]
            };
        }

        subSets.push(currentSubSet!);

        return subSets;
    }
}

export interface Set {
    date: Date;
    reps: Rep[];
}

export interface SubSet {
    weight: number;
    reps: Rep[];
}
