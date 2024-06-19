import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cargarRestaurantes } from '../utiles/consultores/restaurantes';
import { cargarAvistamientos } from '../utiles/consultores/avistamientos';
import ImgConstructor from '../utiles/multimedia/ImgConstructor';
import { useRouter } from 'next/navigation';  

const StarIcon = () => (
  <span className="ml-1 sm:ml-2">
    <svg className="h-4 w-4 sm:h-6 sm:w-6" viewBox="0 0 47.94 47.94" fill="#ede607">
      <path d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"/>
    </svg>
  </span>
);

interface MapPanelProps {
  centro: [number, number];
}

const MapPanel: React.FC<MapPanelProps> = ({ centro }: MapPanelProps) => {
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [avistamientos, setAvistamientos] = useState<any[]>([]);
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const router = useRouter();


  const handleCardClick = (id: string) => {
    localStorage.setItem('selectedRestaurantId', id);
    router.push('/paginaRestaurante'); // Redirige usando next/router
  };

  useEffect(() => {
    // Cargar todos los restaurantes
    cargarRestaurantes()
      .then(data => {
        setRestaurantes(data);
      })
      .catch(error => {
        console.error('Error al cargar todos los restaurantes:', error);
      });

    cargarAvistamientos()
      .then(data => {
        setAvistamientos(data);
      })
      .catch(error => {
        console.error('Error al cargar avistamientos en el map Panel', error);
      });
  }, [centro]);

  const handleMapClick = () => {
    setShowDetail(false);
  };

  const handleMarkerClick = (restaurante: any) => {
    setRestauranteSeleccionado(restaurante);
    setShowDetail(true);
  };

  return (
    <div onClick={handleMapClick}>
      <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
        <MapContainer center={centro} zoom={16} minZoom={10} maxZoom={20}
          maxBounds={[[-90, -180], [90, 180]]}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Circle center={centro} radius={700} />
          <Marker position={centro} icon={L.icon({
            iconUrl: 'ubActual.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
          })} />

          {/* Marcadores de restaurantes */}
          {restaurantes.map((restaurante) => (
            <Marker
              key={restaurante.id_restaurante}
              position={[restaurante.coordenada_latitud, restaurante.coordenada_longitud]}
              icon={L.icon({
                iconUrl: restaurante.icono_base + ".png",
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -16],
              })}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(restaurante);
                },
              }}
            >
              <Popup>
                <h3>{restaurante.nombre_restaurante}</h3>
              </Popup>
            </Marker>
          ))}

          {avistamientos.map((avistamiento) => (
            <Marker
              key={avistamiento.id_avistamiento}
              position={[avistamiento.coordenada_latitud, avistamiento.coordenada_longitud]}
              icon={L.icon({
                iconUrl: avistamiento.icono + ".png",
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -16],
              })}
            >
              <Popup>
                <div>
                  <h3>{avistamiento.nombre_restaurante}</h3>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPanel;