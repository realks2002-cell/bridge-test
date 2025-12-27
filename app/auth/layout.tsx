import Header from '@/components/Header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header currentPage="인증" />
      {children}
    </>
  );
}

