import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormData, FormService } from '../shared/form-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.css'],
})
export class DeclarationComponent implements OnInit, OnDestroy {
  aggreed: boolean = false;
  fdSubs: Subscription;
  uiSubs: Subscription;
  displayData: FormData;
  imageUrl: string;
  constructor(private formService: FormService) {}

  ngOnInit(): void {
    this.uiSubs = this.formService.userImageUrl.subscribe((data) => {
      if (data) {
        this.imageUrl = data;
      }
    });
    this.fdSubs = this.formService.formSubject.subscribe((data) => {
      if (data) {
        this.displayData = data;
      }
    });
  }
  onAggree() {
    this.aggreed = !this.aggreed;
  }
  getImageUrl(): string {
    return `url("${this.imageUrl}")`;
  }
  allDone(): boolean {
    if (this.displayData) {
      let allDone: boolean = true;
      let keys: string[] = Object.keys(this.displayData);
      for (let item of keys) {
        if (!this.displayData[item]) {
          allDone = false;
          break;
        }
      }
      return allDone;
    }
    return false;
  }
  ngOnDestroy(): void {
    this.uiSubs.unsubscribe();
    this.fdSubs.unsubscribe();
  }
}
