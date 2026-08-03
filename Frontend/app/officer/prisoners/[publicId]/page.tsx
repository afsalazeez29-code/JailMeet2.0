'use client';
import { useParams } from 'next/navigation';
import PrisonerDetailScreen from '@features/officer-operations/PrisonerDetailScreen';
export default function Page() { const params = useParams<{ publicId: string }>(); return <PrisonerDetailScreen publicId={params.publicId} />; }
