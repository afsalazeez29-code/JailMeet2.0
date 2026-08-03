import { Suspense } from 'react'; import AdminSearchScreen from '@features/admin-operations/screens/AdminSearchScreen';
export default function Page(){return <Suspense fallback={<p>Loading search…</p>}><AdminSearchScreen/></Suspense>}
