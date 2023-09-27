import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "../services/courses.service";
import { HttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );
  const advancedCourses = setupCourses().filter(
    (course) => course.category == "ADVANCED"
  );

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    // set return value for the mock service
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses)); // use for observable

    fixture.detectChanges(); // trigger change detection

    const tabs = el.queryAll(By.css(".mdc-tab")); // check label of the tabs

    expect(tabs.length).toBe(1, "Unexpected number of tabs found"); // should be only one for beginner courses
  });

  it("should display only advanced courses", () => {
    // set return value for the mock service
    coursesService.findAllCourses.and.returnValue(of(advancedCourses)); // use for observable

    fixture.detectChanges(); // trigger change detection

    const tabs = el.queryAll(By.css(".mdc-tab")); // check label of the tabs

    expect(tabs.length).toBe(1, "Unexpected number of tabs found"); // should be only one for beginner courses
  });

  it("should display both tabs", () => {
    // set return value for the mock service
    coursesService.findAllCourses.and.returnValue(of(setupCourses())); // use for observable

    fixture.detectChanges(); // trigger change detection

    const tabs = el.queryAll(By.css(".mdc-tab")); // check label of the tabs

    expect(tabs.length).toBe(2, "Expected to find 2 tests"); // should be only one for beginner courses
  });

  it("should display advanced courses when tab clicked", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses())); // use for observable

    fixture.detectChanges(); // trigger change detection

    const tabs = el.queryAll(By.css(".mdc-tab")); // check label of the tabs

    // simulate click by the user
    click(tabs[1]);

    fixture.detectChanges(); // trigger change detection

    flush(); // empty the tasks queue

    const cardTitles = el.queryAll(
      By.css(".mat-mdc-tab-body-active .mat-mdc-card-title")
    ); // look active tab

    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles"); // check element

    expect(cardTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course"
    ); // check first title
  }));

  it("should display advanced courses when tab clicked - waitForAsync", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses())); // use for observable

    fixture.detectChanges(); // trigger change detection

    const tabs = el.queryAll(By.css(".mdc-tab")); // check label of the tabs

    // simulate click by the user
    click(tabs[1]);

    fixture.detectChanges(); // trigger change detection

    fixture.whenStable().then(() => {
      console.log("When stable() ");
      const cardTitles = el.queryAll(
        By.css(".mat-mdc-tab-body-active .mat-mdc-card-title")
      ); // look active tab
  
      expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles"); // check element
  
      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      ); // check first title
    }); // check callback
  }));

  //   mat-tab-body-active  => .mat-mdc-tab-body-active

  // mat-card-title  => .mat-mdc-card-title
});
