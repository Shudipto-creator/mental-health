# Mental Health Checkup Platform

A modern, interactive mental health support platform built with React and Supabase, featuring real-time chat with AI assistance, user profiles, and mental health resources.

🔗https://mental-health-01.netlify.app/

## Features

### 🧠 Interactive 3D Visualization
- Beautiful 3D heart model with dynamic animations
- Interactive orbit controls for user engagement
- Particle effects for enhanced visual appeal

### 💬 AI-Powered Chat Support
- Real-time chat with AI mental health assistant
- Emotion-aware responses
- Message history persistence
- Emoji support for expressive communication

### 👤 User Management
- Secure authentication system
- Customizable user profiles
- Language preference settings (English/中文)
- Student ID integration

### 📚 Resource Center
- Curated mental health articles
- Educational videos
- External support services links
- Crisis helpline information

### 🎨 Modern UI/UX
- Responsive design
- Custom cursor animations
- Beautiful gradients and glass morphism effects
- Smooth page transitions
- Loading animations

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js with React Three Fiber
- **Animations**: Framer Motion
- **Database**: Supabase
- **AI Integration**: OpenAI GPT-3.5
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Shudipto-creator/mental-health.git
cd mental-health
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Database Setup

The platform uses Supabase for data storage. The following tables are required:

- `profiles`: User profile information
- `chat_sessions`: Chat session management
- `chat_messages`: Message storage

Migration files are provided in the `supabase/migrations` directory.

## Project Structure

```
yunnan-mental-health/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and API clients
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── supabase/          # Database migrations and types
└── package.json       # Project dependencies
```

## Key Features Implementation

### Authentication Flow
- Email/password authentication
- Protected routes
- Session management

### Real-time Chat
- WebSocket connections for instant updates
- Message persistence
- Typing indicators
- Emoji picker integration

### Profile Management
- User data CRUD operations
- Language preference settings
- Student information management

### 3D Visualization
- Custom heart model
- Interactive controls
- Particle system
- Performance optimizations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Three.js for 3D graphics capabilities
- OpenAI for AI chat functionality
- Supabase for backend services
