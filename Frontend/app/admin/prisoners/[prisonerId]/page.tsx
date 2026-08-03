import AdminAccountDetailScreen from '@features/admin-users/screens/AdminAccountDetailScreen';
export default async function Page({params}:{params:Promise<{prisonerId:string}>}){const {prisonerId}=await params;return <AdminAccountDetailScreen kind="prisoner" reference={prisonerId}/>}
