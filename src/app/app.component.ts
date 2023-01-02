import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private router: Router
  ) {}

  async ngOnInit() {
    this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 0);
      }
    });
  }
}
