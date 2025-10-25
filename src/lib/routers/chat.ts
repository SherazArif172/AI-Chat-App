import { router, publicProcedure } from '../trpc'
import { z } from 'zod'
import { supabaseAdmin } from '../supabase'

export const chatRouter = router({
  send: publicProcedure
    .input(z.object({
      modelTag: z.string(),
      prompt: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { modelTag, prompt, userId } = input

      const { data: userMessage, error: userError } = await supabaseAdmin
        .from('messages')
        .insert({
          user_id: userId,
          model_tag: modelTag,
          role: 'user',
          content: prompt,
        })
        .select()
        .single()

      if (userError) {
        throw new Error(`Failed to save user message: ${userError.message}`)
      }

      let aiResponse: string
      
      if (process.env.OPENAI_API_KEY) {
        aiResponse = `AI Response (${modelTag}): You said: "${prompt}"`
      } else {
        aiResponse = `You said: "${prompt}"`
      }
      const { data: aiMessage, error: aiError } = await supabaseAdmin
        .from('messages')
        .insert({
          user_id: userId,
          model_tag: modelTag,
          role: 'assistant',
          content: aiResponse,
          parent_id: userMessage.id,
        })
        .select()
        .single()

      if (aiError) {
        throw new Error(`Failed to save AI message: ${aiError.message}`)
      }

      return {
        userMessage,
        aiMessage,
      }
    }),

  history: publicProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().optional().default(50),
    }))
    .query(async ({ input }) => {
      const { userId, limit } = input

      const { data: messages, error } = await supabaseAdmin
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(limit)

      if (error) {
        throw new Error(`Failed to fetch chat history: ${error.message}`)
      }

      return messages || []
    }),

  edit: publicProcedure
    .input(z.object({
      messageId: z.string(),
      newContent: z.string(),
      modelTag: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { messageId, newContent, modelTag, userId } = input

      const { data: updatedMessage, error: updateError } = await supabaseAdmin
        .from('messages')
        .update({
          content: newContent,
          is_edited: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .eq('user_id', userId)
        .select()
        .single()

      if (updateError) {
        throw new Error(`Failed to update message: ${updateError.message}`)
      }

      let aiResponse: string
      
      if (process.env.OPENAI_API_KEY) {
        aiResponse = `AI Response (${modelTag}): You said: "${newContent}"`
      } else {
        aiResponse = `You said: "${newContent}"`
      }
      const { data: aiMessage, error: aiError } = await supabaseAdmin
        .from('messages')
        .update({
          content: aiResponse,
          is_edited: true,
          updated_at: new Date().toISOString(),
        })
        .eq('parent_id', messageId)
        .eq('user_id', userId)
        .eq('role', 'assistant')
        .select()
        .single()

      if (aiError) {
        throw new Error(`Failed to update AI response: ${aiError.message}`)
      }

      return {
        updatedMessage,
        aiMessage,
      }
    }),

  regenerate: publicProcedure
    .input(z.object({
      messageId: z.string(),
      modelTag: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { messageId, modelTag, userId } = input

      const { data: userMessage, error: fetchError } = await supabaseAdmin
        .from('messages')
        .select('content')
        .eq('id', messageId)
        .eq('user_id', userId)
        .eq('role', 'user')
        .single()

      if (fetchError) {
        throw new Error(`Failed to fetch user message: ${fetchError.message}`)
      }

      let aiResponse: string
      
      if (process.env.OPENAI_API_KEY) {
        aiResponse = `AI Response (${modelTag}): You said: "${userMessage.content}"`
      } else {
        aiResponse = `You said: "${userMessage.content}"`
      }
      const { data: existingAiMessage, error: findError } = await supabaseAdmin
        .from('messages')
        .select('id')
        .eq('parent_id', messageId)
        .eq('user_id', userId)
        .eq('role', 'assistant')
        .single()

      let aiMessage
      let aiMessageToUpdate = existingAiMessage

      if (findError || !existingAiMessage) {
        const { data: userMsg } = await supabaseAdmin
          .from('messages')
          .select('created_at')
          .eq('id', messageId)
          .single()

        if (userMsg) {
          const { data: aiMessages } = await supabaseAdmin
            .from('messages')
            .select('id')
            .eq('user_id', userId)
            .eq('role', 'assistant')
            .gt('created_at', userMsg.created_at)
            .order('created_at', { ascending: true })
            .limit(1)

          if (aiMessages && aiMessages.length > 0) {
            aiMessageToUpdate = aiMessages[0]
          }
        }
      }

      if (aiMessageToUpdate) {
        const { data: updatedAiMessage, error: updateError } = await supabaseAdmin
          .from('messages')
          .update({
            content: aiResponse,
            is_edited: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', aiMessageToUpdate.id)
          .select()
          .single()

        if (updateError) {
          throw new Error(`Failed to update AI response: ${updateError.message}`)
        }

        aiMessage = updatedAiMessage
      } else {
        const { data: newAiMessage, error: createError } = await supabaseAdmin
          .from('messages')
          .insert({
            user_id: userId,
            model_tag: modelTag,
            role: 'assistant',
            content: aiResponse,
            parent_id: messageId,
          })
          .select()
          .single()

        if (createError) {
          throw new Error(`Failed to create AI response: ${createError.message}`)
        }

        aiMessage = newAiMessage
      }

      return aiMessage
    }),

  delete: publicProcedure
    .input(z.object({
      messageId: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { messageId, userId } = input

      const { data: aiMessage } = await supabaseAdmin
        .from('messages')
        .select('id')
        .eq('parent_id', messageId)
        .eq('user_id', userId)
        .eq('role', 'assistant')
        .single()

      if (aiMessage) {
        const { error: aiDeleteError } = await supabaseAdmin
          .from('messages')
          .delete()
          .eq('id', aiMessage.id)
          .eq('user_id', userId)

        if (aiDeleteError) {
          console.warn('Failed to delete AI response:', aiDeleteError.message)
        }
      }

      const { error: userDeleteError } = await supabaseAdmin
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', userId)
        .eq('role', 'user')

      if (userDeleteError) {
        throw new Error(`Failed to delete message: ${userDeleteError.message}`)
      }

      return { success: true }
    }),
})
