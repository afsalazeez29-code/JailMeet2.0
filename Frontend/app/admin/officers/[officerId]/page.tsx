import AdminAccountDetailScreen from '@features/admin-users/screens/AdminAccountDetailScreen';
export default async function Page({params}:{params:Promise<{officerId:string}>}){const {officerId}=await params;return <AdminAccountDetailScreen kind="officer" reference={officerId}/>}
