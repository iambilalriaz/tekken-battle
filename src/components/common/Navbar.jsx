'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';
import { APP_ROUTES } from '@/constants/app-routes';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { usePathname, useRouter } from 'next/navigation';
import { useLogoutCustomer } from '@/hooks/useLogoutCustomer';

const NAVBAR_LINKS = [
  { path: APP_ROUTES.DASHBOARD, label: 'Dashboard' },
  { path: APP_ROUTES.BATTLES.LIST, label: 'Battles' },
  { path: APP_ROUTES.STATS, label: 'Statistics' },
  { path: APP_ROUTES.RECORDS.MAIN, label: 'Records' },
  { path: APP_ROUTES.PROFILE, label: 'Profile' },
];

const Navbar = () => {
  const { logoutCustomer } = useLogoutCustomer();
  const { loggedInUser } = useLoggedInUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleMenu = () => {
    if (loggedInUser) {
      setIsOpen(!isOpen);
    } else {
      router.push(APP_ROUTES.LOGIN);
    }
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

  const isNewItem = (path) => [APP_ROUTES.RECORDS.MAIN].includes(path);

  return (
    <nav className='fixed w-full top-0 left-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-md px-6 py-3'>
      <div className='flex justify-between items-center'>
        <Link href='/' className='text-xl font-bold text-white'>
          🎮 <span className='text-sm'>Tekken Battle</span>
        </Link>
        <div ref={menuRef} className='relative'>
          {!isAuthPage && (
            <button
              className='flex items-center text-secondary hover:bg-secondary hover:border-secondary hover:text-primary border px-4 py-1.5 border-white cursor-pointer font-semibold'
              onClick={toggleMenu}
              aria-label='Toggle Menu'
            >
              {loggedInUser?.firstName} <FaChevronDown className='ml-2' />
            </button>
          )}

          {isOpen && (
            <ul className='mt-3 space-y-2 w-60  text-primary absolute top-12 right-0 bg-white backdrop-blur-md border border-white/20 shadow-md px-4 py-3 rounded'>
              {NAVBAR_LINKS.map(({ label, path }) => (
                <li
                  key={label}
                  className='hover:font-medium border-b pb-2 text-sm'
                >
                  <Link
                    href={path}
                    onClick={() => setIsOpen(false)}
                    className='block w-full px-2 py-1 rounded hover:bg-gray-100'
                  >
                    {label}{' '}
                    {isNewItem(path) ? (
                      <span className='bg-dodger-blue text-white rounded-4xl px-2 py-0.5 text-xs font-semibold'>
                        New
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
              <li className='hover:font-medium text-sm'>
                <Link
                  href={APP_ROUTES.LOGIN}
                  onClick={logoutCustomer}
                  className='block w-full px-2 py-1 rounded hover:bg-gray-100'
                >
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
