import {Component, OnInit} from '@angular/core';
import {createHttpObservable} from "../common/util";
import {catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap} from "rxjs/operators";
import {noop, Observable, of, throwError, timer} from "rxjs";
import {Course} from "../model/course";
import {LESSONS} from "../../../server/db-data";


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnersCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    constructor() {

    }

    ngOnInit() {

      const http$ = createHttpObservable('api/courses');
      const courses$ = http$
        .pipe(
          tap(() => console.log('HTTP request executed !')),
          map( (res: Course[]) => Object.values(res["payload"])),
          shareReplay(),
          retryWhen(errors => errors.pipe(
            delayWhen(() => timer(2000))
          ))
        );

      this.beginnersCourses$ = courses$
        .pipe(
          map((courses:Course[]) => courses.filter(course => course.category == 'BEGINNER'))
        );

      this.advancedCourses$ = courses$
        .pipe(
          map((courses:Course[]) => courses.filter(course => course.category == 'ADVANCED'))
        );

    }

}
