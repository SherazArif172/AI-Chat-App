'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, X } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
  editMode?: boolean
  editText?: string
  onCancelEdit?: () => void
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message...",
  editMode = false,
  editText = '',
  onCancelEdit
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editMode && editText) {
      setMessage(editText)
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 0)
    } else if (!editMode) {
      setMessage('')
    }
  }, [editMode, editText])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      if (!editMode) {
        setMessage('')
      }
    }
  }

  const handleCancel = () => {
    setMessage('')
    onCancelEdit?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={editMode ? "Edit your message..." : placeholder}
        disabled={disabled}
        className="flex-1"
      />
      {editMode && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button type="submit" disabled={disabled || !message.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
