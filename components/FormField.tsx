import React from 'react'
import { JSONSchema7 } from 'json-schema'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ObjectField } from './ObjectField'
import { ArrayField } from './ArrayField'
import { RefField } from './RefField'

interface FormFieldProps {
  name: string
  schema: JSONSchema7
  value: any
  onChange: (value: any) => void
  loadRefData: (refKey: string, value?: string) => Promise<any>
}

export function FormField({ name, schema, value, onChange, loadRefData }: FormFieldProps) {
  console.log('FormField processing:', name, schema)
  
  if (schema.$ref || (schema.items && (schema.items as JSONSchema7).$ref)) {
    console.log('Using RefField for:', name)
    const refSchema = {
      ...schema,
      $ref: schema.$ref || (schema.items as JSONSchema7).$ref
    }
    return <RefField name={name} schema={refSchema} value={value} onChange={onChange} loadRefData={loadRefData} />
  }

  switch (schema.type) {
    case 'string':
      return (
        <div className="mb-4">
          <Label htmlFor={name}>{schema.title || name}</Label>
          <Input
            type="text"
            id={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.description}
          />
        </div>
      )
    case 'number':
    case 'integer':
      return (
        <div className="mb-4">
          <Label htmlFor={name}>{schema.title || name}</Label>
          <Input
            type="number"
            id={name}
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={schema.description}
          />
        </div>
      )
    case 'boolean':
      return (
        <div className="flex items-center mb-4">
          <Checkbox
            id={name}
            checked={value || false}
            onCheckedChange={(checked) => onChange(checked)}
          />
          <Label htmlFor={name} className="ml-2">{schema.title || name}</Label>
        </div>
      )
    case 'object':
      return <ObjectField name={name} schema={schema} value={value} onChange={onChange} loadRefData={loadRefData} />
    case 'array':
      return <ArrayField name={name} schema={schema} value={value} onChange={onChange} loadRefData={loadRefData} />
    default:
      return null
  }
}

