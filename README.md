# React Project
This is a simple React project that includes a header and footer component with custom styling.

## Components
- **Header**: A header component styled with a gradient background and shadow effects.
- **Footer**: A footer component styled similarly to the header.

## Styling
The project uses CSS variables for consistent theming, including colors for backgrounds, text, and shadows across the components.
The styles are defined in `style.css` and applied to the header and footer components.

## Usage
To use the components, simply import them into your React application and include them in your JSX.
```jsx
import Header from './header';
import Footer from './footer';
function App() {
  return (
    <div>
      <Header />
      {/* Your main content goes here */}
      <Footer />
    </div>
  );
}
export default App;
```

## Installation
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the development server with `npm start`.

## License
This project is licensed under the MIT License.