import React, { useEffect, useState } from 'react';
import { CheckCircle2, Calendar, Users, ArrowRight } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { submitBookingEnquiry } from '../../services/hotelService';
import { useToast } from '../common/Toast';

interface BookingEnquiryFormProps {
  preselectedRoomId?: string;
  preselectedRoomName?: string;
  dark?: boolean;
}

function getTodayStr(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function BookingEnquiryForm({
  preselectedRoomId = '',
  preselectedRoomName = '',
  dark = false,
}: BookingEnquiryFormProps) {
  const { rooms, settings, t } = useHotel();
  const { showToast } = useToast();

  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState(getTodayStr(1));
  const [checkOutDate, setCheckOutDate] = useState(getTodayStr(2));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState(preselectedRoomId);
  const [roomType, setRoomType] = useState(preselectedRoomName);
  const [specialRequests, setSpecialRequests] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedRoomId) {
      setSelectedRoomId(preselectedRoomId);
    }
    if (preselectedRoomName) {
      setRoomType(preselectedRoomName);
    } else if (!roomType && rooms.length > 0) {
      setSelectedRoomId(rooms[0].id);
      setRoomType(rooms[0].name);
    }
  }, [preselectedRoomId, preselectedRoomName, rooms, roomType]);

  const handleRoomSelect = (id: string) => {
    setSelectedRoomId(id);
    const found = rooms.find((r) => r.id === id);
    if (found) setRoomType(found.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (guestName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (phone.trim().length < 6) {
      setErrorMsg('Please enter a valid phone or WhatsApp number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
      setErrorMsg('Check-out date must be after the check-in date.');
      return;
    }

    setSubmitting(true);
    try {
      const id = await submitBookingEnquiry({
        guestName,
        phone,
        email,
        checkInDate,
        checkOutDate,
        adults,
        children,
        roomId: selectedRoomId || 'general',
        roomType: roomType || rooms[0]?.name || 'Standard Room',
        specialRequests,
      });
      setSubmittedId(id);
      showToast('Booking enquiry submitted successfully.', 'success');
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not submit your enquiry right now. Please try again.');
      showToast('Failed to send booking enquiry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedId(null);
    setGuestName('');
    setPhone('');
    setEmail('');
    setSpecialRequests('');
    setErrorMsg(null);
  };

  const labelClass = dark ? 'text-xs font-medium text-stone-300' : 'text-xs font-medium text-[#4A443E]';
  const inputClass = dark
    ? 'w-full px-3.5 py-2.5 bg-[#1B1917] border border-white/15 text-[#FAF9F6] text-sm placeholder:text-stone-500 focus:outline-none focus:border-[#C8A055] transition-colors'
    : 'w-full px-3.5 py-2.5 bg-white border border-[#181614]/15 text-[#181614] text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#C8A055] transition-colors';

  if (submittedId) {
    return (
      <div
        className={`p-8 border ${
          dark
            ? 'bg-[#181614] border-[#C8A055]/40 text-[#FAF9F6]'
            : 'bg-white border-[#181614]/12 text-[#181614]'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-[#C8A055]/15 text-[#C8A055] shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8E682A] mb-1">
              Reference #{submittedId.slice(0, 8).toUpperCase()}
            </p>
            <h3 className="font-display text-3xl mb-2">{t.bookingForm.successTitle}</h3>
            <p className={`text-sm leading-relaxed mb-6 ${dark ? 'text-stone-300' : 'text-[#4A443E]'}`}>
              {t.bookingForm.successBody}
            </p>
            <div className={`text-xs font-mono space-y-1 mb-6 ${dark ? 'text-stone-400' : 'text-[#6B6257]'}`}>
              <p>Room: {roomType}</p>
              <p>Dates: {checkInDate} to {checkOutDate}</p>
              <p>Guests: {adults} Adults, {children} Children</p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="cta-sheen px-5 py-2.5 bg-[#C8A055] text-[#11100F] text-sm font-medium hover:bg-[#DBB66D] transition-colors"
            >
              {t.bookingForm.newEnquiry}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 md:p-8 border ${
        dark
          ? 'bg-[#151311] border-white/10 text-[#FAF9F6]'
          : 'bg-white border-[#181614]/12 text-[#181614]'
      }`}
    >
      {errorMsg && (
        <div className="mb-5 p-3.5 bg-red-950/10 border border-red-500/40 text-red-600 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block mb-1.5 ${labelClass}`}>{t.bookingForm.guestName} *</label>
          <input
            type="text"
            required
            maxLength={120}
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="e.g., Suman Adhikari"
            className={inputClass}
          />
        </div>

        <div>
          <label className={`block mb-1.5 ${labelClass}`}>{t.bookingForm.phone} *</label>
          <input
            type="tel"
            required
            maxLength={30}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+977 ..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={`block mb-1.5 ${labelClass}`}>{t.bookingForm.email} *</label>
          <input
            type="email"
            required
            maxLength={160}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="guest@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className={`block mb-1.5 ${labelClass}`}>{t.bookingForm.roomType} *</label>
          <select
            value={selectedRoomId}
            onChange={(e) => handleRoomSelect(e.target.value)}
            className={inputClass}
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} ({settings.currency} {room.priceNpr.toLocaleString()}/night)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`flex items-center gap-1.5 mb-1.5 ${labelClass}`}>
            <Calendar className="w-3.5 h-3.5 text-[#C9A461]" />
            <span>{t.bookingForm.checkIn} *</span>
          </label>
          <input
            type="date"
            required
            min={getTodayStr(0)}
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={`flex items-center gap-1.5 mb-1.5 ${labelClass}`}>
            <Calendar className="w-3.5 h-3.5 text-[#C9A461]" />
            <span>{t.bookingForm.checkOut} *</span>
          </label>
          <input
            type="date"
            required
            min={checkInDate || getTodayStr(1)}
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={`flex items-center gap-1.5 mb-1.5 ${labelClass}`}>
            <Users className="w-3.5 h-3.5 text-[#C9A461]" />
            <span>{t.bookingForm.adults}</span>
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={adults}
            onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
            className={`${inputClass} tabular-nums`}
          />
        </div>

        <div>
          <label className={`flex items-center gap-1.5 mb-1.5 ${labelClass}`}>
            <Users className="w-3.5 h-3.5 text-[#C9A461]" />
            <span>{t.bookingForm.children}</span>
          </label>
          <input
            type="number"
            min={0}
            max={20}
            value={children}
            onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
            className={`${inputClass} tabular-nums`}
          />
        </div>

        <div className="md:col-span-2">
          <label className={`block mb-1.5 ${labelClass}`}>{t.bookingForm.specialRequests}</label>
          <textarea
            rows={3}
            maxLength={1500}
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Expected arrival time, airport/border pickup request, bedding preference..."
            className={inputClass}
          />
        </div>
      </div>

      <p className={`text-xs mt-4 leading-relaxed ${dark ? 'text-stone-400' : 'text-stone-500'}`}>
        {settings.bookingNotice || t.bookingForm.enquiryNotice}
      </p>

      <div className="mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="cta-sheen group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#C8A055] text-[#11100F] text-sm font-semibold hover:bg-[#DBB66D] disabled:opacity-60 transition-all cursor-pointer"
        >
          <span>{submitting ? t.bookingForm.submitting : t.bookingForm.submitEnquiry}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}
