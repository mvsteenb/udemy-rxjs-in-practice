import {Observable} from "rxjs";

export function createHttpObservable(url : string) {
  return new Observable(observer => {

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, {signal})
      .then(response => {

        if (response.ok) {
          return response.json();                 // get json from response
        }
        else {
          observer.error('Request failed with status code: ' + response.status);
        }

      })
      .then(body => {
        observer.next(body);
        observer.complete();
      })
      .catch(err => {
        observer.error(err);
      })

    return () => controller.abort();
  });
}
