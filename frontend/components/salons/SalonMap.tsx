'use client';

import React, { useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';

interface SalonMapProps {
  salons: any[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 6.3156,
  lng: -10.8074, // Monrovia, Liberia
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#bdbdbd" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#eeeeee" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#c9c9c9" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    }
  ]
};

export default function SalonMap({ salons }: SalonMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isKeyValid = !!(apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: isKeyValid ? apiKey : '',
    id: 'google-map-script', // Explicit ID helps prevent duplicates
  });

  const [selectedSalon, setSelectedSalon] = React.useState<any>(null);

  const salonMarkers = useMemo(() => {
    return salons.map((salon) => ({
      id: salon.id,
      name: salon.name,
      position: {
        lat: parseFloat(salon.latitude) || 6.3156,
        lng: parseFloat(salon.longitude) || -10.8074,
      },
      price: salon.min_price
    }));
  }, [salons]);

  if (!isKeyValid) {
    return (
      <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center p-4 bg-light">
        <div className="bg-white p-4 rounded-4 shadow-sm">
          <h5 className="fw-bold mb-3">Google Maps API Key Required</h5>
          <p className="text-muted small mb-4">
            To see the real interactive map, please add your Google Maps API key to the <code className="bg-light p-1 rounded">.env.local</code> file in the frontend directory.
          </p>
          <div className="bg-sand p-3 rounded text-start" style={{ fontSize: '0.8rem' }}>
             <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here</code>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) return <div className="p-4 text-danger">Error loading maps</div>;
  if (!isLoaded) return <div className="p-4">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center}
      options={options}
    >
      {salonMarkers.map((marker) => (
        <MarkerF
          key={marker.id}
          position={marker.position}
          onClick={() => setSelectedSalon(marker)}
          icon={{
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
            fillColor: "#A34E32",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
            scale: 1.5,
            labelOrigin: { x: 12, y: -10 } as google.maps.Point
          }}
          label={{
            text: marker.name,
            color: "#1E1915",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        />
      ))}

      {selectedSalon && (
        <InfoWindowF
          position={selectedSalon.position}
          onCloseClick={() => setSelectedSalon(null)}
        >
          <div className="p-1">
            <div className="fw-bold text-dark">{selectedSalon.name}</div>
            <div className="text-rust fw-bold small">From ${selectedSalon.price}</div>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
