import Button from '@/components/Button';
import FloatingInput from '@/components/FloatingInput';
import GlassyCard from '@/components/GlassyCard';
import MainLayout from '@/layouts/MainLayout';

const Login = () => {
  return (
    <MainLayout>
      <GlassyCard title='Login' styles='w-full md:w-1/2'>
        <FloatingInput inputClass='mt-6' label='Email' type='email' />
        <FloatingInput inputClass='mt-6' label='Password' type='password' />
        <Button className='mt-4 mx-auto w-full md:w-1/2 flex justify-center'>
          Login
        </Button>
      </GlassyCard>
    </MainLayout>
  );
};

export default Login;
