import ResourceScreen from '@features/officer-operations/ResourceScreen';
export default function Page() { return <ResourceScreen title="Assigned Prisoners" endpoint="/officer/prisoners?active=all" prisonerLinks />; }
