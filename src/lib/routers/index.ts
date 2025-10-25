import { router } from '../trpc'
import { modelsRouter } from './models'
import { chatRouter } from './chat'

export const appRouter = router({
  models: modelsRouter,
  chat: chatRouter,
})

export type AppRouter = typeof appRouter
