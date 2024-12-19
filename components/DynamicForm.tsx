import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { JSONSchema7 } from 'json-schema'
import { FormField } from './FormField'

interface DynamicFormProps {
  schema: JSONSchema7
  onSubmit: (data: any) => void
  loadRefData: (refKey: string, value?: string) => Promise<any>
}

export function DynamicForm({ schema, onSubmit, loadRefData }: DynamicFormProps) {
  const [formData, setFormData] = useState<any>({})

  const handleChange = (name: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{schema.title || 'Dynamic Form'}</CardTitle>
        <CardDescription>{schema.description || 'Please fill out the form'}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {schema.type === 'object' && schema.properties && Object.entries(schema.properties).map(([name, property]) => (
            <FormField
              key={name}
              name={name}
              schema={property as JSONSchema7}
              value={formData[name]}
              onChange={(value) => handleChange(name, value)}
              refData={{}}
              loadRefData={loadRefData}
            />
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit">Submit</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

