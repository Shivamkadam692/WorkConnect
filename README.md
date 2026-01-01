# WorkConnect - Professional Services Platform

A modern, multilingual platform built with Node.js/Express backend and EJS frontend, featuring real-time notifications, request management, language support, responsive design, SEO optimization, smooth scrolling, and enhanced user-friendly UI

## 🌟 Key Features

- 👥 **Professional Services**: Connect clients with skilled workers based on skills and location
- 💰 **Request Management**: Clients can send requests to workers with date, time, and requirements
- 🔔 **Real-time Notifications**: Live notifications with Socket.IO for instant updates
- 📍 **Real-time Tracking**: Live location tracking with Socket.IO between client and worker
- 🔐 **Authentication**: Session-based authentication with role-based access control (Client/Worker)
- 👤 **User Profiles**: Comprehensive profile management with booking history
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 💳 **Payment Integration**: Stripe payment processing
- 🔄 **Real-time Updates**: Live updates for service status and location
- ✨ **Enhanced UI**: User-friendly interface with comprehensive Font Awesome icon integration
- 🎯 **SEO Optimized**: Comprehensive meta tags, Open Graph, and Twitter Card support
- ⚡ **Smooth Scrolling**: Enhanced user experience with smooth page transitions and scrolling
- 🚀 **Performance Optimized**: Preconnect, DNS prefetch, and optimized asset loading

## 🆕 Recent Updates

### v3.0.0 - Consultancy Platform Conversion (Latest)
- **👥 Role Conversion**: Converted shippers to clients and transporters to workers
- **💼 Service Model**: Workers register with specific skills and location instead of vehicle details
- **🔍 Skill-based Search**: Clients can search for workers by skills and location
- **📬 Request System**: Clients send requests to workers with date, time, and requirements
- **🤝 Accept/Reject Workflow**: Workers can accept or reject requests from clients
- **🗺️ Location Mapping**: Display worker locations on map and show distance between client and worker
- **📍 Real-time Tracking**: Live location sharing between client and worker during service
- **💳 Payment Processing**: Demo payment system after service completion
- **📱 Mobile Responsive**: Fully responsive design for all device sizes
- **🎨 UI Refresh**: Completely redesigned user interface with modern styling while maintaining the light orange color palette
- **📏 Size Adjustments**: Updated typography, button sizes, card layouts, and spacing for improved visual hierarchy
- **✨ Enhanced Visual Design**: Refined navigation, forms, and dashboard layouts for better user experience



### v2.6.0 - SEO Optimization & Smooth Scrolling
- **🎯 SEO Optimization**: Added comprehensive meta tags, Open Graph, and Twitter Card support
- **📱 Social Media Integration**: Enhanced social sharing with proper meta tags
- **⚡ Smooth Scrolling**: Implemented smooth scrolling behavior across all pages
- **🚀 Performance Optimization**: Added preconnect and DNS prefetch for faster asset loading
- **♿ Accessibility**: Added support for reduced motion preferences
- **🔍 Search Engine Friendly**: Optimized title, description, and keywords for better indexing
- **🧹 Code Cleanup**: Removed unused code and optimized file structure
- **📄 README Updates**: Comprehensive documentation updates with latest features

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **EJS** templating engine
- **Stripe** for payments
- **Express-session** for session management

### Frontend
- **EJS** templates with embedded JavaScript
- **Socket.IO Client** for real-time features
- **Responsive CSS** with modern design system
- **Modern UI Components** with refined styling and animations
- **Font Awesome Icons** for enhanced user experience
- **Language switching** with dynamic content updates
- **Real-time notifications** with action buttons
- **SEO Optimization** with meta tags and Open Graph
- **Smooth Scrolling** with CSS scroll-behavior
- **Performance Optimization** with preconnect and DNS prefetch

### UI Components
- **Card Styles**: Modern design with refined spacing and visual hierarchy
- **Status Badges**: Color-coded status indicators for different states
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Icon Integration**: Contextual icons for improved information hierarchy
- **Modal Dialogs**: Enhanced modal dialogs with smooth animations
- **Navigation Elements**: Refined navigation styling with improved hover effects

## 📁 Project Structure

