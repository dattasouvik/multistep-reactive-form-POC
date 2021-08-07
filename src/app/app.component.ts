import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChip } from '@angular/material/chips';

import { DATA } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // 2021-08-04T18:30:00.000Z
  workoutForm: FormGroup;

  readonly minDate: Date = new Date();

  readonly data = DATA;

  readonly scheduleLIst: string[] = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.workoutForm = this.fb.group({
      activities: this.fb.array([this.newActivityType()], [Validators.required])
    });
    this.setWorkoutPlan(this.data);
  }

  activities(): FormArray {
    return this.workoutForm.get('activities') as FormArray;
  }

  newActivityType(preload = true): FormGroup {
    if (!!preload) {
      return this.fb.group({
        activityIdentifier: ['', [Validators.required]],
        subActivity: this.fb.array(
          [this.newsubActivity()],
          [Validators.required]
        )
      });
    }
    return this.fb.group({
      activityIdentifier: ['', [Validators.required]],
      subActivity: this.fb.array([])
    });
  }

  addActivityType() {
    this.activities().push(this.newActivityType());
  }

  removeActivityType(index: number) {
    this.activities().removeAt(index);
  }

  subActivity(index: number): FormArray {
    return this.activities()
      .at(index)
      .get('subActivity') as FormArray;
  }

  newsubActivity(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      validity: [''],
      sets: ['', [Validators.pattern('^[0-9]*$')]],
      repetition: ['', [Validators.pattern('^[0-9]*$')]],
      duration: ['', [Validators.pattern('^[0-9]*$')]],
      rest: ['', [Validators.pattern('^[0-9]*$')]],
      comment: [''],
      schedule: ['',  Validators.required]
      // schedule: this.fb.group(
      //   {
      //     mon: [false],
      //     tue: [false],
      //     wed: [false],
      //     thurs: [false],
      //     fri: [false],
      //     sat: [false],
      //     sun: [false],
      //   }
      // )
    });
  }

  addsubActivity(index: number) {
    this.subActivity(index).push(this.newsubActivity());
  }

  removesubActivity(index: number, activityIndex: number) {
    this.subActivity(index).removeAt(activityIndex);
  }

  onSubmit() {
    console.log(this.workoutForm.value);
  }

  private setWorkoutPlan(data: any) {
    this.clearFormArray();

    data.activities.map((t: any) => {
      const newActivityType: FormGroup = this.newActivityType(false);
      this.activities().push(newActivityType);
      t.subActivity.map((b: any) => {
        const newsubActivity = this.newsubActivity();
        (newActivityType.get('subActivity') as FormArray).push(newsubActivity);
      });
    });
    this.workoutForm.patchValue(data, { onlySelf: true });
  }

  clearFormArray() {
    this.activities().clear();
  }

  toggleSelection(chip: MatChip, activityIndex: number, subActivityIndex: number){

    chip.toggleSelected();
    const {selected, value} = chip;
    const scheduleControl = this.subActivity(activityIndex)
    .at(subActivityIndex).get('schedule') as FormControl;

    const schedule = scheduleControl.value ?? [];
    let modifiedSchedule = [];
    if (selected && !schedule.includes(value)){
      modifiedSchedule = [...schedule, value];
    }else{
      modifiedSchedule = schedule.filter((o: any) => o !== value);
    }
    scheduleControl.patchValue(modifiedSchedule, {emitEvent: false});
  }

}
