'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

interface Model {
  id: string
  name: string
  description: string
}

interface ModelSelectorProps {
  models: Model[]
  selectedModel: string | null
  onModelSelect: (modelId: string) => void
}

export function ModelSelector({ models, selectedModel, onModelSelect }: ModelSelectorProps) {
  const selectedModelData = models.find(m => m.id === selectedModel)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Model:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between min-w-[200px]">
            {selectedModelData ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedModelData.id}</Badge>
                <span className="text-sm">{selectedModelData.name}</span>
              </div>
            ) : (
              'Select a model'
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80">
          {models.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onModelSelect(model.id)}
              className="flex flex-col items-start gap-1 p-3"
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{model.id}</Badge>
                <span className="font-medium">{model.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {model.description}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
