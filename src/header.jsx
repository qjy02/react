import './style.css';

// Header Component
function Header() {
  return (
    <header className="center header-theme p-4">
        <a href="https://qjy02.github.io/vispiv/" target="_blank" rel="noopener noreferrer">
            <img 
                src='icon/Vispiv.png'
                alt='Vispiv Logo' 
                className='h-12 sm:h-16 mr-4 cursor-pointer' 
            />
        </a>
        <a href="/react/"><h2 className="text-2xl font-bold font-patrick">Vipo Playground</h2></a>
    </header>
  );
}

export default Header;