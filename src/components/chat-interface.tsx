'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ModelSelector } from './model-selector'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { ThemeToggle } from './theme-toggle'
import { useAuth } from '@/lib/auth-context'
import { trpc } from '@/lib/trpc-client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  model_tag?: string
  is_edited?: boolean
}

export function ChatInterface() {
  const { user, signOut } = useAuth()
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: models = [] } = trpc.models.getAvailable.useQuery()
  const { data: chatHistory = [], refetch: refetchHistory } = trpc.chat.history.useQuery(
    { userId: user?.id || '' },
    { enabled: !!user?.id }
  )
  
  const sendMessageMutation = trpc.chat.send.useMutation({
    onSuccess: (data) => {
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => !msg.id.startsWith('temp-'))
        return [...filteredMessages, data.userMessage, data.aiMessage]
      })
      
      setIsLoading(false)
      refetchHistory()
    },
    onError: (error) => {
      console.error('Failed to send message:', error)
      setIsLoading(false)
    },
  })

  const editMessageMutation = trpc.chat.edit.useMutation({
    onSuccess: (data) => {
      setMessages(prev => {
        const newMessages = [...prev]
        const userMessageIndex = newMessages.findIndex(msg => msg.id === data.updatedMessage.id)
        const aiMessageIndex = newMessages.findIndex(msg => msg.id === data.aiMessage.id)
        
        if (userMessageIndex !== -1) {
          newMessages[userMessageIndex] = data.updatedMessage
        }
        if (aiMessageIndex !== -1) {
          newMessages[aiMessageIndex] = data.aiMessage
        }
        
        return newMessages
      })
      
      refetchHistory()
    },
    onError: (error) => {
      console.error('Failed to edit message:', error)
    },
  })

  const deleteMessageMutation = trpc.chat.delete.useMutation({
    onSuccess: (_, variables) => {
      setMessages(prev => {
        const messageId = variables.messageId
        const userMessageIndex = prev.findIndex(msg => msg.id === messageId)
        
        if (userMessageIndex === -1) return prev
        
        const newMessages = [...prev]
        newMessages.splice(userMessageIndex, 1)
        
        if (userMessageIndex < newMessages.length && 
            newMessages[userMessageIndex]?.role === 'assistant') {
          newMessages.splice(userMessageIndex, 1)
        }
        
        return newMessages
      })
      
      refetchHistory()
    },
    onError: (error) => {
      console.error('Failed to delete message:', error)
    },
  })


  useEffect(() => {
    if (chatHistory.length > 0) {
      setMessages(chatHistory)
    }
  }, [chatHistory])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!selectedModel || !user) return

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      await sendMessageMutation.mutateAsync({
        modelTag: selectedModel,
        prompt: content,
        userId: user.id,
      })
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
    }
  }

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId)
  }

  const handleEditMessage = async (newContent: string) => {
    if (!selectedModel || !user || !editingMessage) return

    try {
      await editMessageMutation.mutateAsync({
        messageId: editingMessage.id,
        newContent,
        modelTag: selectedModel,
        userId: user.id,
      })
      setEditMode(false)
      setEditingMessage(null)
    } catch (error) {
      console.error('Error editing message:', error)
    }
  }

  const handleStartEdit = (message: Message) => {
    setEditingMessage(message)
    setEditMode(true)
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setEditingMessage(null)
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return

    try {
      await deleteMessageMutation.mutateAsync({
        messageId,
        userId: user.id,
      })
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }


  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">AI Chat</h1>
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onModelSelect={handleModelSelect}
          />
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {selectedModel 
              ? 'Start a conversation by typing a message below'
              : 'Select a model to start chatting'
            }
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="group">
              <ChatMessage 
                message={message}
                onStartEdit={handleStartEdit}
                onDeleteMessage={handleDeleteMessage}
                selectedModel={selectedModel || undefined}
                userId={user.id}
              />
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
              <Spinner className="h-4 w-4" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                AI is thinking...
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={editMode ? handleEditMessage : handleSendMessage}
        disabled={!selectedModel || isLoading}
        placeholder={selectedModel ? "Type your message..." : "Select a model first..."}
        editMode={editMode}
        editText={editingMessage?.content}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  )
}
