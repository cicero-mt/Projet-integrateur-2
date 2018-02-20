import { TestBed, inject } from "@angular/core/testing";

import { InputValidationService } from "./input-validation.service";

describe('WordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputValidationService]
    });
  });

  it("should be created", inject([InputValidationService], (service: InputValidationService) => {
    expect(service).toBeTruthy();
  }));
});
