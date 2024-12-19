'use client'

import { DynamicForm } from '@/components/DynamicForm'
import { JSONSchema7 } from 'json-schema'

const exampleSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', title: 'Name' },
    age: { type: 'integer', title: 'Age' },
    isStudent: { type: 'boolean', title: 'Is Student' },
    address: {
      type: 'object',
      title: 'Address',
      properties: {
        street: { type: 'string', title: 'Street' },
        city: { type: 'string', title: 'City' },
        country: { type: 'string', title: 'Country' }
      }
    },
    refAddress: {
      $ref: '#/definitions/address',
      title: 'Reference Address'
    },
    favoriteColor: {
      $ref: '#/definitions/color',
      title: 'Favorite Color'
    },
    hobbies: {
      type: 'array',
      title: 'Hobbies',
      items: { type: 'string' }
    },
    experiences: {
      type: 'array',
      title: 'Work Experiences',
      items: {
        type: 'object',
        properties: {
          company: { type: 'string', title: 'Company' },
          position: { type: 'string', title: 'Position' },
          years: { type: 'integer', title: 'Years' }
        }
      }
    },
    skills: {
      type: 'array',
      title: 'Skills',
      items: {
        $ref: '#/definitions/skill'
      }
    }
  },
  definitions: {
    color: {
      type: 'string',
      enum: ['red', 'green', 'blue', 'yellow', 'purple']
    },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string', title: 'Street' },
        city: { type: 'string', title: 'City' },
        country: { type: 'string', title: 'Country' }
      }
    },
    skill: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        level: { type: 'string' }
      }
    }
  }
}

const loadRefData = async (refKey: string, value?: string) => {
  // Simulating async loading
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (refKey === 'address') {
    if (value) {
      // Simulating loading a single address
      return { id: value, street: '123 Main St', city: 'New York', country: 'USA' }
    } else {
      // Simulating loading all addresses
      return [
        { id: '1', street: '123 Main St', city: 'New York', country: 'USA' },
        { id: '2', street: '456 Elm St', city: 'London', country: 'UK' },
        { id: '3', street: '789 Oak St', city: 'Tokyo', country: 'Japan' }
      ]
    }
  } else if (refKey === 'color') {
    return {
      type: 'string',
      enum: ['red', 'green', 'blue', 'yellow', 'purple']
    }
  } else if (refKey === 'skill') {
    return [
      { id: '1', name: 'JavaScript', level: 'Expert' },
      { id: '2', name: 'Python', level: 'Intermediate' },
      { id: '3', name: 'Java', level: 'Beginner' },
      { id: '4', name: 'C++', level: 'Advanced' },
    ]
  }
  return null
}

export default function Home() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 w-full max-w-7xl mx-auto">
      <DynamicForm schema={exampleSchema as JSONSchema7} onSubmit={handleSubmit} loadRefData={loadRefData} />
    </main>
  )
}

