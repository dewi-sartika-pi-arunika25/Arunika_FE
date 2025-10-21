// components/Navbar.jsx
import Link from 'next/link';
import { Button } from '@/components/ui/button'; 
import { BookOpen, Map, Users } from 'lucide-react'; 

// Data Navigasi
const navItems = [
  { name: "Lab Career", href: "/lab-career", icon: BookOpen },
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "About Us", href: "/about-us", icon: Users },
];

// Komponen Logo
const Logo = () => (
  <div className="flex items-center text-xl font-montserrat text-orange-900">
    <span className="text-3xl mr-1 leading-none">👑</span> 
    <span className="font-bold tracking-wider">Arunika</span>
  </div>
);

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#FAE13C] shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo di kiri */}
          <Logo />

          {/* Navigasi utama (desktop) */}
          <div className="hidden lg:flex space-x-6 items-center">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} legacyBehavior passHref>
                <a className="flex items-center space-x-2 text-orange-900 text-base font-medium hover:text-orange-700 transition-colors">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              </Link>
            ))}
          </div>

          {/* Tombol aksi */}
          <div className="flex items-center space-x-3">
            {/* Tombol Masuk */}
            <Button
              asChild
              className="px-6 py-2 rounded-full font-semibold text-white 
                         bg-gradient-to-r from-yellow-500 to-orange-500 
                         hover:from-orange-300 hover:to-orange-400 transition-all 
                         shadow-lg shadow-purple-500/50"
            >
              <Link href="/login">Masuk</Link>
            </Button>

            {/* Tombol Daftar */}
            <Button
              asChild
              className="px-6 py-2 rounded-full font-semibold text-white bg-orange-400 hover:bg-orange-500 transition-colors"
            >
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
