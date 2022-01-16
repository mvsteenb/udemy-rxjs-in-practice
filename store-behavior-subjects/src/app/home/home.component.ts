import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {Observable} from 'rxjs';
import {Store} from "../common/store.service";


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    constructor(private store: Store) {
    }

    ngOnInit() {
      this.beginnerCourses$ = this.store.selectBeginnerCourses();
      this.advancedCourses$ = this.store.selectAdvancedCourses();
    }

}
