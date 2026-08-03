import AdminAccountDetailScreen from '@features/admin-users/screens/AdminAccountDetailScreen';
export default async function Page({params}:{params:Promise<{visitorId:string}>}){const {visitorId}=await params;return <AdminAccountDetailScreen kind="visitor" reference={visitorId}/>}
