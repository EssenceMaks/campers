# Campers - Your Perfect Travel Companion

A modern React application for booking and managing camper van rentals. Built with React, Redux, and Vite.

## Features

- 🚐 Browse available camper vans
- 🔍 Advanced search and filtering
- ❤️ Save favorites
- 📅 Easy booking system
- 📱 Responsive design
- 🎨 Modern UI/UX

## Technologies Used

- React 18
- Redux Toolkit for state management
- React Router for navigation
- CSS Modules for styling
- React DatePicker for date selection
- React Toastify for notifications
- Vite for build tooling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/EssenceMaks/campers.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── assets/                # Static assets
│   ├── icons/            # SVG icons
│   └── images/           # Images and graphics
│
├── components/           # Shared components
│   ├── Gallery/         # Image gallery component
│   │   ├── Gallery.jsx
│   │   └── Gallery.module.css
│   ├── Header/          # App header component
│   │   ├── Header.jsx
│   │   └── Header.module.css
│   └── Icon/            # Icon component
│       ├── Icon.jsx
│       └── Icon.module.css
│
├── pages/               # Page components
│   ├── CamperDetail/   # Single camper view
│   │   ├── CamperDetail.jsx
│   │   └── CamperDetail.module.css
│   ├── Catalog/        # Campers catalog
│   │   ├── Catalog.jsx
│   │   └── Catalog.module.css
│   ├── Favorits/       # Favorites page
│   │   ├── Favorits.jsx
│   │   └── Favorits.module.css
│   └── Home/           # Homepage
│       ├── Home.jsx
│       └── Home.module.css
│
├── redux/              # Redux state management
│   ├── slices/        # Redux slices
│   │   ├── campersSlice.js
│   │   ├── favoritesSlice.js
│   │   ├── filtersSlice.js
│   │   └── locationsSlice.js
│   └── store.js       # Redux store configuration
│
├── styles/            # Global styles
│   └── colors.css    # Color variables
│
├── App.jsx           # Root App component
├── App.css           # App-level styles
├── main.jsx         # Application entry point
└── index.css        # Global CSS reset and base styles
```

## Features in Detail

### Camper Listings
- View all available campers
- Filter by various criteria
- Sort by price and ratings

### Favorites
- Save campers to favorites
- Manage favorite listings
- Quick access to saved items

### Booking System
- Select dates
- Fill in booking details
- Receive confirmation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License
