import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X, Plus, Check } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Option {
  [key: string]: any
}

interface MultiSelectFieldProps<T = any> {
  title: string
  value: T[]
  options: Option[]
  onChange: (value: T[]) => void
  isSimpleType?: boolean
  searchPlaceholder?: string
  displayKey?: string
  valueKey?: string
}

export function MultiSelectField<T = any>({
  title,
  value = [],
  options,
  onChange,
  isSimpleType = false,
  searchPlaceholder = "Search...",
  displayKey = 'name',
  valueKey = 'id'
}: MultiSelectFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // 确保 value 是数组
  const valueArray = Array.isArray(value) ? value : []

  // 获取选项的显示值
  const getDisplayValue = (option: Option) => {
    return option[displayKey] || option[valueKey] || String(option)
  }

  // 获取选项的标识值
  const getValueKey = (option: Option) => {
    return option[valueKey] || option
  }

  // 获取当前选中项的标识值集合
  const selectedIds = new Set(
    valueArray.map(v => {
      if (v === null || v === undefined) return ''
      return typeof v === 'object' ? getValueKey(v) : v
    }).filter(Boolean)
  )

  // 过滤选项
  const filteredOptions = options.filter(option => {
    if (!searchTerm) return true
    const searchString = searchTerm.toLowerCase()
    const displayValue = getDisplayValue(option).toLowerCase()
    const keyValue = String(getValueKey(option)).toLowerCase()
    return displayValue.includes(searchString) || keyValue.includes(searchString)
  })

  // 处理选择/取消选择
  const toggleOption = (option: Option) => {
    const optionKey = getValueKey(option)
    if (selectedIds.has(optionKey)) {
      // 移除选项
      const newValue = valueArray.filter(v => {
        if (v === null || v === undefined) return false
        return typeof v === 'object' 
          ? getValueKey(v) !== optionKey 
          : v !== optionKey
      })
      onChange(newValue as T[])
    } else {
      // 添加选项
      const itemToAdd = isSimpleType ? optionKey : option
      onChange([...valueArray, itemToAdd] as T[])
    }
  }

  // 删除已选项
  const handleRemove = (item: T) => {
    if (item === null || item === undefined) return
    const itemKey = typeof item === 'object' ? getValueKey(item) : item
    const newValue = valueArray.filter(v => {
      if (v === null || v === undefined) return false
      return typeof v === 'object' 
        ? getValueKey(v) !== itemKey
        : v !== itemKey
    })
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <Label>{title}</Label>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="min-h-[2.5rem] w-full rounded-md border border-input bg-transparent px-3 py-2 cursor-pointer hover:bg-accent/50">
            <div className="flex flex-wrap gap-2">
              {valueArray.length > 0 ? (
                valueArray.map((item) => (
                  <Badge
                    key={typeof item === 'object' ? getValueKey(item) : String(item)}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {typeof item === 'object' ? getDisplayValue(item) : String(item)}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item);
                      }}
                      className="hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">Select {title}...</span>
              )}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select {title}</DialogTitle>
            <DialogDescription>
              Choose one or more {title.toLowerCase()} from the list below.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex items-center border rounded-md px-3">
              <input
                className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={`Search ${title}`}
              />
            </div>
            <div className="mt-2 max-h-[300px] overflow-y-auto rounded-md border">
              {filteredOptions.map(option => (
                <div
                  key={getValueKey(option)}
                  onClick={() => toggleOption(option)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent",
                    selectedIds.has(getValueKey(option)) && "bg-accent"
                  )}
                >
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border",
                    selectedIds.has(getValueKey(option)) 
                      ? "bg-primary border-primary" 
                      : "border-primary"
                  )}>
                    {selectedIds.has(getValueKey(option)) && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <span>{getDisplayValue(option)}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 