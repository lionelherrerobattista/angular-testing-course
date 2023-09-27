import { CalculatorService } from "./calculator.service";
import { TestBed } from "@angular/core/testing";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
  let calculator: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    
    // instantiate services
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]); // create fake implementation

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {
          provide: LoggerService,
          useValue: loggerSpy,
        },
      ],
    });

    calculator = TestBed.inject(CalculatorService);
  });

  it("should add two numbers", () => {

    // add numbers
    const result = calculator.add(2, 2);

    // check expected results - assertion
    expect(result).toBe(4);

    expect(loggerSpy.log).toHaveBeenCalledTimes(1); // check calls
  });

  it("should substract two numbers", () => {

    // add numbers
    const result = calculator.subtract(2, 2);

    // check expected results - assertion
    expect(result).toBe(0, "unexpected substraction result");

    expect(loggerSpy.log).toHaveBeenCalledTimes(1); // check calls
  });
});
