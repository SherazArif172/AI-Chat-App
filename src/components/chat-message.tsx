'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'
import { ConfirmationDialog } from './confirmation-dialog'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  model_tag?: string
  is_edited?: boolean
}

interface ChatMessageProps {
  message: Message
  onStartEdit?: (message: Message) => void
  onDeleteMessage?: (messageId: string) => void
  selectedModel?: string
  userId?: string
}

export function ChatMessage({ 
  message, 
  onStartEdit, 
  onDeleteMessage,
  selectedModel, 
  userId 
}: ChatMessageProps) {
  const isUser = message.role === 'user'
  const timestamp = new Date(message.created_at).toLocaleTimeString()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleEdit = () => {
    onStartEdit?.(message)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    onDeleteMessage?.(message.id)
  }

  const canEdit = isUser && onStartEdit && selectedModel && userId
  const canDelete = isUser && onDeleteMessage && userId

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.is_edited && (
            <div className="mt-1">
              <Badge variant="secondary" className="text-xs">
                edited
              </Badge>
            </div>
          )}
          
          {message.model_tag && !isUser && (
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                {message.model_tag}
              </Badge>
            </div>
          )}
        </div>
        
        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp}
          </div>
          
          <div className="flex gap-1">
            {canEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
            {canDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDeleteClick}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone and will also remove the AI response."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}
