import AdminAccountDetailScreen from '@features/admin-users/screens/AdminAccountDetailScreen';
export default async function Page({params}:{params:Promise<{userId:string}>}){const {userId}=await params;return <AdminAccountDetailScreen kind="user" reference={decodeURIComponent(userId)}/>}
