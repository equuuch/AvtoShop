import { useEffect, useState } from 'react';
import '../styles/Header.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Обработчик для логотипа
  const handleLogoClick = () => {
    navigate('/'); // Переход на главную страницу
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header__content">
        <div className="header__logo" onClick={handleLogoClick}>
          <span>AvtoShop</span>
        </div>

        <nav className={`header__nav ${menuOpen ? 'open' : ''}`}>
          <a href="/#services" onClick={handleLinkClick}>Услуги</a>
          <a href="/#advantages" onClick={handleLinkClick}>Преимущества</a>
          <a href="/#about" onClick={handleLinkClick}>О нас</a>
          {/* This now links to the dedicated reviews page */}
          <Link to="/reviews" onClick={handleLinkClick}>Отзывы</Link>
          <a href="/#contact" onClick={handleLinkClick}>Контакты</a>
          <Link to="/login" onClick={handleLinkClick}>Вход</Link>
        </nav>

        <div className={`burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </header>
  );
}
