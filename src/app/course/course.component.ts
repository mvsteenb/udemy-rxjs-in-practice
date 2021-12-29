import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from "../common/util";
import { searchLessons } from '../../../server/search-lessons.route';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.courseId = this.route.snapshot.params['id'];
        this.course$ = createHttpObservable(`api/courses/${this.courseId}`) as Observable<Course>;
    }

    ngAfterViewInit() {

      const initialLessons$ = this.loadLessons();

      const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
          map(event => event.target.value),
          debounceTime(400),
          distinctUntilChanged(),
          //concatMap(search => this.loadLessons(search)) // does not cancel previous HTTP request !!!
          switchMap(search => this.loadLessons(search))
        );

      this.lessons$ = concat(initialLessons$, searchLessons$)
    }

    loadLessons(search= '') : Observable<Lesson[]> {
      return createHttpObservable(`api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
          map(res => res["payload"])
        );
    }

}