```
WorkConnect/
├── config/                 # Database and environment configuration
│   ├── db.js              # MongoDB connection
│   └── env.js             # Environment variables
├── middleware/             # Express middleware
│   └── auth.js            # Authentication and role-based access
├── models/                 # Mongoose models
│   ├── Service.js         # Service management
│   ├── Worker.js          # Worker/consultant management
│   ├── Notification.js    # Notification system
│   ├── Payment.js         # Payment processing
│   ├── Request.js         # Service requests
│   └── User.js            # User management
├── routes/                 # Express routes
│   ├── authRoutes.js      # Authentication routes
│   ├── dashboardRoutes.js # Dashboard and request management
│   ├── paymentRoutes.js   # Payment processing
│   ├── notificationRoutes.js # Notification system
│   ├── profileRoutes.js   # User profile management
│   ├── serviceRoutes.js   # Service management
│   └── workerRoutes.js    # Worker management
├── services/               # Business logic
│   └── notificationService.js # Notification creation and management
├── views/                  # EJS templates
│   ├── index.ejs          # Home page
│   ├── layout.ejs         # Main layout with navigation
│   ├── profile.ejs        # User profile page
│   ├── dashboard/         # Dashboard views
│   └── ...                # Other page templates
├── public/                 # Static files
│   ├── css/               # CSS stylesheets
│   │   └── card-styles.css # Modern card styles
│   ├── js/                # JavaScript files
│   ├── style-modern.css   # Main design system styles
│   ├── profile.css        # Profile page styles
│   └── languages/         # Language files
│       ├── en.js          # English translations
│       ├── hi.js          # Hindi translations
│       └── mr.js          # Marathi translations
├── server.js               # Express server entry point
└── package.json            # Project dependencies and scripts

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher, v22+ recommended)
- MongoDB (local or Atlas)
- npm (or yarn)

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd WorkConnect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your configuration:
     ```env
     NODE_ENV=development
     PORT=3000
     MONGODB_URI=mongodb://127.0.0.1:27017/workconnect
     SESSION_SECRET=your-session-secret-key
     STRIPE_SECRET_KEY=your-stripe-key
 
     ```
  

4. **Start MongoDB:**
   - If running locally, start your MongoDB server:
     ```bash
     mongod
     ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Access the app:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

7. **Note on Deprecation Warnings:**
   - If you encounter Node.js deprecation warnings, you can suppress them by starting the app with:
     ```bash
     # For development
     NODE_OPTIONS="--no-deprecation" npm run dev
     
     # For production
     NODE_OPTIONS="--no-deprecation" npm start
     ```
   - Alternatively, you can use the `--trace-deprecation` flag to identify the source of warnings

## 📋 Available Scripts

```bash
# Start in development mode (with nodemon)
npm run dev

# Start in production mode
npm start
```

## 🌟 Core Features

### 🌐 Multilingual Support
- **Three Languages**: English, Hindi (हिंदी), and Marathi (मराठी)
- **Dynamic Switching**: Change language without page reload
- **Persistent Selection**: Language preference saved in localStorage
- **Complete Coverage**: All UI elements and content translated

### 💰 Request Management System
- **Client Requests**: Send service requests with date, time, and requirements
- **Worker Actions**: Accept or reject requests directly from notifications
- **Request History**: Track previous requests and their status
- **Re-requesting**: Allow new requests after rejection
- **Flexible Requirements**: Custom requirements with date/time specification

### 🔔 Real-time Notification System
- **Instant Updates**: Real-time notifications using Socket.IO
- **Action Buttons**: Accept/reject requests directly from notifications
- **Smart Cleanup**: Automatic notification removal after actions
- **Priority Levels**: Urgent, high, medium, and low priority notifications
- **Mobile Optimized**: Responsive notification dropdown

### 👥 Professional Services
- **Worker Registration**: Add profiles with specific skills and location
- **Service Creation**: Create and manage service requests
- **Request System**: Handle service requests between clients and workers
- **Status Tracking**: Real-time status updates for all operations

### 📱 Mobile-First Design
- **Responsive Navigation**: Optimized for all screen sizes
- **Touch-Friendly**: Mobile-optimized interface
- **Language Selector**: Compact language switcher on mobile
- **Notification System**: Mobile-friendly notification handling

### ✨ Enhanced User Interface
- **Comprehensive Icon Integration**: Font Awesome icons throughout the application
- **Contextual Visual Elements**: Icons that match their function and context
- **Enhanced Search Experience**: Improved search input with embedded search icon
- **Visual Consistency**: Unified icon styling with consistent colors and spacing
- **Interactive Feedback**: Hover effects and contextual colors for better UX
- **Form Enhancement**: Icons in form labels, buttons, and action elements
- **Navigation Clarity**: Clear visual indicators for all navigation elements
- **Status Visualization**: Color-coded icons for different statuses and actions
- **Modern Styling**: Completely refreshed UI with updated typography and component designs
- **Refined Visual Hierarchy**: Improved spacing and sizing for better content organization

