import { useItinerary } from "../../hooks/useItinerary";
import type { Flight, Car, Accommodation, CarPickup } from "../../types";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xs font-semibold uppercase tracking-wider px-4 pt-5 pb-2"
      style={{ color: "var(--color-text-secondary)" }}
    >
      {children}
    </h2>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mx-4 rounded-lg border bg-white p-4 mb-3"
      style={{ borderColor: "#E2E8F0", boxShadow: "var(--shadow-card)" }}
    >
      {children}
    </div>
  );
}

function AccommodationCard({ acc }: { acc: Accommodation }) {
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${acc.coordinates.lat},${acc.coordinates.lng}`;
  return (
    <Card>
      <p className="font-semibold text-base" style={{ color: "var(--color-text-primary)" }}>
        🏠 {acc.name}
      </p>
      <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
        {acc.address}
      </p>
      <div className="mt-2 flex flex-col gap-1 text-sm">
        <p style={{ color: "var(--color-text-secondary)" }}>
          Check-in: <span style={{ color: "var(--color-text-primary)" }}>{acc.checkInTime}</span>
        </p>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Check-out: <span style={{ color: "var(--color-text-primary)" }}>{acc.checkOutTime}</span>
        </p>
      </div>
      <div className="mt-3 flex gap-3 flex-wrap">
        <a
          href={`tel:${acc.phone}`}
          className="flex items-center gap-1 text-sm font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          📞 {acc.phone}
        </a>
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          📍 Zobrazit na mapě
        </a>
      </div>
    </Card>
  );
}

function FlightCard({ flight }: { flight: Flight }) {
  const needsVerification = flight.baggage.includes("OVĚŘIT");
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-base" style={{ color: "var(--color-text-primary)" }}>
            ✈️ {flight.route.from} → {flight.route.to}
          </p>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            {flight.airline} · {flight.flightNumber}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
            {flight.departure}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {flight.duration}
          </p>
        </div>
      </div>
      <div className="mt-2 flex gap-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
        <span>
          {new Date(flight.date).toLocaleDateString("cs-CZ", {
            day: "numeric",
            month: "numeric",
          })}
        </span>
        <span>Booking: <strong style={{ color: "var(--color-text-primary)" }}>{flight.booking}</strong></span>
      </div>
      <p className="mt-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
        🧳 {flight.baggage}
      </p>
      {needsVerification && (
        <div
          className="mt-2 flex gap-2 p-2 rounded text-xs"
          style={{ backgroundColor: "#FEF2F2", color: "#991B1B" }}
        >
          ⚠️ Nutné ověřit tarif zavazadel
        </div>
      )}
    </Card>
  );
}

function CarCard({ car }: { car: Car }) {
  const pickup = new Date(car.dates.pickup).toLocaleString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const ret = new Date(car.dates.return).toLocaleString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <Card>
      <p className="font-semibold text-base" style={{ color: "var(--color-text-primary)" }}>
        🚗 {car.model}
      </p>
      <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
        Řidič: <span style={{ color: "var(--color-text-primary)" }}>{car.driver}</span>
      </p>
      <div className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
        <p>Vyzvednutí: <span style={{ color: "var(--color-text-primary)" }}>{pickup}</span></p>
        <p>Vrácení: <span style={{ color: "var(--color-text-primary)" }}>{ret}</span></p>
        <p className="mt-1">Rezervace: <strong style={{ color: "var(--color-text-primary)" }}>{car.reservation}</strong></p>
      </div>
    </Card>
  );
}

function CarPickupCard({ pickup }: { pickup: CarPickup }) {
  return (
    <Card>
      <p className="font-semibold text-base mb-3" style={{ color: "var(--color-text-primary)" }}>
        📍 Vyzvednutí auta na letišti
      </p>

      <div className="mb-3">
        <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
          ✈️ Let ze zahraničí (mimo Španělsko):
        </p>
        <ul className="mt-1 list-disc pl-5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {pickup.internationalArrival.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
          ✈️ Let ze Španělska:
        </p>
        <ul className="mt-1 list-disc pl-5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {pickup.domesticArrival.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>

      <div
        className="flex flex-col gap-1 p-2 rounded text-sm"
        style={{ backgroundColor: "#EFF6FF", color: "#1E40AF" }}
      >
        <p className="font-medium">📞 Nenajdete shuttle? Volejte:</p>
        <div className="flex gap-3 flex-wrap">
          {pickup.phone.map((p) => (
            <a key={p} href={`tel:${p}`} className="font-medium underline">
              {p}
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function ItineraryView() {
  const { state } = useItinerary();
  const { accommodation, flights, cars, carPickup } = state.meta;

  return (
    <main className="pb-20 lg:pb-8">
      <SectionHeader>🏠 Ubytování</SectionHeader>
      <AccommodationCard acc={accommodation} />

      <SectionHeader>✈️ Lety</SectionHeader>
      {flights.map((f) => (
        <FlightCard key={f.id} flight={f} />
      ))}

      <SectionHeader>🚗 Auta</SectionHeader>
      {cars.map((c) => (
        <CarCard key={c.id} car={c} />
      ))}
      {carPickup && <CarPickupCard pickup={carPickup} />}
    </main>
  );
}
