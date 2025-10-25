import { router, publicProcedure } from '../trpc'

export const modelsRouter = router({
  getAvailable: publicProcedure.query(async () => {
    return [
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Latest GPT-4 model' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Anthropic\'s latest model' },
      { id: 'gemini-pro', name: 'Gemini Pro', description: 'Google\'s advanced model' },
    ]
  }),
})
