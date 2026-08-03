import ResourceScreen from '@features/officer-operations/ResourceScreen';
export default function Page() { return <ResourceScreen title="Appointment Change Requests" endpoint="/officer/appointment-change-requests?status=PENDING" action="CHANGE_REQUEST" />; }
