import { ValidationError } from 'class-validator';

/**
 * Returns a textual presentation of ValidationErrors array detected with the class-validator library.
 * @param errors
 */
export function getFormValidationErrorText(
  errors: Array<ValidationError>
): string {
  let output = `Supplied form is invalid, please fix the following issues:\n`;
  errors
    .map((issue) => getTextualValidationError(issue))
    .forEach((issueStr) => (output += issueStr));

  return output;
}

/**
 * Returns a textual presentation of a validation error.
 * @param error
 */
export function getTextualValidationError(error: ValidationError): string {
  let output = `${error.property}:\n`;

  if (error.constraints) {
    Object.keys(error.constraints).forEach((constraint) => {
      output += '- ' + error.constraints[constraint] + '\n';
    });
  }

  if (error.children && error.children.length > 0) {
    for (const child of error.children)
      output += this.getTextualValidationError(child) + '\n';
  }

  return output;
}
