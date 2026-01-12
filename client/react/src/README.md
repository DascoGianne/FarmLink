# FarmLink - My Listings Dashboard

A responsive, production-ready web application for managing agricultural product listings. This application features a clean, modern interface built with React and Tailwind CSS, designed to be easily convertible to static HTML.

## Features

- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Collapsible Sidebar**: Mobile-friendly navigation with hamburger menu
- **Data Table**: Clean listing table with sortable columns
- **Filtering System**: Multiple filters for category, status, and price
- **Search Functionality**: Quick search across listings
- **CRUD Operations**: Edit and delete functionality for each listing
- **Status Management**: Dropdown status selector for each item
- **Modern UI**: Clean design with shadow effects, rounded corners, and smooth transitions

## Project Structure

```
/
├── App.tsx                      # Main application component
├── components/
│   ├── Sidebar.tsx             # Left navigation sidebar
│   ├── Header.tsx              # Top navigation header
│   ├── FilterBar.tsx           # Filter and search bar
│   └── ListingsTable.tsx       # Main data table
├── imports/                     # Figma imported assets
│   ├── NgosLisiting.tsx        # Original Figma export
│   └── svg-sdz3iahrhr.ts       # SVG paths
└── styles/
    └── globals.css             # Global styles and Tailwind config
```

## Components Overview

### App.tsx
Main application wrapper that combines all components in a flex layout.

### Sidebar.tsx
- Collapsible navigation menu
- User profile section
- Menu items with icons and badges
- Mobile-responsive with overlay

### Header.tsx
- Navigation tabs (HOME, MARKETPLACE, MY LISTINGS)
- Add New button
- Active tab indicator

### FilterBar.tsx
- Category filter dropdown
- Status filter dropdown
- Price range filter
- Search input field

### ListingsTable.tsx
- Desktop table view with sortable columns
- Mobile card view for better responsiveness
- Inline status editing
- Edit and delete actions per row

## Responsive Breakpoints

- **Mobile**: < 768px (Card layout)
- **Tablet**: 768px - 1024px (Compact table)
- **Desktop**: > 1024px (Full table layout)

## Converting to Static HTML

This React application is structured to be easily convertible to static HTML:

1. **Semantic HTML**: All components use semantic HTML5 elements
2. **Tailwind CSS**: All styling is done via utility classes
3. **No Complex State**: Simple state management that can be replaced with vanilla JS
4. **Modular Components**: Each component can be extracted as a standalone HTML file

### Conversion Steps:

1. **Extract JSX to HTML**: Convert JSX syntax to standard HTML
2. **Replace React Hooks**: Convert `useState` to vanilla JavaScript variables
3. **Event Handlers**: Convert `onClick` handlers to standard `onclick` attributes
4. **Component Props**: Replace with template literals or direct values
5. **Image Imports**: Convert Figma asset imports to standard `<img>` tags with CDN URLs

### Example Conversion:

**React:**
```jsx
<button onClick={() => setIsOpen(!isOpen)} className="bg-green-500">
  Menu
</button>
```

**HTML:**
```html
<button onclick="toggleMenu()" class="bg-green-500">
  Menu
</button>
```

## Color Palette

- **Primary Green**: `#32a928`, `#5eb14e`
- **Secondary Green**: `#38b016`, `#65cb1c`
- **Background**: `#f2f2f2`, `#ffffff`
- **Text**: `#353535`, `#474747`, `#969696`

## Typography

- **Font Family**: Poppins (via Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

This application is built with:
- React 18+
- Tailwind CSS 4.0
- TypeScript
- Modern CSS features (flexbox, grid, custom properties)

## Notes

- All images are imported from Figma assets using the `figma:asset` scheme
- The design maintains the original Figma design system
- All interactive elements include hover states and transitions
- The application is production-ready and optimized for performance
