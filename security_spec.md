# Security Specification – Mankamana Guest House

## 1. Data Invariants
1. **Admin Isolation**: Public visitors can read published catalog content (`rooms`, `websiteSettings`, enabled `gallery`, enabled `facilities`, enabled `testimonials`) and submit `bookings` or `contactMessages` enquiries, but can NEVER list, read, update, or delete other guests' `bookings` or `contactMessages` (PII isolation).
2. **Booking State Integrity**: Public booking enquiry creation MUST enforce `status == "New"`, `adminNotes == ""`, and server timestamps (`createdAt == request.time`, `updatedAt == request.time`). Only verified admins can transition status (`New` -> `Contacted` | `Confirmed` | `Cancelled` | `Completed`) or edit `adminNotes`.
3. **Admin Whitelist**: Only authenticated users with `email_verified == true` whose email matches the bootstrapped admin (`alnisrpurchase@gmail.com`) or whose UID exists in `/admins/{uid}` have `isAdmin()`. Public self-registration to `/admins` is strictly denied.
4. **Path & Size Hardening**: Every document ID path variable is guarded by `isValidId(id)` (`^[a-zA-Z0-9_-]+$`, `<= 128` chars) on single-doc operations, and every string/array field enforces strict `.size()` bounds.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return `PERMISSION_DENIED`)
1. Public `list` on `/bookings` (attempting to scrape guest phone numbers & emails).
2. Public `get` on `/bookings/{id}` (attempting to read a specific guest's booking).
3. Public `create` on `/bookings/{id}` with `status: "Confirmed"` (state shortcutting).
4. Public `create` on `/bookings/{id}` with extra shadow field `isPaid: true` (`hasOnly` rejection).
5. Public `create` on `/bookings/{id}` with forged client `createdAt` timestamp (`request.time` check).
6. Public `create` on `/bookings/{id}` with 2MB `specialRequests` payload (resource exhaustion).
7. Unverified email spoofing admin email (`email == "alnisrpurchase@gmail.com"`, `email_verified == false`) attempting `list` on `/bookings`.
8. Non-admin authenticated user attempting `create` on `/admins/{uid}` (privilege escalation).
9. Non-admin authenticated user attempting `update` on `/rooms/{id}` to set `priceNpr: 1`.
10. Non-admin authenticated user attempting `delete` on `/websiteSettings/main`.
11. Public `list` on `/gallery` without `isEnabled == true` filter (attempting to inspect disabled draft images).
12. Public `create` on `/contactMessages/{id}` with `isRead: true` or oversized `message` (> 2000 chars).
