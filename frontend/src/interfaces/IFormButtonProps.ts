/**
 * Props for customizing a form button component.
 *
 * This interface defines the properties that can be used to configure and style a button in a form.
 * The `type` property determines the button's behavior (e.g., submit or reset), while `color` and `fill`
 * control its appearance. The optional `className` allows for additional styling, and `disabled`
 * specifies whether the button is interactive. The `onClick` function handles click events, and
 * `children` represents the content displayed within the button.
 *
 * @interface IFormButtonProps
 */
export interface IFormButtonProps {
  /**
   * The type of the button, which determines its behavior in a form.
   *
   * @type {"button" | "submit" | "reset"}
   * @default "button"
   */
  type?: "button" | "submit" | "reset";

  /**
   * The color of the button, specified as a string.
   * This property allows for custom color styling.
   *
   * @type {string}
   * @default undefined
   */
  color?: string;

  /**
   * The fill style of the button, which affects its appearance.
   * Possible values are "clear", "outline", or "solid".
   *
   * @type {"clear" | "outline" | "solid"}
   * @default "solid"
   */
  fill?: "clear" | "outline" | "solid";

  /**
   * Optional additional CSS class(es) to apply to the button element.
   * This allows for custom styling and is not required.
   *
   * @type {string}
   * @default undefined
   */
  className?: string;

  /**
   * Determines whether the button is interactive or not.
   * When true, the button is disabled and cannot be clicked.
   *
   * @type {boolean}
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional function to handle click events on the button.
   * This is triggered when the button is clicked.
   *
   * @type {() => void}
   * @default undefined
   */
  onClick?: () => void;

  /**
   * The content displayed within the button.
   * This is a required property and should be a React node (e.g., text, icons).
   *
   * @type {React.ReactNode}
   */
  children: React.ReactNode;

  showSpinner?: boolean; // Add this line
}
