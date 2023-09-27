import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Examples", () => {
  it("Asynchronous test example with Jasmine done()", (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      test = true;

      expect(test).toBeTruthy();

      done();
    }, 1000);
  });

  it("Asynchronous test example - setTimout()", fakeAsync(() => {
    // fake async runs code inside a zone
    // waits for the timout to complete

    let test = false;

    setTimeout(() => {});

    setTimeout(() => {
      test = true;
    }, 1000);

    // complete all timeouts
    flush();

    // we can add assertion at the end
    expect(test).toBeTruthy();
  }));

  it("Asynchronous test example - plain Promise", fakeAsync(() => {
    let test = false;

    console.log("Creating Promise.");

    Promise.resolve()
      .then(() => {
        console.log("Promise first then() evaluated successfully");
        return Promise.resolve();
      })
      .then(() => {
        console.log("Promise second then() evaluated successfully");
        test = true;
      });

    flushMicrotasks();

    console.log("Running test assertions");

    expect(test).toBeTruthy();
  }));

  it("Asynchronous test example - Promises + setTimout()", fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    flushMicrotasks(); // resolve promise

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(11);
  }));

  it("Asynchronous test example - Observables", fakeAsync(() => {
    let test = false;

    console.log("Creating observable");

    const test$ = of(test).pipe(delay(1000)); // create observable, delay to make asynchronous

    test$.subscribe(() => {
        test = true;
    }); // execute observable

    tick(1000);

    console.log("Running test assertions");

    expect(test).toBe(true);
  }));
});
