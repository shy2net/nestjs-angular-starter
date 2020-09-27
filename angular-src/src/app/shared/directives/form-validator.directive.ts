import { validate, ValidationError } from 'class-validator';

import {
    AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output,
    SimpleChanges
} from '@angular/core';

/**
 * This directive simply updates all of the fields in the form according to the model validations
 * using class-validator (https://github.com/typestack/class-validator).
 * It follows the bootstrap standard to mark fields ans invalid or valid (https://getbootstrap.com/docs/4.0/components/forms/#validation).
 */
@Directive({
  selector: '[appFormValidator]',
})
export class FormValidatorDirective
  implements AfterViewInit, OnChanges, OnDestroy {
  /**
   * Called each time the form is completely valid or invalid.
   *
   * @type {EventEmitter<boolean>}
   * @memberof FormValidatorDirective
   */
  @Output() appFormValidatorIsFormValidChange: EventEmitter<
    boolean
  > = new EventEmitter<boolean>();

  @Input() appFormValidator: unknown;
  /**
   *Hides all of the form validation errors text.
   *
   * @memberof FormValidatorDirective
   */
  @Input() appFormValidatorHideErrorText = false;
  /**
   * Forces all fields to show valid or invalid even if the user hasn't changed the value.
   */
  @Input() appFormValidatorForce: boolean;
  private _isFormValid: boolean;
  private fieldsWritten: { [name: string]: boolean } = {}; // A dictionary containing data about fields already written
  private inputValueChangeEventFunc: (event) => void;

  get appFormValidatorIsFormValid(): boolean {
    return this._isFormValid;
  }

  private getValidationErrorFromFieldName(
    name: string,
    validationErrors: ValidationError[]
  ): ValidationError {
    let lastValidationError: ValidationError = null;

    // We split using '-' which represents a deeper property
    const split = name.split('-');

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const property = split.shift();

      if (lastValidationError)
        lastValidationError = lastValidationError.children.find(
          (v) => v.property === property
        );
      else
        lastValidationError = validationErrors.find(
          (v) => v.property === property
        );

      // If no validation error was found, return null
      if (!lastValidationError) return;

      // Update the last validation error

      // If it's the end of the field name, return the validation error
      if (split.length === 0) return lastValidationError;
    }
  }

  constructor(private elementRef: ElementRef<HTMLFormElement>) {
    this.inputValueChangeEventFunc = (event: Event) => {
      const el = event.target as HTMLInputElement;
      const name = el.name;

      if (name) {
        this.fieldsWritten[name] = true;
        this.updateForm();
      }
    };
  }

  ngAfterViewInit(): void {
    this.attachEventListeners();
    this.updateForm();
  }

  /**
   * Get all of the form group inputs, and listen to all of the input events.
   */
  attachEventListeners(): void {
    // Get all of the form group inputs
    this.getFormGroupInputs().forEach((input: HTMLInputElement) => {
      // Detect when a value was changed in one of the fields
      input.addEventListener('input', this.inputValueChangeEventFunc);

      // Add Description text field if not exists
      const next = input.nextElementSibling as HTMLElement;
      if (!next) {
        const div = document.createElement('div');
        div.className = 'input-description-validation';
        input.parentElement.appendChild(div);
      } else next.classList.add('input-description-validation');
    });
  }

  /**
   * Removes all of the form group input listeners.
   */
  detachEventListeners(): void {
    this.getFormGroupInputs().forEach((input: HTMLInputElement) => {
      input.removeEventListener('input', this.inputValueChangeEventFunc);
    });
  }

  /**
   * Removes the attached event listeners, and re-attaches to them.
   */
  reattachEventListeners(): void {
    this.detachEventListeners();
    this.attachEventListeners();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      'appFormValidator' in changes ||
      'appFormValidatorHideErrorText' in changes
    )
      this.updateForm();
  }

  /**
   * Updates a specific element state according to it's validation error.
   * @param el
   * @param error
   */
  updateFormField(el: HTMLInputElement, error?: ValidationError): void {
    const name = el.name;

    // Check if this fields has been written, if not don't update it's validation state until it is
    if (!this.appFormValidatorForce && !this.fieldsWritten[name]) return;
    el.classList.remove('is-valid', 'is-invalid');
    el.classList.add(error ? 'is-invalid' : 'is-valid');

    // If we don't want to show any validation error text
    if (this.appFormValidatorHideErrorText) return;
    const validationDesc = el.nextElementSibling;

    if (validationDesc) {
      validationDesc.classList.remove('invalid-feedback', 'valid-feedback');
      validationDesc.classList.add(
        error ? 'invalid-feedback' : 'valid-feedback'
      );
      validationDesc.innerHTML = null;

      if (error) {
        let errHTML = `<ul>`;
        for (const key of Object.keys(error.constraints)) {
          const constraint = error.constraints[key];
          errHTML += `<li>${constraint}</li>`;
        }

        errHTML += `</ul>`;
        validationDesc.innerHTML = errHTML;
      }
    }
  }

  /**
   * Goes through all of the form and checks for any issues, updates all of the fields accordingly.
   */
  updateForm(): Promise<boolean> {
    return validate(this.appFormValidator).then((validationErrors) => {
      const prevIsFormValid = this._isFormValid;
      this._isFormValid = true;

      this.getFormGroupInputs().forEach((input: HTMLInputElement) => {
        const name = input.name;
        const validationError = this.getValidationErrorFromFieldName(
          name,
          validationErrors
        );
        this.updateFormField(input, validationError);

        if (validationError) this._isFormValid = false;
      });

      if (prevIsFormValid !== this._isFormValid)
        this.appFormValidatorIsFormValidChange.emit(this._isFormValid);

      return this._isFormValid;
    });
  }

  /**
   * Returns all of the form groups found according to bootstrap standard.
   */
  getFormGroupInputs(): NodeListOf<Element> {
    const formElement = this.elementRef.nativeElement;
    return formElement.querySelectorAll('.form-group>input');
  }

  ngOnDestroy(): void {
    this.detachEventListeners();
  }
}
