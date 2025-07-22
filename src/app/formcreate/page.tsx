import { Suspense } from 'react';
import ClientFormCreate from './ClientFormCreate';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ClientFormCreate />
    </Suspense>
  );
}
