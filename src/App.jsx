import './style.css';
import Header from './header';
import Hello from './hello';
import Footer from './footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex items-center justify-center background-theme">
        <Hello />
      </div>
      <Footer />
    </div>
  );
}

export default App;