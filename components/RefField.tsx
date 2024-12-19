import React, { useState, useEffect } from 'react'
import { ExtendedJSONSchema7 } from '@/app/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MultiSelectField } from './MultiSelectField'
import { ObjectField } from './ObjectField'

// 判断是否为简单枚举类型
function isSimpleEnumType(schema: ExtendedJSONSchema7 | null): boolean {
  return Boolean(
    schema?.enum && 
    ['string', 'number', 'boolean'].includes(schema.type as string)
  )
}

// 判断是否为原始值
function isPrimitiveValue(value: any): boolean {
  return ['string', 'number', 'boolean'].includes(typeof value)
}

// 根据schema类型转换值
function convertValueByType(value: string, type?: string | string[]): any {
  if (!type || Array.isArray(type)) return value
  
  switch (type) {
    case 'number':
      return Number(value)
    case 'boolean':
      return value === 'true'
    case 'string':
    default:
      return value
  }
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
  const [refSchema, setRefSchema] = useState<ExtendedJSONSchema7 | null>(null)
  const refKey = schema.$ref?.split('/').pop() || ''
  
  const isMultiSelect = schema.type === 'array' && schema['x-display'] === 'multiselect'
  const isValueType = schema['x-ref-type'] === 'value'

  useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true)
      try {
        const data = await loadRefData(refKey)
        if (data) {
          if (Array.isArray(data)) {
            setOptions(data)
            // 获取引用的schema定义
            const baseSchema = schema.items?.$ref 
              ? (schema.items as ExtendedJSONSchema7)
              : { type: 'object' }
            
            // 合并原始schema的元数据和从数据推断的属性
            setRefSchema({
              ...baseSchema,
              type: 'object',
              properties: Object.keys(data[0] || {}).reduce((acc, key) => ({
                ...acc,
                [key]: { type: typeof data[0][key] }
              }), {}),
              'x-primary-key': baseSchema['x-primary-key'] || 'id'  // 确保保留x-primary-key
            })
          } else if (data.enum) {
            setOptions(data.enum.map(item => ({
              id: item,
              name: item
            })))
            setRefSchema(data)
          } else {
            setRefSchema(data)
          }
        }
      } catch (error) {
        console.error('Error loading ref data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadOptions()
  }, [refKey, loadRefData, schema.items])

  // 添加调试日志
  useEffect(() => {
    console.log('Current refSchema:', refSchema)
    console.log('Current value:', value)
  }, [refSchema, value])

  if (isLoading) {
    return (
      <div className="mb-4">
        <Label>{schema.title || name}</Label>
        <div className="h-9 w-full rounded-md border border-input bg-muted animate-pulse" />
      </div>
    )
  }

  // 如果是值类型且有引用的schema，使用ObjectField
  if (isValueType && refSchema) {
    return (
      <ObjectField
        name={name}
        schema={{ ...refSchema, title: schema.title }}
        value={value}
        onChange={onChange}
        loadRefData={loadRefData}
      />
    )
  }

  if (isMultiSelect && options.length > 0) {
    const handleMultiSelectChange = (selectedValues: any[]) => {
      console.log('MultiSelect change:', {
        isValueType,
        refSchema,
        selectedValues
      })
      
      // 如果不是值类型，只返回主键数组
      if (!isValueType && refSchema?.['x-primary-key']) {
        const primaryKey = refSchema['x-primary-key']
        const primaryKeyValues = selectedValues
          .filter(v => v != null) // 过滤掉 null 和 undefined
          .map(v => {
            // 如果已经是原始类型值，直接返回
            if (isPrimitiveValue(v)) return v
            // 否则尝试获取对象的主键值
            return v[primaryKey]
          })
          .filter(Boolean) // 过滤掉无效值
        console.log('Returning primary keys:', primaryKeyValues)
        onChange(primaryKeyValues)
      } else {
        console.log('Returning full values:', selectedValues)
        onChange(selectedValues)
      }
    }

    return (
      <MultiSelectField
        title={schema.title || name}
        value={value || []}
        options={options}
        onChange={handleMultiSelectChange}
        isSimpleType={isSimpleEnumType(refSchema)}
        searchPlaceholder={`Search ${schema.title || name}...`}
      />
    )
  }

  const handleChange = (selectedValue: string) => {
    // 如果是简单枚举类型，直接返回值
    if (isSimpleEnumType(refSchema)) {
      // 根据schema中定义的类型转换值
      onChange(convertValueByType(selectedValue, refSchema?.type))
    } else {
      const selectedOption = options.find(opt => opt.id === selectedValue)
      // 如果不是值类型，只返回主键
      if (!isValueType && refSchema?.['x-primary-key']) {
        onChange(selectedOption[refSchema['x-primary-key']])
      } else {
        onChange(selectedOption)
      }
    }
  }

  // 获取当前值对应的选项ID
  const getCurrentValue = () => {
    if (isSimpleEnumType(refSchema)) return String(value ?? '')
    if (!isValueType && refSchema?.['x-primary-key']) return String(value ?? '')
    return value?.id || value || ''
  }

  return (
    <div className="mb-4">
      <Label>{schema.title || name}</Label>
      <Select value={getCurrentValue()} onValueChange={handleChange}>
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

