# Mental Health Checkup Platform

A modern, interactive mental health support platform built with React and Supabase, featuring comprehensive health assessments, real-time chat with AI assistance, user profiles, and curated mental health resources.

🔗 https://mental-health-01.netlify.app/

![Mental Health Platform](https://img.shields.io/badge/Platform-Mental%20Health-purple)
![React](https://img.shields.io/badge/React-18-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

### 📋 Comprehensive Health Assessments
- **Physical Health Assessment**: Track chronic conditions, pain areas, and overall physical wellbeing
- **Nutritional Assessment**: Monitor dietary habits, restrictions, and food allergies
- **Sleep Assessment**: Evaluate sleep patterns, difficulties, and sleep aid usage
- **Stress Assessment**: Identify stressors, symptoms, and coping mechanisms
- **Assessment Summary**: Get a holistic view of your mental and physical health status

### 🧠 Interactive 3D Visualization
- Beautiful 3D heart model with dynamic animations
- Interactive orbit controls for user engagement
- Particle effects for enhanced visual appeal
- Responsive performance across devices

### 💬 AI-Powered Chat Support
- Real-time chat with AI mental health assistant
- Emotion-aware responses powered by Groq's Llama3 model
- Message history persistence
- Emoji support for expressive communication
- Contextual suggestions based on assessment results

### 👤 User Management
- Secure authentication system
- Customizable user profiles
- Language preference settings (English/中文)
- Student ID integration
- Health data privacy controls

### 📚 Resource Center
- Searchable mental health resources
- Category and tag filtering system
- Curated articles, videos, and books
- External support services links
- Crisis helpline information
- One-click access to relevant resources

### 🎨 Modern UI/UX
- Responsive design for all device sizes
- Custom cursor animations
- Beautiful gradients and glass morphism effects
- Smooth page transitions and animations
- Accessible form controls and navigation
- Dark theme optimized for eye comfort

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Form Management**: React Hook Form with custom validation
- **3D Graphics**: Three.js with React Three Fiber
- **Animations**: Framer Motion for smooth transitions
- **Database**: Supabase for real-time data and authentication
- **AI Integration**: Groq API with Llama3 for intelligent chat
- **State Management**: React Context API and custom hooks
- **Icons**: Lucide React for consistent UI elements
- **Build Tool**: Vite for fast development and optimized production builds
- **Deployment**: Netlify with continuous integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Groq API key

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
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

- `profiles`: User profile information and preferences
- `chat_sessions`: Chat session management and metadata
- `chat_messages`: Message storage with AI response tracking
- `health_assessments`: Master table for assessment tracking
- `physical_health`: Physical health assessment data
- `nutritional_health`: Nutritional assessment data
- `sleep_health`: Sleep pattern assessment data
- `stress_health`: Stress level assessment data

Migration files are provided in the `supabase/migrations` directory. Run these migrations to set up your database schema correctly.

## Project Structure

```
mental-health/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── forms/            # Health assessment form components
│   │   ├── ui/               # Common UI elements
│   │   └── 3d/               # 3D visualization components
│   ├── pages/                # Page components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions and API clients
│   ├── context/              # React context providers
│   ├── types/                # TypeScript type definitions
│   └── main.tsx              # Application entry point
├── public/                   # Static assets
├── supabase/                 # Database related files
│   ├── migrations/           # SQL migration files
│   └── types/                # Generated Supabase types
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Project dependencies
```

## Key Features Implementation

### Health Assessment System
- Multi-step form architecture with state persistence
- Comprehensive data collection across health domains
- Form validation with error handling
- Checkbox and multi-select components for flexible data input
- Progress tracking and resumable assessments
- Summary generation with actionable insights

### Authentication Flow
- Email/password authentication with Supabase
- Protected routes with context-based access control
- Persistent session management
- Secure data access patterns

### Real-time Chat
- WebSocket connections for instant updates
- Message persistence with history retrieval
- Typing indicators and read receipts
- Emoji picker integration for expressive communication
- AI-powered responses using Groq's Llama3 model
- Context-aware suggestions based on user profile

### Profile Management
- User data CRUD operations
- Language preference settings (English/中文)
- Student information management
- Assessment history tracking
- Data export capabilities

### Resource Center
- Dynamic filtering system by category and tags
- Search functionality for quick resource discovery
- External link handling with security measures
- Responsive grid layout for various screen sizes
- Tag-based navigation for related resources

### 3D Visualization
- Custom heart model with anatomical accuracy
- Interactive orbit controls for exploration
- Particle system for visual enhancement
- Performance optimizations for mobile devices
- Integration with emotional state visualization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Recent Updates

### May 2025
- Enhanced checkbox functionality across all health assessment forms
- Optimized Resources page with filtering, search, and tag navigation
- Improved UI/UX with consistent styling and better accessibility
- Added comprehensive README documentation

### April 2025
- Implemented full health assessment system with four specialized forms
- Added assessment summary with visualization of results
- Integrated AI chat with health context awareness
- Launched initial version of Resources page

## Acknowledgments

- Three.js for 3D graphics capabilities
- Groq for AI chat functionality
- Supabase for backend services
- Tailwind CSS for styling framework
- React community for component libraries and inspiration

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2025 Mental Health Checkup Platform. All rights reserved.
