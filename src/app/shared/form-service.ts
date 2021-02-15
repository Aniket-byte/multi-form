import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Name {
  firstName: string;
  lastName: string;
}

export interface Address {
  line1: string;
  line2?: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Internship {
  company: string;
  yearOfWork: string;
  position: string;
  description: string;
}

export interface Project {
  name: string;
  mentor: string;
  members: number;
  description: string;
}

export interface FormData {
  'step-1': {
    name: Name;
    motherName: Name;
    fatherName: Name;
    gender: string;
    dob: string;
    email: string;
    phone: string;
    pic: File;
  };
  'step-2': {
    pAddress: Address;
    cAddress: Address;
  };
  'step-3': {
    projects: Project[];
    internships: Internship[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class FormService {
  page = new Subject<number>();
  formSubject = new BehaviorSubject<FormData>(null);
  userImageUrl = new BehaviorSubject<string>(null);
  userData: FormData = {
    'step-1': null,
    'step-2': null,
    'step-3': null,
  };
  constructor() {}
  addData(
    step: string,
    data: FormData['step-1'] | FormData['step-2'] | FormData['step-3']
  ) {
    this.userData[step] = data;
    this.formSubject.next(this.userData);
  }
}
