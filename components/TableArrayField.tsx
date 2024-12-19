import React, { useState } from 'react'
import { JSONSchema7 } from 'json-schema'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { Modal } from './ui/modal'
import { FormField } from './FormField'

interface TableArrayFieldProps {
  name: string;
  schema: JSONSchema7;
  value: any[];
  onChange: (value: any[]) => void;
  loadRefData: (refKey: string, value?: string) => Promise<any>;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  schema: JSONSchema7;
  value: any;
  onSubmit: (value: any) => void;
  loadRefData: (refKey: string, value?: string) => Promise<any>;
}

function EditModal({ isOpen, onClose, title, schema, value, onSubmit, loadRefData }: EditModalProps) {
  const [formData, setFormData] = useState(value || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <FormField
          name=""
          schema={schema}
          value={formData}
          onChange={(value) => setFormData(value)}
          loadRefData={loadRefData}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function TableArrayField({ name, schema, value = [], onChange, loadRefData }: TableArrayFieldProps) {
  const [editingItem, setEditingItem] = useState<{ index: number; value: any } | null>(null);

  const itemSchema = schema.items as JSONSchema7;
  const properties = itemSchema.type === 'object' 
    ? itemSchema.properties 
    : itemSchema.$ref 
    ? {} // Handle ref schema loading if needed
    : {};

  const columns = Object.entries(properties).map(([key, prop]) => ({
    key,
    title: (prop as JSONSchema7).title || key
  }));

  const handleAdd = () => {
    setEditingItem({ index: -1, value: {} });
  };

  const handleEdit = (index: number) => {
    setEditingItem({ index, value: value[index] });
  };

  const handleDelete = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleSave = (newValue: any) => {
    if (editingItem!.index === -1) {
      onChange([...value, newValue]);
    } else {
      onChange(value.map((item, i) => i === editingItem!.index ? newValue : item));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{schema.title || name}</h3>
        <Button type="button" variant="outline" onClick={handleAdd}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {schema.title || name}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={column.key}>{column.title}</TableHead>
            ))}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {value.map((item, index) => (
            <TableRow key={index}>
              {columns.map(column => (
                <TableCell key={column.key}>
                  {String(item[column.key] || '')}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(index)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {value.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground">
                No items yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editingItem && (
        <EditModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          title={`${editingItem.index === -1 ? 'Add' : 'Edit'} ${schema.title || name}`}
          schema={itemSchema}
          value={editingItem.value}
          onSubmit={handleSave}
          loadRefData={loadRefData}
        />
      )}
    </div>
  );
} 