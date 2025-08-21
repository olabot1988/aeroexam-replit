# Aviation Maintenance Examination App

## Overview

This is a digital aviation maintenance examination platform designed to replace traditional hand-written annual examinations for aviation mechanics. The application provides a secure, timed testing environment that ensures regulatory compliance while offering a streamlined user experience. The system supports multiple maintenance levels (ML0-ML4), different exam types (Annual, Technical Inspector, CDR Progression), and maintains comprehensive tracking of exam sessions and results.

**New Feature:** The platform now includes an admin panel for question management, allowing authorized users to create, edit, and delete exam questions across all maintenance levels and categories.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom aviation-themed color palette
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database Layer**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: In-memory storage with fallback to database persistence
- **API Design**: RESTful endpoints for exam session management
- **Validation**: Zod schemas shared between client and server

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured via Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared TypeScript types between frontend and backend
- **Tables**: Users, exam sessions, questions, and exam results
- **Session Storage**: Temporary in-memory storage for active exam sessions

### Authentication and Authorization
- **Session-based**: Simple password-based exam session access
- **No Traditional Auth**: Uses last name + password combinations for exam continuation
- **Session Keys**: UUID-based session identification for secure exam access
- **Data Protection**: Exam answers and progress stored securely per session

### External Dependencies
- **Database**: Neon Database (PostgreSQL-compatible serverless database)
- **Hosting**: Replit deployment environment
- **UI Library**: Radix UI for accessible component primitives
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Inter font family for professional typography
- **Development**: ESBuild for production bundling, TSX for development server

### Key Architectural Decisions

**Shared Schema Design**: Uses a monorepo structure with shared TypeScript schemas between client and server, ensuring type safety and reducing duplication.

**Memory + Database Hybrid**: Implements both in-memory storage for development/testing and database persistence for production, providing flexibility and performance.

**Component-Driven UI**: Leverages Radix UI primitives with custom styling for accessibility compliance and consistent user experience.

**Session-Based Exam Flow**: Designed around exam sessions rather than user accounts, allowing for anonymous testing with secure session management.

**Real-time Exam Features**: Includes countdown timers, progress tracking, question flagging, and automatic submission to meet regulatory examination requirements.

**Admin Question Management**: Separate admin interface with authentication for managing exam questions, including CRUD operations with filtering and search capabilities.

### Recent Changes (August 21, 2025)

**Multiple Difficulty Level Support**: Successfully implemented the ability to assign questions to multiple ML difficulty levels:
- Updated database schema from single `difficulty` field to `difficulties` array
- Modified question creation forms to use checkboxes for multiple ML level selection
- Enhanced question display to show multiple difficulty badges
- Maintained backward compatibility with existing questions
- Fixed database constraint issues during migration

**Admin Panel Implementation**: Added comprehensive question management system with the following features:
- Admin authentication (demo credentials: admin/admin123)
- Question listing with search and filtering by difficulty level and category
- Create new questions with multiple choice options (2-4 choices)
- Edit existing questions with form validation
- Delete questions with confirmation dialogs
- Visual indicators for correct answers and difficulty levels
- Professional admin interface matching aviation theme

**Results Page Fix**: Resolved issue where exam results were not displaying properly:
- Fixed data structure mismatch between API response and frontend expectations
- Improved error handling and data extraction
- Exam results now display correctly with pass/fail status and detailed scores

**New Routes Added**:
- `/admin-login` - Admin authentication
- `/admin/questions` - Question management dashboard
- `/admin/questions/new` - Create new question
- `/admin/questions/:id/edit` - Edit existing question

**Enhanced Storage Interface**: Extended storage layer to support question CRUD operations including getAllQuestions, getQuestionById, updateQuestion, and deleteQuestion methods.

**Updated Exam Requirements (Latest Changes)**:
- Time limit increased from 60 minutes to 8 hours for all examinations
- Minimum passing score standardized to 90% for all exam types (previously 70% for some)
- Time display format updated to show hours when applicable (H:MM:SS format)
- Updated warning thresholds for remaining time alerts