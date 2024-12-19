import React, { useState, useEffect } from 'react'
import { JSONSchema7 } from 'json-schema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MultiSelectField } from './MultiSelectField'

interface ExtendedJSONSchema7 extends JSONSchema7 {
  'x-display'?: 'table' | 'multiselect';
}

interface RefFieldProps {
  name: string
  schema: ExtendedJSONSchema7
  value: any
  onChange: (value: any) => void
  loadRefData: (refKey: string, value?: string) => Promise<any>
}

export function RefField({ name, schema, value, onChange, loadRefData }: RefFieldProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<any[]>([])
  const refKey = schema.$ref?.split('/').pop() || ''
  
  const isMultiSelect = schema.type === 'array' && schema['x-display'] === 'multiselect'

  useEffect(() => {
    const loadOptions = async () => {
      console.log('Loading options for:', refKey)
      setIsLoading(true)
      try {
        const data = await loadRefData(refKey)
        console.log('Loaded data:', data)
        if (data) {
          if (Array.isArray(data)) {
            console.log('Setting array data as options')
            setOptions(data)
          } else if (data.enum) {
            console.log('Setting enum data as options')
            setOptions(data.enum.map(item => ({
              id: item,
              name: item
            })))
          }
        }
      } catch (error) {
        console.error('Error loading ref data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadOptions()
  }, [refKey, loadRefData])

  console.log('Schema:', schema)
  console.log('Items $ref:', schema.items && (schema.items as JSONSchema7).$ref)
  console.log('Is MultiSelect:', isMultiSelect)
  console.log('Options:', options)
  console.log('Loading:', isLoading)

  if (isLoading) {
    return (
      <div className="mb-4">
        <Label>{schema.title || name}</Label>
        <div className="h-9 w-full rounded-md border border-input bg-muted animate-pulse" />
      </div>
    )
  }

  if (isMultiSelect && options.length > 0) {
    console.log('Rendering MultiSelectField with options:', options)
    return (
      <MultiSelectField
        title={schema.title || name}
        value={value || []}
        options={options}
        onChange={onChange}
        isSimpleType={refKey === 'color'}
        searchPlaceholder={`Search ${schema.title || name}...`}
      />
    )
  }

  if (isMultiSelect) {
    console.log('MultiSelect but no options yet')
    return (
      <div className="mb-4">
        <Label>{schema.title || name}</Label>
        <div className="h-9 w-full rounded-md border border-input bg-muted animate-pulse" />
      </div>
    )
  }

  const handleChange = (selectedValue: string) => {
    if (refKey === 'color') {
      onChange(selectedValue)
    } else {
      const selectedOption = options.find(opt => opt.id === selectedValue)
      onChange(selectedOption || selectedValue)
    }
  }

  return (
    <div className="mb-4">
      <Label>{schema.title || name}</Label>
      <Select value={value?.id || value || ''} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${schema.title || name}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.id} value={option.id}>
              {option.name || `${option.street}, ${option.city}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

