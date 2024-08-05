/**
 * Props for displaying a form error message.
 *
 * This interface defines the properties required to render an error message in a form.
 * The `error` property is a required string that contains the error message to be displayed,
 * while the optional `className` property allows for additional styling to be applied.
 *
 * @interface IFormErrorProps
 */
export interface IFormErrorProps {
  /**
   * The error message to be displayed.
   * This is a required field and should contain a string describing the error.
   *
   * @type {string}
   */
  error: string;

  /**
   * Optional additional CSS class(es) to apply to the error message element.
   * This allows for custom styling and is not required.
   *
   * @type {string}
   * @default undefined
   */
  className?: string;
}
