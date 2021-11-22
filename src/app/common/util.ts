import {Observable} from "rxjs";

export function createHttpObservable(url : string) {
  return new Observable(observer => {
    fetch(url)
      .then(response => {
        return response.json();                 // get json from response
      })
      .then(body => {
        observer.next(body);
        observer.complete();
      })
      .catch(err => {
        observer.error(err);
      })
  });
}
