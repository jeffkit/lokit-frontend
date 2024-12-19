import React from 'react'
import { JSONSchema7 } from 'json-schema'
import { FormField } from './FormField'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { TableArrayField } from './TableArrayField'

interface ArrayFieldProps {
  name: string;
  schema: JSONSchema7 & { 'x-display'?: string };
  value: any[];
  onChange: (value: any[]) => void;
  loadRefData: (refKey: string, value?: string) => Promise<any>;
}

export function ArrayField({ name, schema, value = [], onChange, loadRefData }: ArrayFieldProps) {
  if (schema['x-display'] === 'table') {
    return (
      <TableArrayField
        name={name}
        schema={schema}
        value={value}
        onChange={onChange}
        loadRefData={loadRefData}
      />
    );
  }

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
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {value.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-end mb-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      name={`${name}[${index}]`}
                      schema={schema.items as JSONSchema7}
                      value={item}
                      onChange={(value) => handleChange(index, value)}
                      loadRefData={loadRefData}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={handleAdd}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add {schema.title || name}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

