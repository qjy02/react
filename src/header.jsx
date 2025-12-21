import './style.css';

// Header Component
function Header() {
  return (
    <header className="center header-theme p-4">
        <a href="/">
            <img 
                src='/Vispiv.png' 
                alt='Vispiv Logo' 
                className='h-12 sm:h-16 mr-4 cursor-pointer' 
            />
        </a>
        <h2 className="text-2xl font-bold font-patrick">My React App</h2>
    </header>
  );
}

export default Header;
