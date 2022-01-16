import {Component, OnInit} from '@angular/core';
import {AsyncSubject, ReplaySubject} from 'rxjs';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {

      const subject = new ReplaySubject();

      const series1$ = subject.asObservable();
      series1$.subscribe(val => console.log('first subscription: ', val));

      subject.next(1);
      subject.next(2);
      subject.next(3);
      subject.complete();

      setTimeout(() => {
        series1$.subscribe(val => console.log('late subscription', val));
      }, 3000);

    }


}






