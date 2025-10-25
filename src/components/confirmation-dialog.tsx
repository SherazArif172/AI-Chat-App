'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default'
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md mx-4 p-6 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            variant === 'destructive' 
              ? 'bg-red-100 dark:bg-red-900/20' 
              : 'bg-blue-100 dark:bg-blue-900/20'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${
              variant === 'destructive' 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-blue-600 dark:text-blue-400'
            }`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-4 py-2"
              >
                {cancelText}
              </Button>
              <Button
                variant={variant === 'destructive' ? 'destructive' : 'default'}
                onClick={handleConfirm}
                className="px-4 py-2"
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
