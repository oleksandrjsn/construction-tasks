# Construction Tasks Management

A modern web application for managing construction tasks with interactive blueprint visualization, built with React, TypeScript, and RxDB for offline-first data management.

## Features

- **Interactive Blueprint Canvas**: Place and manage tasks directly on construction blueprints
- **Task Management**: Create, update, and track construction tasks with different statuses
- **Checklist System**: Detailed checklists for each task with item-level tracking
- **Offline-First**: Local data storage with RxDB and browser localStorage
- **PWA Support**: Progressive Web App capabilities for mobile and desktop
- **User Authentication**: Session-based authentication system
- **Responsive Design**: Built with Tailwind CSS for mobile-first responsive design

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Zustand
- **Database**: RxDB with localStorage adapter
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **PWA**: Vite PWA plugin
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/oleksandrjsn/construction-tasks.git
   cd construction-tasks
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

To start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

To build the application for production:

```bash
npm run build
```

This will:

- Compile TypeScript files
- Bundle the application with Vite
- Generate service worker for PWA
- Output files to the `dist` directory

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Linting

To run ESLint and check for code quality issues:

```bash
npm run lint
```

## Project Structure

```
src/
├── app/                    # Application core
│   ├── layouts/           # Layout components
│   ├── providers/         # React context providers
│   ├── router/            # Route configuration
│   └── store/             # Global state management
├── entities/              # Business entities
│   ├── checklist/         # Checklist domain
│   ├── task/              # Task domain
│   └── user/              # User domain
├── pages/                 # Page components
│   ├── blueprint/         # Blueprint page
│   ├── dashboard/         # Dashboard page
│   └── login/             # Login page
├── shared/                # Shared utilities
│   ├── config/            # Configuration files
│   ├── lib/               # Utility libraries
│   └── ui/                # Reusable UI components
└── widgets/               # Complex UI widgets
```

## Key Features Explanation

### Database Layer

The application uses RxDB with localStorage adapter for offline-first functionality. Database schemas are defined for:

- **Users**: Authentication and user management
- **Tasks**: Construction tasks with status tracking
- **Checklists**: Task-related checklists
- **Checklist Items**: Individual checklist items

### Authentication

Session-based authentication system that persists user sessions across browser refreshes.

### Task Management

Tasks can be created, updated, and tracked with various statuses:

- Not Started
- In Progress
- Blocked
- Final Check
- Completed

### Blueprint Integration

Interactive canvas where tasks can be positioned on construction blueprints for visual project management.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## PWA Features

The application is configured as a Progressive Web App with:

- Service worker for caching
- Offline functionality
- App manifest for installability
- Auto-update capabilities

## Development Time Tracking

### 1. **Project Setup & Architecture** (~3-4 hours)

- Vite + React + TypeScript configuration
- ESLint setup and configuration
- Tailwind CSS 4 integration
- PWA configuration with service worker
- Folder structure setup (FSD-like architecture)

### 2. **Database Layer + State Management** (~4-5 hours)

- RxDB setup with localStorage adapter
- Database schemas creation (users, tasks, checklists, checklist items)
- Database singleton class with initialization methods
- Factory pattern for repositories and services
- Custom hooks for tasks, checklists, and checklist items management

### 3. **UI Component System** (~6-7 hours)

- Core components: Button (with variants), Input, Dialog, Typography
- Advanced components: Accordion, Chip, IconButton
- Utility components: Loader, Toast, Error boundary, Overlay
- Icon system (multiple icons including DeleteIcon)
- ConfirmationDialog with full configuration options
- withConfirmation HOC with proper TypeScript typing
- Responsive design and Tailwind styling

### 4. **Authentication System** (~2-3 hours)

- Auth provider with React context
- Session-based authentication
- Login page with form validation
- User service and repository
- Route protection logic

### 5. **Task Management Features** (~3-4 hours)

- Task entities with full CRUD operations
- Task status management (not_started, in_progress, blocked, final_check, completed)
- Dashboard page with task display and status chips
- Task dialog for creation/editing
- Checklist system with items and StatusChangeDialog

### 6. **Blueprint Canvas** (~2-3 hours)

- Interactive canvas for task placement on blueprints
- Task markers and layers
- Blueprint page with canvas component
- Visual task positioning system

### 7. **Layout & Navigation** (~1-2 hours)

- MainLayout and AuthLayout components
- Navigation widgets
- User menu implementation
- Routing with React Router v7

## Areas for Future Refactoring

### 1. User Input Validation

- Implement real-time form validation with libraries like Zod
- Add comprehensive input validation with proper error messaging

### 2. DB & Performance Optimization

- Improve conflict resolution algorithms (currently using basic implementation)
- Implement database indexing for better query performance

### 3. UI/UX Enhancements

- Create a comprehensive design system with consistent spacing, colors, and typography
- Improve accessibility with proper ARIA attributes and roles, keyboard navigation, focus management
- Improve mobile responsiveness
- Add loading states such as skeleton screens for better UX during data fetching
- Add animation and transitions for UI interactions
- Implement zoom and pan functionality on the blueprint canvas for better navigation

### 4. Notifications

- Add live notifications when tasks are updated in background
- Every successful/failed operation should trigger a toast notification

### 5. Testing

- Implement unit tests

## Demo Video

[To be added: Link to demonstration video showing the application features]
