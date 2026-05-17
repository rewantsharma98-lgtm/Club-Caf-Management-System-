import QrMenuPage from '@/components/menu/QrMenuPage';

type Props = {
  params: {
    code: string;
  };
};

export function generateStaticParams() {
  return [{ code: 'TBL-01' }];
}

export default function QrMenuCodePage({ params }: Props) {
  return <QrMenuPage initialCode={params.code} />;
}
