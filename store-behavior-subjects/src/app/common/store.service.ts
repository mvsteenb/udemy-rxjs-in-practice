import {Injectable} from "@angular/core";
import {Course} from "../model/course";
import {BehaviorSubject, Observable} from "rxjs";
import {filter, map, tap} from "rxjs/operators";
import {createHttpObservable} from "./util";
import {fromPromise} from "rxjs/internal-compatibility";

@Injectable({
  providedIn: 'root'
})
export class Store {

  private subject = new BehaviorSubject<Course[]>([]); // late subscribers also get the latest version

  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable('/api/courses');
    http$
      .pipe(
        tap(() => console.log('HTTP request executed')),
        map(res => Object.values(res['payload']) ),
        tap(courses => console.log('courses: ', courses)),
      ).subscribe(
        courses => this.subject.next(courses)
      );
  }

  selectBeginnerCourses(): Observable<Course[]> {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses(): Observable<Course[]> {
    return this.filterByCategory('ADVANCED');
  }

  selectCourseById(id: number): Observable<Course> {
    console.log('select course by id', id);
    return this.courses$
      .pipe(
        map(courses => courses.find(course => course.id == id)),
        filter(course => !!course)   // filter out undefined results !
      );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category === category))
      );
  }

  saveCourse(courseId: number, changes): Observable<any> {

    // update in-memory store
    const courses = this.subject.getValue();
    const courseIdx = courses.findIndex(course => course.id === courseId);

    const newCourses = courses.slice(0);
    newCourses[courseIdx] = {
      ...courses[courseIdx],
      ...changes
    };

    this.subject.next(newCourses);

    return fromPromise(fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application-json'
      }
    }));
  }

}
