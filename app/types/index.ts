import { JSONSchema7 } from 'json-schema';

export type FormDataType = Record<string, unknown>;

export interface FieldProps {
  name: string;
  schema: JSONSchema7;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
  loadRefData: (refKey: string, value?: string) => Promise<unknown>;
}

export type FormSubmitHandler = (data: FormDataType) => void; 