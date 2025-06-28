import Navbar from '@/components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <main className='grid place-items-center h-screen'>
      <Navbar />
      {children}
    </main>
  );
};

export default MainLayout;
