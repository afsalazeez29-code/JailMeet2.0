import { Suspense } from 'react';

import { LoadingAlert } from '@components/common/StatusAlert';
import AppointmentBookingScreen from '@features/appointments/screens/AppointmentBookingScreen';

export default function AppointmentBookingPage() {
  return (
    <Suspense fallback={<div className="container-xxl flex-grow-1 container-p-y"><LoadingAlert>Loading appointment form...</LoadingAlert></div>}>
      <AppointmentBookingScreen />
    </Suspense>
  );
}
