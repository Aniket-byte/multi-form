import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';

class PincodeErrorState implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    group: FormGroupDirective | null
  ): boolean {
    return (
      (control.touched && control.hasError('required')) ||
      (control.touched && control.hasError('invalidPin'))
    );
  }
}

import { FormService, FormData, Address } from '../shared/form-service';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit, OnDestroy {
  formGrp: FormGroup;
  sameAddress: boolean = false;
  formSubs: Subscription;
  matcher;
  constructor(private formService: FormService) {}

  ngOnInit(): void {
    this.matcher = new PincodeErrorState();
    this.formGrp = new FormGroup({
      pAddress: new FormGroup({
        line1: new FormControl('', [Validators.required]),
        line2: new FormControl('', []),
        area: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        pincode: new FormControl('', [
          Validators.required,
          this.validatePincode,
        ]),
      }),
      cAddress: new FormGroup({
        line1: new FormControl('', [Validators.required]),
        line2: new FormControl('', []),
        area: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        pincode: new FormControl('', [
          Validators.required,
          this.validatePincode,
        ]),
      }),
    });
  }
  validatePincode(control: FormControl): { [error: string]: boolean } | null {
    if (control.value) {
      if (!control.value.match(/^[1-9][0-9]{5}$/)) {
        return { invalidPin: true };
      }
    }
    return null;
  }
  onClick() {
    this.sameAddress = !this.sameAddress;
    if (this.sameAddress) {
      this.formGrp.get('pAddress').setValue(this.formGrp.get('cAddress').value);
      this.formSubs = this.formGrp
        .get('cAddress')
        .valueChanges.subscribe((value) => {
          this.formGrp.get('pAddress').setValue(value);
        });
    } else {
      this.formGrp.get('pAddress').reset();
      this.formSubs.unsubscribe();
    }
  }
  getFormData(control: string): Address {
    return {
      line1: this.formGrp.get(control + '.line1').value,
      line2: this.formGrp.get(control + '.line2').value,
      area: this.formGrp.get(control + '.area').value,
      city: this.formGrp.get(control + '.city').value,
      state: this.formGrp.get(control + '.state').value,
      pincode: this.formGrp.get(control + '.pincode').value,
    };
  }
  onSubmit() {
    let formData = {
      cAddress: this.getFormData('cAddress') as Address,
      pAddress: this.getFormData('pAddress') as Address,
    };
    this.formService.addData('step-2', formData as FormData['step-2']);
    this.formService.page.next(2);
  }
  ngOnDestroy() {
    this.formSubs.unsubscribe();
  }
}
