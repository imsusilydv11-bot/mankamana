import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { BirgunjLocationMap } from '../../components/maps/BirgunjLocationMap';
import { Ambient3DBanner } from '../../components/three/Ambient3DBanner';
import { submitContactMessage } from '../../services/hotelService';
import { useToast } from '../../components/common/Toast';

export function ContactPage() {
  const { settings, t } = useHotel();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (name.trim().length < 2 || !email.includes('@') || message.trim().length < 5) {
      setErrorMsg('Please provide your name, a valid email, and a message.');
      return;
    }

    setSending(true);
    try {
      await submitContactMessage({
        name,
        email,
        phone,
        subject: subject || 'General Enquiry',
        message,
      });
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      showToast('Your message has been sent to hotel reception.', 'success');
    } catch (err) {
      console.error(err);
      setErrorMsg('Unable to send message right now. Please try again.');
      showToast('Failed to send message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <div className="pt-16 md:pt-20 bg-[#FAF9F6] text-[#181614] min-h-screen">
      <section className="relative bg-[#11100F] text-[#FAF9F6] py-20 overflow-hidden">
        <Ambient3DBanner />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <p className="text-xs tracking-[0.24em] uppercase text-[#C8A055] mb-3">
            {settings.hotelName} · {settings.locationLabel}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-medium [text-wrap:balance] mb-4">
            Location & Contact
          </h1>
          <p className="text-base text-stone-300 max-w-2xl">
            Reach our reception team in Birgunj, Nepal for stay enquiries, corporate bookings, or directions.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-[#181614]/12 p-7 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#8E682A] font-medium mb-1">
                  Property
                </p>
                <h2 className="font-display text-3xl font-medium">{settings.hotelName}</h2>
                <p className="text-sm text-[#4A443E] mt-1">Birgunj, Nepal</p>
              </div>

              <div className="space-y-4 text-sm text-[#3D3731] pt-4 border-t border-[#181614]/10">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#8E682A] shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-[#181614]">Address</p>
                    <p className="text-[#4A443E]">{settings.address || 'Birgunj, Nepal'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#8E682A] shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-[#181614]">Phone</p>
                    {settings.phone ? (
                      <a href={`tel:${settings.phone}`} className="text-[#4A443E] hover:text-[#8E682A] tabular-nums">
                        {settings.phone}
                      </a>
                    ) : (
                      <p className="text-xs text-[#6B6257]">Configurable by administrator in Website Content</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#8E682A] shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-[#181614]">Email</p>
                    {settings.email ? (
                      <a href={`mailto:${settings.email}`} className="text-[#4A443E] hover:text-[#8E682A]">
                        {settings.email}
                      </a>
                    ) : (
                      <p className="text-xs text-[#6B6257]">Configurable by administrator in Website Content</p>
                    )}
                  </div>
                </div>

                {whatsappHref && (
                  <div className="pt-2">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-[#181614]/12 p-7">
              <h2 className="font-display text-3xl font-medium mb-2">Send a Message</h2>
              <p className="text-sm text-[#4A443E] mb-6">
                Questions before booking? Send a direct note to our team.
              </p>

              {sent ? (
                <div className="p-6 bg-[#FAF9F6] border border-[#C8A055]/50">
                  <div className="flex items-center gap-2 text-emerald-800 font-medium mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Message Sent</span>
                  </div>
                  <p className="text-sm text-[#4A443E] mb-4">
                    Thank you for reaching out. Our team will respond as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="px-4 py-2 bg-[#181614] text-white text-xs font-medium"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <p className="text-xs text-red-700 bg-red-50 border border-red-200 p-3">
                      {errorMsg}
                    </p>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-[#3D3731] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#181614]/15 text-sm focus:outline-none focus:border-[#C8A055]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#3D3731] mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        maxLength={160}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-[#181614]/15 text-sm focus:outline-none focus:border-[#C8A055]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3D3731] mb-1">Phone</label>
                      <input
                        type="tel"
                        maxLength={30}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-[#181614]/15 text-sm focus:outline-none focus:border-[#C8A055]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#3D3731] mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      maxLength={160}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Group stay or airport transfer"
                      className="w-full px-3.5 py-2.5 border border-[#181614]/15 text-sm focus:outline-none focus:border-[#C8A055]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#3D3731] mb-1">Message *</label>
                    <textarea
                      rows={4}
                      required
                      maxLength={2000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#181614]/15 text-sm focus:outline-none focus:border-[#C8A055]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="cta-sheen inline-flex items-center gap-2 px-6 py-3 bg-[#C8A055] text-[#11100F] text-sm font-semibold hover:bg-[#DBB66D] disabled:opacity-60 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sending ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl font-medium mb-2">Birgunj Location Map</h2>
            <p className="text-sm text-[#4A443E] mb-5">
              Interactive Google Maps view for {settings.hotelName} in Birgunj, Nepal.
            </p>
            <BirgunjLocationMap
              hotelName={settings.hotelName}
              address={settings.address}
              lat={settings.mapLat}
              lng={settings.mapLng}
              googleMapsUrl={settings.googleMapsUrl}
              directionsLabel={t.sections.getDirections}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
