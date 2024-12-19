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

  // 获取当前选中项的 ID 集合
  const selectedIds = new Set(
    Array.isArray(value)
      ? value.map(v => isSimpleType ? v : (v as Option).id)
      : []
  )

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
    const newValue = Array.isArray(value) ? [...value] : []
    const optionId = option.id

    if (selectedIds.has(optionId)) {
      // 移除选项
      const filteredValue = newValue.filter(v => 
        isSimpleType 
          ? v !== optionId 
          : (v as Option).id !== optionId
      )
      onChange(filteredValue)
    } else {
      // 添加选项
      const itemToAdd = isSimpleType ? optionId : option
      onChange([...newValue, itemToAdd])
    }
  }

  // 删除已选项
  const handleRemove = (itemToRemove: string | Option) => {
    const id = isSimpleType ? itemToRemove : (itemToRemove as Option).id
    const newValue = Array.isArray(value)
      ? value.filter(v => (isSimpleType ? v !== id : (v as Option).id !== id))
      : []
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
              {Array.isArray(value) && value.length > 0 ? (
                value.map((item, index) => (
                  <Badge
                    key={isSimpleType ? item : (item as Option).id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {isSimpleType ? item : (item as Option).name}
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