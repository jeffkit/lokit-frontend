import React, { useState, useEffect } from 'react'
import { JSONSchema7 } from 'json-schema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface RefFieldProps {
  name: string
  schema: JSONSchema7
  value: any
  onChange: (value: any) => void
  loadRefData: (refKey: string, value?: string) => Promise<any>
}

export function RefField({ name, schema, value, onChange, loadRefData }: RefFieldProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<any[]>([])
  const refKey = schema.$ref?.split('/').pop() || ''

  useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true)
      try {
        const data = await loadRefData(refKey)
        if (data) {
          if (Array.isArray(data)) {
            setOptions(data)
          } else if (data.enum) {
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
          {isLoading ? (
            <SelectItem value="loading" disabled>Loading...</SelectItem>
          ) : (
            options.map(option => (
              <SelectItem key={option.id} value={option.id}>
                {option.name || `${option.street}, ${option.city}`}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

