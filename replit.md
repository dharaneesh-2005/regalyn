# Regalyn E-commerce Platform

## Overview

Regalyn is a full-stack e-commerce platform for luxury timepieces, built with a modern tech stack combining React frontend, Express.js backend, and PostgreSQL database. The application supports product management, shopping cart functionality, order processing with Razorpay payments, and comprehensive admin management features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state, React Context for local state
- **UI Components**: Custom component library built with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **Build Tool**: Vite for fast development and optimized builds
- **Animation**: Framer Motion for smooth UI animations

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local strategy and session management
- **File Structure**: Monorepo structure with shared schemas between client and server

### Database Design
- **Primary Database**: PostgreSQL (Neon hosted)
- **Schema Management**: Drizzle migrations with TypeScript schemas
- **Key Tables**: users, products, cart_items, orders, order_items, contacts, settings
- **Data Validation**: Zod schemas for runtime type checking

## Key Components

### Product Management
- Full CRUD operations for products with image galleries
- Category-based organization and featured product system
- Weight-based pricing variants and stock management
- Product reviews and ratings system
- SEO-friendly slugs and metadata

### Shopping Cart System
- Session-based cart persistence for guest users
- Real-time cart updates with optimistic UI
- Weight variant selection and quantity management
- Cart summary calculations with shipping and tax

### Order Processing
- Razorpay payment gateway integration
- Order status tracking with email notifications
- Shipping address management
- Order history and tracking ID system

### Admin Dashboard
- Secure admin authentication with session management
- Product management with bulk operations
- Order management with status updates
- Contact form submissions handling
- Real-time analytics and reporting

### Email System
- Brevo SMTP integration for transactional emails
- Order confirmation and shipping notifications
- HTML email templates with responsive design
- Contact form submission notifications

## Data Flow

1. **User Interaction**: Frontend React components capture user actions
2. **State Management**: React Query manages server state with optimistic updates
3. **API Layer**: Express.js routes handle business logic and validation
4. **Database Operations**: Drizzle ORM executes type-safe database queries
5. **Response Handling**: JSON responses with proper error handling and status codes

## External Dependencies

### Payment Processing
- **Razorpay**: Complete payment gateway with INR support
- **Security**: Payment signature verification and webhook handling

### Email Services
- **Brevo (formerly Sendinblue)**: SMTP relay for transactional emails
- **Templates**: Custom HTML email templates for order notifications

### Database Hosting
- **Neon**: PostgreSQL-compatible serverless database
- **Connection Pooling**: Optimized connection management for serverless deployment

### Development Tools
- **TypeScript**: Full type safety across the entire stack
- **ESLint/Prettier**: Code quality and formatting
- **Vite**: Fast development server with HMR

## Deployment Strategy

### Replit Deployment
- **Primary Platform**: Replit with autoscale deployment target
- **Build Process**: npm run build compiles both client and server
- **Runtime**: Node.js 20 with PostgreSQL 16 module
- **Environment**: Production environment variables with secure key management

### Build Configuration
- **Client Build**: Vite builds optimized React SPA to dist/public
- **Server Build**: esbuild bundles TypeScript server to dist/index.js
- **Asset Handling**: Static assets served from public directory

### Environment Management
- **Development**: Local .env file with development database
- **Production**: Environment variables injected at runtime
- **Security**: Sensitive keys (RAZORPAY_KEY_SECRET, DATABASE_URL) stored securely

## Changelog

- June 19, 2025. Integrated Shiprocket shipping service with manual order creation from admin panel
- June 18, 2025. Initial setup

## Recent Changes

- **June 23, 2025**: Complete modern typography implementation across entire website
- Updated font system to use Inter (sans-serif), Orbitron (display/headers), and Space Grotesk (monospace) 
- Implemented font-display class for headers with enhanced letter spacing and tracking
- Added font-mono class for taglines and special text elements
- Updated all headings, body text, and UI elements with new modern typography
- Enhanced Tailwind configuration with proper font family definitions
- Added font feature settings and optical sizing for improved text rendering
- **Status**: All text throughout the website now uses modern, sophisticated typography

- **June 23, 2025**: Updated favicon and web app manifest to current Regalyn branding
- Replaced favicon with current Regalyn logo in PNG and ICO formats
- Updated manifest.json with luxury timepiece branding and descriptions
- Changed theme colors to match purple aesthetic (#a855f7)
- **Status**: Complete branding consistency across browser interface

- **June 23, 2025**: Comprehensive animation and effects enhancement across entire web project
- Upgraded LogoLoader with quantum-inspired design featuring multiple rotating rings and particle effects
- Enhanced Home page with advanced particle systems, energy lines, and sophisticated button animations
- Improved ProductCard components with 3D hover effects, particle bursts, and enhanced glow animations
- Updated Layout component with larger animated background orbs and floating particle systems
- Enhanced Header with advanced particle effects, holographic logo animations, and energy line backgrounds
- Upgraded Footer with enhanced background effects, improved brand animations, and sophisticated particle systems
- Implemented spring-based transitions, multiple animation layers, and coordinated visual effects
- Added advanced gradient animations, text shadow effects, and dynamic color transitions
- Fixed all Framer Motion animation errors for smooth performance
- **Status**: All components now feature modern, sophisticated animations with quantum-themed visual effects

- **June 23, 2025**: Implemented unified 2FA authentication system for admin dashboard
- Created single login form with username + password + 2FA code for streamlined access
- Fixed 2FA verification issues with direct middleware-free endpoint implementation
- Added comprehensive Google Authenticator/Authy integration with QR code setup
- Implemented persistent secret storage in environment variables for production use
- **Status**: 2FA system ready for one-time setup and subsequent logins with unified form

- **June 23, 2025**: Complete futuristic UI transformation with cutting-edge design
- Updated theme to vibrant purple primary (hsl(280, 100%, 70%)) with advanced gradient systems
- Implemented ultra-modern floating navbar with glassmorphism, particle effects, and advanced animations
- Created futuristic hero section with quantum-inspired particle systems and advanced background effects
- Redesigned product cards with 3D hover effects, animated glow systems, and holographic overlays
- Added comprehensive background animation system with floating orbs and dynamic particle effects
- Implemented advanced gradient animations throughout all components with animated text effects
- Created futuristic footer with animated social links and quantum-themed content
- Added cursor follower effects and advanced interaction animations

## User Preferences

Preferred communication style: Simple, everyday language.