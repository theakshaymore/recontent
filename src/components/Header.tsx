import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-effect shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold gradient-text">ContentAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('features')}
            className="text-foreground/70 hover:text-foreground transition-colors font-medium"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="text-foreground/70 hover:text-foreground transition-colors font-medium"
          >
            Pricing
          </button>
          <Link
            to="/login"
            className="text-foreground/70 hover:text-foreground transition-colors font-medium"
          >
            Login
          </Link>
          <Button
            variant="gradient"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background shadow-lg border-t border-border animate-fade-in">
          <nav className="flex flex-col p-4 gap-4">
            <button
              onClick={() => scrollToSection('features')}
              className="text-foreground/70 hover:text-foreground transition-colors font-medium text-left py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-foreground/70 hover:text-foreground transition-colors font-medium text-left py-2"
            >
              Pricing
            </button>
            <Link
              to="/login"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Button
              variant="gradient"
              className="w-full"
              onClick={() => {
                navigate('/signup');
                setIsMobileMenuOpen(false);
              }}
            >
              Sign Up
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
