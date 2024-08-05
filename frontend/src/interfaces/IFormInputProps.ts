/**
 * Props for configuring a custom input component.
 *
 * This interface defines the properties required to render a form input field with customizable behavior
 * and styling. It includes properties for the input's name, type, placeholder, and value. Optional
 * properties include `readonly` to specify if the input is read-only, and custom event handlers for
 * handling changes and blur events.
 *
 * @interface IFormInputProps
 */
export interface IFormInputProps {
  /**
   * The name of the input field.
   * This is used to identify the input in forms and should be a string.
   *
   * @type {string}
   */
  name: string;

  /**
   * The type of the input field.
   * This defines the kind of data the input will accept (e.g., "text", "password").
   *
   * @type {string}
   */
  type: string;

  /**
   * The placeholder text for the input field.
   * This text is displayed when the input is empty and serves as a hint to the user.
   *
   * @type {string}
   */
  placeholder: string;

  /**
   * The current value of the input field.
   * This represents the data entered by the user and is controlled by the parent component.
   *
   * @type {string}
   */
  value: string;

  /**
   * Optional flag indicating whether the input is read-only.
   * When true, the input cannot be modified by the user.
   *
   * @type {boolean}
   * @default false
   */
  readonly?: boolean;

  /**
   * Event handler for handling change events on the input field.
   * This function receives a `CustomEvent` object, which is specific to the input component used.
   *
   * @param {CustomEvent} e - The custom event triggered by the input change.
   * @type {(e: CustomEvent) => void}
   */
  onChange: (e: CustomEvent) => void;

  /**
   * Event handler for handling blur events on the input field.
   * This function receives a `CustomEvent` object, which is specific to the input component used.
   *
   * @param {CustomEvent} e - The custom event triggered when the input loses focus.
   * @type {(e: CustomEvent) => void}
   */
  onBlur: (e: CustomEvent) => void;

  /**
   * Optional error message to be displayed for the input field.
   * This can be used to show validation errors or other messages.
   *
   * @type {string}
   * @default undefined
   */
  // error?: string;
}
