import { ComponentFixture, TestBed, TestBedStatic, tick } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';

import { MockCoreModule } from './mock/core.module.mock';

/**
 * Returns the common test bed to be used across all of the project.
 * @param declarations
 * @param providers
 */
export function getCommonTestBed(
  declarations: unknown[],
  imports: unknown[] = [],
  providers: unknown[] = []
): TestBedStatic {
  const testBed = TestBed.configureTestingModule({
    declarations: [...declarations],
    imports: [MockCoreModule, SharedModule, ...imports],
    providers: [...providers],
  });

  return testBed;
}

/**
 * Returns the input validation related to the provided input element.
 * @param input
 */
export function getInputElementValidationDiv(input: HTMLInputElement): Element {
  return input.parentElement.querySelector('.input-description-validation');
}

export function setInputValueWithEvent(
  input: HTMLInputElement,
  value: string
): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

export function tickAndDetectChanges(fixture: ComponentFixture<unknown>): void {
  tick();
  fixture.detectChanges();
}
