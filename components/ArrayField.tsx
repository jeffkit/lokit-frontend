import React from 'react'
import { JSONSchema7 } from 'json-schema'
import { FormField } from './FormField'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, X } from 'lucide-react'
import { Input } from "@/components/ui/input"

interface ArrayFieldProps {
  name: string
  schema: JSONSchema7
  value: any[]
  onChange: (value: any[]) => void
  refData: Record<string, any>
  loadRefData: (refKey: string, value?: string) => Promise<any>
}

export function ArrayField({ name, schema, value = [], onChange, refData, loadRefData }: ArrayFieldProps) {
  const handleAdd = () => {
    const newItem = schema.items && (schema.items as JSONSchema7).type === 'object' ? {} : ''
    onChange([...value, newItem])
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, itemValue: any) => {
    onChange(value.map((v, i) => i === index ? itemValue : v))
  }

  const isSimpleType = (schema.items as JSONSchema7).type !== 'object'

  return (
    <div className="mb-4">
      <Label>{schema.title || name}</Label>
      <Card>
        <CardContent className="pt-6">
          {isSimpleType ? (
            <div className="space-y-2">
              {value.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder={`Enter ${name} item`}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemove(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            value.map((item, index) => (
              <div key={index} className="mb-4 relative">
                <div className="flex flex-wrap -mx-2">
                  {schema.items && (schema.items as JSONSchema7).properties &&
                    Object.entries((schema.items as JSONSchema7).properties!).map(([fieldName, fieldSchema]) => (
                      <div key={fieldName} className="px-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-2">
                        <FormField
                          name={`${name}[${index}].${fieldName}`}
                          schema={fieldSchema as JSONSchema7}
                          value={item[fieldName]}
                          onChange={(fieldValue) => {
                            const newItem = { ...item, [fieldName]: fieldValue };
                            handleChange(index, newItem);
                          }}
                          refData={refData}
                          loadRefData={loadRefData}
                        />
                      </div>
                    ))
                  }
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRemove(index)} 
                  className="absolute top-0 right-0 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
          <Button 
            variant="outline" 
            onClick={handleAdd} 
            className="mt-2 w-full border-dashed"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add {schema.title || name}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