### 🤖 AI Chat Assistant
- **Intelligent Support**: AI-powered chatbot for answering user questions
- **Context-Aware Responses**: Different responses based on user authentication status
- **Floating Button**: Accessible chat button visible on all pages when logged in
- **Dedicated Page**: Full-featured chat interface with conversation history
- **Smart Help Topics**: Quick access to common help topics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛣️ Application Routes

### Public Routes
- `/` - Home page with workers and services
- `/search` - Search functionality
- `/auth/login` - User login
- `/auth/signup` - User registration

### Client Routes
- `/dashboard/client` - Client dashboard with incoming requests
- `/services/add` - Add new service request
- `/services/my` - View own service requests
- `/services/:id/edit` - Edit service request
- `/dashboard/track/:requestId` - Track service

### Worker Routes
- `/dashboard/worker` - Worker dashboard with available services
- `/workers/add` - Add new worker profile
- `/workers/my` - View own worker profiles
- `/workers/:id/edit` - Edit worker profile
- `/dashboard/track/:requestId` - Track service

### Shared Routes
- `/chatbot` - AI chat assistant interface
- `/notifications/view` - View all notifications
- `/payments/request/:requestId` - Payment processing

## 🔄 Real-time Features

### Socket.IO Events
- `joinUser` - Join user's notification room
- `newNotification` - Send new notifications
- `locationUpdate` - Send location updates (for tracking)
- `stopTracking` - Stop location tracking

### Live Features
- **Real-time Notifications**: Instant notification delivery
- **Live Updates**: Real-time status changes
- **Request Management**: Live request acceptance/rejection
- **Service Processing**: Instant request handling

## 🌍 Language System

### Supported Languages
1. **English** 🇺🇸 - Default language
2. **Hindi** 🇮🇳 - हिंदी support
3. **Marathi** 🇮🇳 - मराठी support

### Language Features
- **Dynamic Content**: All text elements translated
- **Persistent Storage**: Language preference saved
- **Mobile Optimized**: Compact language selector
- **Native Names**: Display in native script

## 🎨 Icon System & Visual Design

### Font Awesome Integration
- **Comprehensive Coverage**: Icons added to all major UI elements
- **Contextual Design**: Icons that semantically match their function
- **Consistent Styling**: Unified color scheme and spacing across the application
- **Interactive Feedback**: Hover effects and contextual colors for better UX

### Icon Categories
- **Navigation Icons**: Home, dashboard, profile, and action icons
- **Form Icons**: Labels, buttons, and input field indicators
- **Status Icons**: Color-coded icons for different states and actions
- **Action Icons**: Buttons and interactive elements with clear visual cues
- **Dashboard Icons**: Role-specific icons for client and worker dashboards

### Visual Enhancements
- **Enhanced Search**: Search input with embedded search icon
- **Form Clarity**: Icons in form labels for better understanding
- **Button Design**: Action buttons with relevant icons and hover effects
- **Status Visualization**: Color-coded icons for pending, accepted, rejected, and completed states
- **Mobile Optimization**: All icon enhancements optimized for mobile devices

## 📱 Mobile Experience

The application is built with a mobile-first approach:
- **Responsive Navigation**: Adapts to all screen sizes
- **Touch-Friendly Interface**: Optimized for mobile devices
- **Language Support**: Easy language switching on mobile
- **Notification System**: Mobile-optimized notifications
- **Request Management**: Full functionality on mobile devices

## 🔐 Authentication & Security

- **Session-based Authentication**: Secure user sessions
- **Role-based Access Control**: Client/Worker permissions
- **Protected Routes**: Middleware-based route protection
- **Secure Sessions**: Extended session management
- **Input Validation**: Server-side validation for all inputs

## 💳 Payment System

- **Stripe Integration**: Secure payment processing
- **Request-based Payments**: Payment for specific service requests
- **Secure Transactions**: PCI-compliant payment handling
- **Payment History**: Track all payment transactions

## 🚀 Production Deployment

### 1. Set Environment Variables
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your-production-mongodb-uri
STRIPE_SECRET_KEY=your-production-stripe-key
```

### 2. Start Production Server
```bash
npm start
```

### 3. Process Management
Consider using PM2 or similar process manager for production:
```bash
npm install -g pm2
pm2 start server.js --name "workconnect"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Test thoroughly before submitting
- Update documentation for new features
- Ensure mobile responsiveness
- Add language support for new features
- Separate heavy features into modular CSS/JS files

