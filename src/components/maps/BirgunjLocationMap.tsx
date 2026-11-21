import { useCallback, useState } from 'react';
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin } from 'lucide-react';

interface BirgunjLocationMapProps {
  hotelName: string;
  address: string;
  lat: number;
  lng: number;
  googleMapsUrl?: string;
  directionsLabel: string;
}

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

function HotelMarker({
  hotelName,
  address,
  position,
}: {
  hotelName: string;
  address: string;
  position: { lat: number; lng: number };
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  const handleClose = useCallback(() => setInfoOpen(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        title={hotelName}
        onClick={() => setInfoOpen(true)}
      >
        <Pin background="#C9A461" borderColor="#0D0C0B" glyphColor="#0D0C0B" scale={1.15} />
      </AdvancedMarker>
      {infoOpen && marker && (
        <InfoWindow anchor={marker} onCloseClick={handleClose} maxWidth={240}>
          <div className="p-1 text-[#1B1917]">
            <p className="font-semibold text-sm">{hotelName}</p>
            <p className="text-xs text-stone-600 mt-0.5">{address || 'Birgunj, Nepal'}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function BirgunjLocationMap({
  hotelName,
  address,
  lat,
  lng,
  googleMapsUrl,
  directionsLabel,
}: BirgunjLocationMapProps) {
  const center = {
    lat: Number.isFinite(lat) ? lat : 27.0104,
    lng: Number.isFinite(lng) ? lng : 84.8774,
  };

  const directionsHref =
    googleMapsUrl && googleMapsUrl.startsWith('http')
      ? googleMapsUrl
      : `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;

  return (
    <div className="w-full">
      <div className="w-full h-[380px] md:h-[440px] border border-[#1B1917]/15 bg-[#EDE7DC] overflow-hidden relative">
        {MAPS_API_KEY ? (
          <APIProvider apiKey={MAPS_API_KEY} language="en" region="NP">
            <GoogleMap
              defaultCenter={center}
              center={center}
              defaultZoom={14}
              mapId="DEMO_MAP_ID"
              gestureHandling="cooperative"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
            >
              <HotelMarker hotelName={hotelName} address={address} position={center} />
            </GoogleMap>
          </APIProvider>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#171513] text-[#F8F5F0]">
            <div className="w-12 h-12 border border-[#C9A461]/40 flex items-center justify-center mb-4 text-[#C9A461]">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl mb-1">{hotelName}</h3>
            <p className="text-sm text-stone-300 mb-2">{address || 'Birgunj, Nepal'}</p>
            <p className="font-mono text-xs text-stone-400 tabular-nums mb-6">
              {center.lat.toFixed(4)}° N, {center.lng.toFixed(4)}° E
            </p>
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A461] text-[#0D0C0B] text-sm font-medium hover:bg-[#D7B575] transition-colors"
            >
              <span>{directionsLabel}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-stone-600">
          <span className="font-medium text-[#1B1917]">{hotelName}</span>
          <span className="mx-2" aria-hidden="true">·</span>
          <span>{address || 'Birgunj, Nepal'}</span>
        </div>
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B1917] text-[#F8F5F0] text-sm font-medium hover:bg-[#2F2A26] transition-colors whitespace-nowrap"
        >
          <span>{directionsLabel}</span>
          <ExternalLink className="w-4 h-4 text-[#C9A461]" />
        </a>
      </div>
    </div>
  );
}
