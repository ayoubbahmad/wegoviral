import { JoinPage } from '@/containers/Onboarding/JoinPage';

export const metadata = { title: 'Join' };

export default async function Join({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <JoinPage code={code} />;
}
