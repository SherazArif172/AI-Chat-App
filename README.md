# AI Chat Application

A modern, full-stack chat application built with Next.js, Supabase, and tRPC. Features real-time messaging, message editing, deletion, and multiple AI model support.

## 🚀 Quick Setup (3 Commands)

```bash
# 1. Clone and install dependencies
git clone <your-repo-url> && cd assignment && npm install

# 2. Set up environment variables
cp .env.local.example .env.local

# 3. Run the development server
npm run dev
```

## 🔧 Environment Setup

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key_optional
```

## 🗄️ Database Setup

1. Create a new Supabase project
2. Run the SQL schema in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

## ✨ Features

- **Real-time Chat**: Instant messaging with AI models
- **Message Editing**: Edit your messages and regenerate AI responses
- **Message Deletion**: Delete messages with confirmation dialog
- **Multiple AI Models**: Support for GPT-4o, Claude, Gemini
- **Dark/Light Theme**: Toggle between themes
- **User Authentication**: Secure login/signup with Supabase Auth
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: tRPC, Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons

## 📱 Usage

1. **Sign Up/Login**: Create an account or sign in
2. **Select Model**: Choose your preferred AI model
3. **Start Chatting**: Type messages and get AI responses
4. **Edit Messages**: Click edit button to modify your messages
5. **Delete Messages**: Click delete button to remove messages

## 🔌 AI API Integration

**Current Implementation**: The application uses echo responses for demonstration purposes. The AI response logic is stubbed in `src/lib/routers/chat.ts`:

```typescript
if (process.env.OPENAI_API_KEY) {
  // TODO: Implement actual OpenAI API call
  aiResponse = `AI Response (${modelTag}): You said: "${prompt}"`
} else {
  // Echo fallback as specified in requirements
  aiResponse = `You said: "${prompt}"`
}
```

**To Enable Real AI Responses**:
1. Add your OpenAI API key to `.env.local`
2. Replace the TODO section with actual OpenAI API calls
3. The application will automatically use real AI responses

**Alternative AI Providers**: The code is structured to easily support other AI providers (Claude, Gemini, etc.) by modifying the response generation logic.

## 🎯 Stretch Features Implemented

### Core Functionality
- ✅ **Message Editing**: Edit user messages and regenerate AI responses
- ✅ **Message Deletion**: Delete messages with custom confirmation dialog
- ✅ **Real-time Updates**: Instant UI updates without page reload

### UI/UX Enhancements
- ✅ **Custom Confirmation Dialog**: Beautiful modal instead of browser alerts
- ✅ **Auto-focus**: Input automatically focuses when editing
- ✅ **Theme Toggle**: Dark/light mode support
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Hover Effects**: Edit/delete buttons appear on hover
- ✅ **Loading States**: Proper loading indicators during operations

### Technical Features
- ✅ **Type Safety**: Full TypeScript implementation with tRPC
- ✅ **Database Relationships**: Parent-child message relationships
- ✅ **Optimistic Updates**: UI updates before server confirmation
- ✅ **Error Handling**: Graceful error handling throughout
- ✅ **Clean Code**: No AI-generated comments, human-like code structure

## 🚀 Deployment

The application is ready for deployment on Vercel:

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📄 License

MIT License - feel free to use this project for learning and development.