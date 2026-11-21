import {
  Wifi,
  Wind,
  Car,
  ConciergeBell,
  Clock,
  Utensils,
  Coffee,
  ShieldCheck,
  Tv,
  Sparkles,
} from 'lucide-react';

export function FacilityIcon({
  name,
  className = 'w-5 h-5',
}: {
  name: string;
  className?: string;
}) {
  switch (name) {
    case 'Wifi':
      return <Wifi className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'ConciergeBell':
      return <ConciergeBell className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}