## 📝 License

This project is licensed under the ISC License.

## 📞 Contact & Support

For support, questions, or feature requests:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v3.2.0 - Feature Removal (Latest)
- **🔇 Voice Control Removed**: Complete removal of voice control system and all related functionality
- **🔄 Loading Animations Removed**: Removed full-screen loading animations for faster page transitions
- **🧹 Code Cleanup**: Removed unused voice control and animation code for improved performance

### v3.1.0 - UI Refresh
- **🎨 Complete UI Redesign**: Modern styling with updated typography and component designs
- **📏 Size Adjustments**: Updated button sizes, card layouts, and spacing for improved visual hierarchy
- **✨ Enhanced Visual Design**: Refined navigation, forms, and dashboard layouts for better user experience
- **🌈 Consistent Color Palette**: Maintained light orange color scheme throughout the application
- **📱 Improved Responsiveness**: Enhanced mobile experience with better touch targets and layouts

### v3.0.0 - Consultancy Platform Conversion
- **👥 Role Conversion**: Converted shippers to clients and transporters to workers
- **💼 Service Model**: Workers register with specific skills and location instead of vehicle details
- **🔍 Skill-based Search**: Clients can search for workers by skills and location
- **📬 Request System**: Clients send requests to workers with date, time, and requirements
- **🤝 Accept/Reject Workflow**: Workers can accept or reject requests from clients
- **🗺️ Location Mapping**: Display worker locations on map and show distance between client and worker
- **📍 Real-time Tracking**: Live location sharing between client and worker during service
- **💳 Payment Processing**: Demo payment system after service completion
- **📱 Mobile Responsive**: Fully responsive design for all device sizes
- **🌐 Multilingual**: Support for English, Hindi, and Marathi languages

### v2.8.0 - Enhanced Voice Response System *(Removed in v3.2.0)*
- **🎤 Website Interaction Voice**: Added voice feedback for all website interactions (form submissions, button clicks, navigation)
- **🎛️ Voice Settings Panel**: Dedicated UI for configuring voice response preferences with toggle switches
- **⌨️ Keyboard Shortcut**: Ctrl+Shift+V to quickly access voice settings
- **🔊 Smart Announcements**: Page load announcements, notification alerts, and error/success message announcements
- **🎯 Context-Aware Responses**: Different voice responses based on user actions and page context
- **🔇 Spam Prevention**: Randomized voice feedback to prevent overwhelming users
- **🔄 Form Field Guidance**: Voice hints for form fields based on labels
- **🔧 MutationObserver Integration**: Real-time detection of dynamic content changes for voice announcements

### v2.7.0 - Voice Control Integration *(Removed in v3.2.0)*
- **🎤 Voice Control**: Complete hands-free voice command system with Google Gemini AI
- **🤖 Gemini AI Integration**: Intelligent intent detection and natural language understanding
- **🌐 Multi-Language Voice**: English, Hindi, and Marathi voice commands with automatic translation
- **🗣️ Wake Word**: "Hey AADI" activation with continuous background listening
- **🎯 Smart Matching**: Levenshtein distance algorithm + Gemini AI for command auto-correction
- **🔄 Auto Language Detection**: Switches voice recognition based on UI language (en-US, hi-IN, mr-IN)
- **📍 Navigation**: Voice commands for all major pages and features
- **💬 Voice Feedback**: Text-to-speech responses for user confirmation
- **🎨 Modern UI**: Glassmorphic overlay with real-time transcript and wave animations
- **📱 Responsive**: Full mobile support with optimized touch and voice interactions
- **🔧 Modular Code**: Separated voice control CSS into dedicated file (735 lines)
- **⚡ Performance**: Optimized recognition with dual instances + Gemini AI fallback

### v2.5.0 - Chat Assistant & UI Improvements
- **🤖 AI Chat Assistant**: Added intelligent chatbot for user support and guidance
- **💬 Chat Interface**: Floating chat button and dedicated assistant page
- **🧠 Smart Responses**: Context-aware responses for common user queries
- **👤 Conditional UI**: Assistant options adapt based on user login status
- **🎨 UI Enhancements**: Improved chat interface with modern styling
- **🔄 Conversation History**: Persistent chat history storage
- **📱 Responsive Chat**: Mobile-optimized chat interface
- **🧹 Navbar Cleanup**: Removed assistant link from navbar for cleaner navigation

