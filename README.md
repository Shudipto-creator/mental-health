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
- Streamlined authentication with email and password
- Simplified user registration process with minimal required fields
- Customizable user profiles with name and preferences
- Language preference settings (English/中文)
- Health data privacy controls with secure data handling
- Persistent user sessions with Supabase authentication

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

#### User Management Tables
- `profiles`: Stores user profile information including:
  - `user_id`: Foreign key to Supabase auth.users
  - `full_name`: User's full name
  - `language_preference`: User's preferred language (en/zh)
  - `created_at`: Timestamp of profile creation
  - `updated_at`: Timestamp of last profile update

#### Chat System Tables
- `chat_sessions`: Manages chat conversations with:
  - `id`: Unique session identifier
  - `user_id`: Foreign key to user profile
  - `created_at`: Session start timestamp
  - `title`: Auto-generated or user-defined session title
- `chat_messages`: Stores individual messages with:
  - `id`: Unique message identifier
  - `session_id`: Foreign key to chat_sessions
  - `content`: Message text content
  - `role`: Message sender (user/assistant)
  - `created_at`: Message timestamp

#### Health Assessment Tables
- `health_assessments`: Master table tracking all assessments with:
  - `id`: Unique assessment identifier
  - `user_id`: Foreign key to user profile
  - `created_at`: Assessment timestamp
  - `status`: Completion status (in_progress/completed)

- `physical_health`: Physical assessment data including chronic conditions and pain areas
- `nutritional_health`: Nutritional assessment data including dietary habits and restrictions
- `sleep_health`: Sleep pattern assessment data including sleep quality metrics
- `stress_health`: Stress assessment data including stressors and coping mechanisms

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
- **User Experience Improvements**:
  - Removed Student ID field from signup and profile settings for streamlined user experience
  - Enhanced checkbox functionality across all health assessment forms with improved visibility and multiple selection
  - Fixed race conditions in checkbox state management for more reliable form interactions

- **Resources Page Enhancements**:
  - Implemented dynamic filtering system by category (Articles, Videos, Books, External Resources)
  - Added search functionality for finding specific resources
  - Created tag-based navigation with clickable tags for related content discovery
  - Improved resource cards with external link indicators and tag displays
  - Added empty state handling with clear user feedback
  - Implemented responsive grid layout for all device sizes

- **UI/UX Refinements**:
  - Improved form accessibility with consistent styling and better contrast
  - Enhanced visual feedback for interactive elements
  - Added comprehensive README documentation with detailed feature descriptions
  - Optimized animations for smoother transitions

### April 2025
- **Health Assessment System**:
  - Implemented full health assessment system with four specialized forms:
    - Physical Health Assessment for tracking physical wellbeing
    - Nutritional Assessment for monitoring dietary habits
    - Sleep Assessment for evaluating sleep patterns
    - Stress Assessment for identifying stressors and coping mechanisms
  - Added assessment summary with visualization of results
  - Created persistent storage of assessment data with Supabase

- **Core Features**:
  - Integrated AI chat with health context awareness using Groq's Llama3 model
  - Launched initial version of Resources page with basic information
  - Implemented 3D visualization with Three.js and React Three Fiber
  - Created responsive UI with Tailwind CSS and Framer Motion

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
