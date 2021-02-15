import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { FormService, Name } from '../shared/form-service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit {
  formGrp: FormGroup;
  userPic: File;
  dataUrl: string;
  date: Date;
  constructor(private formService: FormService) {}
  ngOnInit(): void {
    this.date = new Date();
    this.date.setFullYear(this.date.getFullYear() - 18);
    this.formGrp = new FormGroup({
      name: new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
      }),
      fatherName: new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
      }),
      motherName: new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
      }),
      gender: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      phone: new FormControl('', [
        Validators.required,
        this.validatePhoneNumber,
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      pic: new FormControl('', []),
    });
  }
  getFormValue(fieldName: string): Name | string {
    if (
      fieldName === 'name' ||
      fieldName === 'fatherName' ||
      fieldName === 'motherName'
    ) {
      return {
        firstName: this.formGrp.get(fieldName + '.' + 'firstName').value,
        lastName: this.formGrp.get(fieldName + '.' + 'lastName').value,
      };
    }
    return this.formGrp.get(fieldName).value;
  }
  onInput(event: any) {
    this.userPic = event.target.files[0];
    let fr = new FileReader();
    fr.onload = () => {
      this.dataUrl = fr.result as string;
      this.formGrp.get('pic').reset();
    };
    fr.readAsDataURL(this.userPic);
  }
  validatePhoneNumber(
    control: FormControl
  ): { [error: string]: boolean } | null {
    if (!control.value.match(/\+?\d[\d -]{8,12}\d/)) {
      return { invalidPhone: true };
    }
    return null;
  }
  onSubmit() {
    let formData = {
      name: this.getFormValue('name') as Name,
      fatherName: this.getFormValue('fatherName') as Name,
      motherName: this.getFormValue('motherName') as Name,
      dob: this.getFormValue('dob') as string,
      gender: this.getFormValue('gender') as string,
      phone: this.getFormValue('phone') as string,
      email: this.getFormValue('email') as string,
      pic: this.userPic,
    };
    this.formService.addData('step-1', formData);
    this.formService.userImageUrl.next(this.dataUrl);
    this.formService.page.next(1);
  }
}
