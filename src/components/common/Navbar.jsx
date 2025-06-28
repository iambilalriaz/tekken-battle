'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';
import { APP_ROUTES } from '@/constants/app-routes';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { usePathname, useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';
import { logoutUserAPI } from '@/lib/api';

const NAVBAR_LINKS = [
  { path: APP_ROUTES.DASHBOARD, label: 'Dashboard' },
  { path: APP_ROUTES.BATTLE_REQUESTS, label: 'Battle Requests' },
  { path: APP_ROUTES.DASHBOARD, label: 'Profile' },
];

const Navbar = () => {
  const { loading, loggedIn, user } = useAuthStatus();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    if (loggedIn) {
      setIsOpen(!isOpen);
    } else {
      router.push(APP_ROUTES.LOGIN);
    }
  };

  const onLogoutUser = async () => {
    await logoutUserAPI();
    router.push(APP_ROUTES.LOGIN);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isAuthPage = [APP_ROUTES.LOGIN, APP_ROUTES.SIGNUP].some(
    (page) => page === pathname
  );

  return (
    <nav className='fixed w-full top-0 left-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-md px-6 py-3'>
      <div className='flex justify-between items-center'>
        <Link href='/' className='text-3xl font-bold text-white'>
          🎮
        </Link>
        <div ref={menuRef} className='relative'>
          {!isAuthPage && (
            <button
              className='flex items-center text-secondary hover:bg-secondary hover:border-secondary hover:text-primary border px-4 py-1.5 border-white cursor-pointer font-semibold'
              onClick={toggleMenu}
              aria-label='Toggle Menu'
              disabled={loading}
            >
              {loading ? (
                <Loader variant='secondary' size='xs' />
              ) : loggedIn ? (
                <>
                  {user?.firstName} <FaChevronDown className='ml-2' />
                </>
              ) : (
                'Login'
              )}
            </button>
          )}

          {isOpen && (
            <ul className='mt-3 space-y-2 w-60  text-primary absolute top-12 right-0 bg-white backdrop-blur-md border border-white/20 shadow-md px-4 py-3 rounded'>
              {NAVBAR_LINKS.map(({ label, path }) => (
                <li key={label} className='hover:font-medium'>
                  <Link href={path} onClick={() => setIsOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
              <li className='hover:font-medium'>
                <Link href={APP_ROUTES.LOGIN} onClick={onLogoutUser}>
                  Logout
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
