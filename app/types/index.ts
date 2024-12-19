import { JSONSchema7 } from 'json-schema';

export type FormDataType = Record<string, unknown>;

export interface ExtendedJSONSchema7 extends JSONSchema7 {
  'x-display'?: 'table' | 'multiselect';
  'x-primary-key'?: string;
  'x-ref-type'?: 'reference' | 'value';
}

export interface FieldProps {
  name: string;
  schema: ExtendedJSONSchema7;
  value: any;
  onChange: (name: string, value: any) => void;
  loadRefData: (refKey: string, value?: string) => Promise<any>;
}

export type FormSubmitHandler = (data: FormDataType) => void; 