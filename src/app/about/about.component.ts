import {Component, OnInit} from '@angular/core';
import {noop, of} from "rxjs";
import {createHttpObservable} from "../common/util";
import {map} from "rxjs/operators";

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    const source1$ = of(1, 2, 3);
    const source2$ = of (4, 5, 6);



  }

}