### v2.4.0 - Dependency Updates & Deprecation Fixes
- **🔧 Node.js Compatibility**: Fixed Node.js deprecation warnings for better compatibility with Node.js v22+
- **⚙️ Dependency Updates**: Updated dependencies to latest versions for improved security and performance
- **🐛 Bug Fixes**: Resolved 404 error when accessing service details from search results
- **🔐 Authentication Improvements**: Enhanced error handling for login with user-friendly messages
- **🎨 UI Enhancements**: Added alert styles for better error message display
- **🔒 Security Fix**: Fixed unauthorized service deletion vulnerability by adding proper ownership checks

### v2.3.0 - Card Styles & Loading Animations
- **🎴 Modern Card Styles**: Added refined card designs with improved visual hierarchy
- **🔄 Loading Animations**: Implemented full-screen loading animation for page transitions
- **✨ Enhanced Detail Pages**: Improved service and worker detail pages with modern styling
- **📱 Responsive Cards**: Ensured card styles work seamlessly across all device sizes
- **🎨 Status Badges**: Added color-coded status badges for different service/worker statuses
- **🚀 Transition Effects**: Smooth animations for cards and page loading
- **🔍 Visual Feedback**: Better user feedback during navigation and data loading
- **📊 Consistent Information Display**: Standardized information display with icons

### v2.2.0 - Enhanced User Interface & Icons
- **🎨 Comprehensive Icon Integration**: Added Font Awesome icons throughout the application
- **🔍 Enhanced Search Interface**: Improved search input with embedded search icon
- **📱 Navigation Improvements**: Added contextual icons to all navigation elements
- **🎯 Dashboard Enhancements**: Enhanced dashboards with relevant icons
- **📝 Form Improvements**: Added icons to form labels and action buttons
- **🎨 Visual Consistency**: Implemented consistent icon styling and colors
- **✨ Interactive Elements**: Added hover effects and contextual feedback
- **📱 Mobile Optimization**: Ensured seamless icon experience on mobile

### v2.1.0 - Profile Management
- **👤 User Profile System**: Complete profile management with account settings
- **📊 Booking History**: Role-specific booking history for workers and clients
- **🔐 Account Security**: Password change and account deletion functionality
- **🔔 Flash Notifications**: Improved user feedback with flash messages
- **🎨 Enhanced UI**: Responsive profile design with modern styling

### v2.0.0 - Major Feature Release
- **🌐 Multilingual Support**: Added English, Hindi, and Marathi
- **💰 Request Management**: Complete request system with accept/reject
- **🔔 Enhanced Notifications**: Real-time notifications with actions
- **📱 Mobile Improvements**: Better mobile experience
- **🔄 Smart Cleanup**: Automatic notification management
- **🎯 Dashboard Enhancements**: Improved role-based dashboards

### v1.1.0 - Enhanced Features
- Real-time location tracking with Socket.IO
- Leaflet maps for service tracking
- Location autocomplete with geocoding
- Enhanced mobile responsiveness
- Route optimization with OSRM
- Improved user experience

### v1.0.0 - Initial Release
- EJS-based frontend
- Session-based authentication
- Basic service management
- Responsive design

## 🎯 SEO Features

### Meta Tags
- **Primary Meta Tags**: Title, description, keywords, and author information
- **Open Graph Tags**: Facebook and social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing with rich previews
- **Canonical URLs**: Proper URL canonicalization for search engines
- **Robots Meta**: Control over search engine crawling and indexing

### Performance Optimization
- **Preconnect**: Faster external resource loading
- **DNS Prefetch**: Reduced latency for external domains
- **Font Optimization**: Optimized Google Fonts loading
- **Asset Optimization**: Efficient CSS and JavaScript loading

### Accessibility
- **Reduced Motion Support**: Respects user motion preferences
- **Semantic HTML**: Proper HTML structure for screen readers
- **ARIA Labels**: Enhanced accessibility for assistive technologies
- **Smooth Scrolling**: Improved navigation experience

## ⚡ Performance Features

- **Smooth Scrolling**: CSS-based smooth scrolling behavior
- **Optimized Loading**: Preconnect and DNS prefetch for faster loads
- **Efficient Animations**: Respects user motion preferences
- **Asset Optimization**: Optimized CSS and JavaScript delivery
- **Font Loading**: Optimized Google Fonts integration

---
**WorkConnect** - Connecting clients and workers across India with a modern, multilingual, SEO-optimized platform. 👥✨
