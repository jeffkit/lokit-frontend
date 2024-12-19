import React from 'react'
import { JSONSchema7 } from 'json-schema'
import { FormField } from './FormField'
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface ObjectFieldProps {
  name: string
  schema: JSONSchema7
  value: any
  onChange: (value: any) => void
  loadRefData: (refKey: string, value?: string) => Promise<any>
}

export function ObjectField({ name, schema, value, onChange, loadRefData }: ObjectFieldProps) {
  const handleChange = (fieldName: string, fieldValue: any) => {
    onChange({
      ...value,
      [fieldName]: fieldValue
    })
  }

  return (
    <div className="mb-4">
      <Label>{schema.title || name}</Label>
      <Card>
        <CardContent className="pt-6">
          {schema.properties && Object.entries(schema.properties).map(([fieldName, fieldSchema]) => (
            <FormField
              key={fieldName}
              name={fieldName}
              schema={fieldSchema as JSONSchema7}
              value={value?.[fieldName]}
              onChange={(fieldValue) => handleChange(fieldName, fieldValue)}
              loadRefData={loadRefData}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

