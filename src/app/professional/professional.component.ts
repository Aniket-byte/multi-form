import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { Project, Internship, FormService } from '../shared/form-service';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    group: FormGroupDirective | null
  ): boolean {
    return (
      (control.touched && control.hasError('required')) ||
      (control.touched && control.hasError('max')) ||
      (control.touched && control.hasError('maxlength'))
    );
  }
}

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.css'],
})
export class ProfessionalComponent implements OnInit {
  formGrp: FormGroup;
  formGrp2: FormGroup;
  internships: Internship[] = [];
  projects: Project[] = [];
  matcher = new CustomErrorStateMatcher();
  constructor(private formService: FormService) {}
  ngOnInit(): void {
    this.formGrp = new FormGroup({
      internship: new FormGroup({
        company: new FormControl('', [Validators.required]),
        yoe: new FormControl('', [Validators.required, Validators.max(12)]),
        position: new FormControl('', [Validators.required]),
        desc: new FormControl('', [
          Validators.required,
          Validators.maxLength(250),
        ]),
      }),
    });
    this.formGrp2 = new FormGroup({
      project: new FormGroup({
        name: new FormControl('', [Validators.required]),
        mentor: new FormControl('', [Validators.required]),
        members: new FormControl('', [Validators.required, Validators.max(10)]),
        desc: new FormControl('', [
          Validators.required,
          Validators.maxLength(250),
        ]),
      }),
    });
  }
  getFormData(control: string): Internship | Project {
    switch (control) {
      case 'internship': {
        return {
          company: this.formGrp.get(control + '.company').value,
          yearOfWork: this.formGrp.get(control + '.yoe').value,
          position: this.formGrp.get(control + '.position').value,
          description: this.formGrp.get(control + '.desc').value,
        };
      }
      case 'project': {
        return {
          name: this.formGrp2.get(control + '.name').value,
          mentor: this.formGrp2.get(control + '.mentor').value,
          members: +this.formGrp2.get(control + '.members').value,
          description: this.formGrp2.get(control + '.desc').value,
        };
      }
    }
  }
  onDelete(arrayName: 'projects' | 'internships', index: number): void {
    switch (arrayName) {
      case 'projects': {
        this.projects.splice(index, 1);
        break;
      }
      case 'internships': {
        this.internships.splice(index, 1);
        break;
      }
    }
  }
  onSave() {
    this.formService.addData('step-3', {
      projects: this.projects,
      internships: this.internships,
    });
    this.formService.page.next(3);
  }
  onSubmit(type: string) {
    switch (type) {
      case 'internship': {
        this.internships.push(this.getFormData(type) as Internship);
        this.formGrp.get(type).reset();
        break;
      }
      case 'project': {
        this.projects.push(this.getFormData(type) as Project);
        this.formGrp2.get(type).reset();
        break;
      }
    }
  }
}
