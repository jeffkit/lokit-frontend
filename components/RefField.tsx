import React, { useState, useEffect } from 'react'
import { JSONSchema7 } from 'json-schema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'

interface RefFieldProps {
  name: string
  schema: JSONSchema7
  value: any
  onChange: (value: any) => void
  refData: Record<string, any>
  loadRefData: (refKey: string, value?: string) => Promise<any>
}

export function RefField({ name, schema, value, onChange, loadRefData }: RefFieldProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<{ value: string, label: string }[]>([])
  const refKey = schema.$ref?.split('/').pop() || ''
  const isMultiple = schema.type === 'array'

  useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true)
      const data = await loadRefData(refKey)
      if (data) {
        if (Array.isArray(data)) {
          setOptions(data.map(item => ({ value: item.id || item, label: formatLabel(item) })))
        } else if (data.enum) {
          setOptions(data.enum.map(item => ({ value: item, label: item })))
        }
      }
      setIsLoading(false)
    }
    loadOptions()
  }, [refKey, loadRefData])

  const formatLabel = (item: any) => {
    if (typeof item === 'string') return item
    return Object.entries(item)
      .filter(([key]) => key !== 'id')
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ')
  }

  const handleChange = (selectedValue: string) => {
    if (isMultiple) {
      const newValue = Array.isArray(value) ? value : []
      if (newValue.includes(selectedValue)) {
        onChange(newValue.filter(v => v !== selectedValue))
      } else {
        onChange([...newValue, selectedValue])
      }
    } else {
      onChange(selectedValue)
    }
  }

  const removeValue = (valueToRemove: string) => {
    onChange(value.filter((v: string) => v !== valueToRemove))
  }

  return (
    <div className="mb-4">
      <Label htmlFor={name}>{schema.title || name}</Label>
      {isMultiple && Array.isArray(value) && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((v: string) => (
            <Badge key={v} variant="secondary">
              {options.find(opt => opt.value === v)?.label || v}
              <button onClick={() => removeValue(v)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Select value={isMultiple ? undefined : value} onValueChange={handleChange}>
        <SelectTrigger id={name}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>Loading...</SelectItem>
          ) : (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

