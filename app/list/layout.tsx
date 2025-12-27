import Header from '@/components/Header';

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header currentPage="모의고사 리스트" />
      {children}
    </>
  );
}

