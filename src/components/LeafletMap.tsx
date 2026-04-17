'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet-icons/marker-icon-2x.png',
  iconUrl: '/leaflet-icons/marker-icon.png',
  shadowUrl: '/leaflet-icons/marker-shadow.png',
})

export interface MapMarker {
  id: string
  title: string
  description?: string
  coordinates: { lat: number; lng: number }
  mapsUrl?: string
}

interface LeafletMapProps {
  markers: MapMarker[]
  zoom?: number
}

export default function LeafletMap({ markers, zoom = 13 }: LeafletMapProps) {
  const fallbackCenter: [number, number] = [36.4621, 7.4247]
  const center: [number, number] = markers[0]
    ? [markers[0].coordinates.lat, markers[0].coordinates.lng]
    : fallbackCenter

  return (
    <MapContainer center={center} zoom={zoom} style={{ width: '100%', height: '100%', minHeight: '260px' }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.coordinates.lat, marker.coordinates.lng]}>
          <Popup>
            <strong>{marker.title}</strong>
            {marker.description ? (
              <>
                <br />
                <span style={{ fontSize: '12px', color: '#555' }}>{marker.description}</span>
              </>
            ) : null}
            {marker.mapsUrl ? (
              <>
                <br />
                <a href={marker.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Maps</a>
              </>
            ) : null}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
