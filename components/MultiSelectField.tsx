import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X, Plus, Check } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Option {
  id: string
  name: string
  [key: string]: any
}

interface MultiSelectFieldProps {
  title: string
  value: Option[] | string[]
  options: Option[]
  onChange: (value: Option[] | string[]) => void
  isSimpleType?: boolean
  searchPlaceholder?: string
}

export function MultiSelectField({
  title,
  value = [],
  options,
  onChange,
  isSimpleType = false,
  searchPlaceholder = "Search..."
}: MultiSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // 确保 value 是数组
  const valueArray = Array.isArray(value) ? value : []

  // 获取当前选中项的 ID 集合
  const selectedIds = new Set(
    valueArray.map(v => {
      if (v === null || v === undefined) return ''
      return typeof v === 'string' ? v : v.id
    }).filter(Boolean)
  )

  // 获取要显示的选中项
  const selectedItems = valueArray.map(v => {
    if (v === null || v === undefined) return null
    if (typeof v === 'string') {
      const option = options.find(opt => opt.id === v)
      return option || { id: v, name: v }
    }
    return v
  }).filter(Boolean)

  // 过滤选项
  const filteredOptions = options.filter(option => {
    if (!searchTerm) return true
    const searchString = searchTerm.toLowerCase()
    const nameMatch = option.name.toLowerCase().includes(searchString)
    const idMatch = option.id.toLowerCase().includes(searchString)
    return nameMatch || idMatch
  })

  // 处理选择/取消选择
  const toggleOption = (option: Option) => {
    const optionId = option.id
    if (selectedIds.has(optionId)) {
      // 移除选项
      const newValue = isSimpleType
        ? valueArray.filter(v => v !== optionId)
        : valueArray.filter(v => {
            if (v === null || v === undefined) return false
            return typeof v === 'string' ? v !== optionId : v.id !== optionId
          })
      onChange(newValue)
    } else {
      // 添加选项
      const itemToAdd = isSimpleType ? optionId : option
      onChange([...valueArray, itemToAdd])
    }
  }

  // 删除已选项
  const handleRemove = (itemToRemove: string | Option) => {
    if (itemToRemove === null || itemToRemove === undefined) return
    const id = typeof itemToRemove === 'string' ? itemToRemove : itemToRemove.id
    const newValue = valueArray.filter(v => {
      if (v === null || v === undefined) return false
      return typeof v === 'string' ? v !== id : v.id !== id
    })
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <Label>{title}</Label>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div 
            className="min-h-[2.5rem] w-full rounded-md border border-input bg-transparent px-3 py-2 cursor-pointer hover:bg-accent/50"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex flex-wrap gap-2">
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <Badge
                    key={typeof item === 'string' ? item : item.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {typeof item === 'string' ? item : item.name}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select {title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex items-center border rounded-md px-3">
              <input
                className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-2 max-h-[300px] overflow-y-auto rounded-md border">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No results found.
                </div>
              ) : (
                filteredOptions.map(option => (
                  <div
                    key={option.id}
                    onClick={() => toggleOption(option)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent",
                      selectedIds.has(option.id) && "bg-accent"
                    )}
                  >
                    <div className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border",
                      selectedIds.has(option.id) 
                        ? "bg-primary border-primary" 
                        : "border-primary"
                    )}>
                      {selectedIds.has(option.id) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <span>{option.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 