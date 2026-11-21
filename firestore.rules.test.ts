/**
 * Security Rules Adversarial Test Specification (Emulator Suite Ready)
 * Run with @firebase/rules-unit-testing when Firebase Emulator is running.
 */
export const dirtyDozenSecurityCases = [
  { name: '1. Public list on /bookings must deny', path: 'bookings', op: 'list', expected: 'PERMISSION_DENIED' },
  { name: '2. Public get on /bookings/{id} must deny', path: 'bookings/b1', op: 'get', expected: 'PERMISSION_DENIED' },
  { name: '3. Public create on /bookings with status=Confirmed must deny', path: 'bookings/b2', op: 'create', expected: 'PERMISSION_DENIED' },
  { name: '4. Public create on /bookings with shadow field isPaid=true must deny', path: 'bookings/b3', op: 'create', expected: 'PERMISSION_DENIED' },
  { name: '5. Public create on /bookings with forged client timestamp must deny', path: 'bookings/b4', op: 'create', expected: 'PERMISSION_DENIED' },
  { name: '6. Public create on /bookings with oversized specialRequests must deny', path: 'bookings/b5', op: 'create', expected: 'PERMISSION_DENIED' },
  { name: '7. Unverified admin email spoof must deny', path: 'bookings', op: 'list', expected: 'PERMISSION_DENIED' },
  { name: '8. Non-admin create on /admins/{uid} must deny', path: 'admins/attacker', op: 'create', expected: 'PERMISSION_DENIED' },
  { name: '9. Non-admin update on /rooms/{id} must deny', path: 'rooms/r1', op: 'update', expected: 'PERMISSION_DENIED' },
  { name: '10. Non-admin delete on /websiteSettings/main must deny', path: 'websiteSettings/main', op: 'delete', expected: 'PERMISSION_DENIED' },
  { name: '11. Public list on /gallery without isEnabled==true filter must deny', path: 'gallery', op: 'list', expected: 'PERMISSION_DENIED' },
  { name: '12. Public create on /contactMessages with isRead=true must deny', path: 'contactMessages/m1', op: 'create', expected: 'PERMISSION_DENIED' },
];
