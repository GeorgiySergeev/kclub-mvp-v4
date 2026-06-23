/**
 * Form inputs for light-background contexts (newsletter, contact forms).
 * TextInput: labelled text field with red focus ring.
 * Checkbox: styled checkbox with label for privacy/consent.
 *
 * @example
 * <TextInput label="Name and Surname" placeholder="John Doe" />
 * <TextInput label="E-mail" type="email" placeholder="john@company.com" />
 * <Checkbox label="I agree to the Privacy Policy and Terms and Conditions" />
 */
export interface TextInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  style?: React.CSSProperties;
}

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
