import Navbar from '@/components/common/Navbar';

const MainLayout = ({ children }) => {
  return (
    <main className='grid place-items-center h-screen mx-4'>
      <Navbar />
      {children}
    </main>
  );
};

export default MainLayout;
