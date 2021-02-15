import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FormService } from './shared/form-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Multiple-forms';
  fsSubs: Subscription;
  tcSubs: Subscription;
  currentPage: number = 0;
  constructor(private formService: FormService) {}
  ngOnInit(): void {
    this.formService.page.subscribe((data) => {
      this.currentPage = data;
    });
  }
  tabChanged(event) {
    this.currentPage = event.index;
  }
  ngOnDestroy() {
    this.fsSubs.unsubscribe();
    this.tcSubs.unsubscribe();
  }
}
