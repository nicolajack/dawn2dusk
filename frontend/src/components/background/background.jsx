import { useEffect, useState, useRef, useMemo } from 'react';
import './background.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getSunrise, getSunset } from 'sunrise-sunset-js';

function Background() {
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [similarPlace, setSimilarPlace] = useState("");

    // get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setLocationLoaded(true);
                    getPlace(latitude, longitude);
                },
                (error) => {
                    console.error("error getting location", error);
                    setLocationLoaded(true);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setLocationLoaded(true);
        }
    }, []);

    // to get the similar location
    const getSimilarPlace = async (location) => {
        if (!location) return;
        setSimilarPlace("Loading...");

        try {
            const response = await fetch('http://localhost:4000/findSimilarPlace', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userLocation: location }),
            });

            if (!response.ok) {
                console.log("Error fetching similar place");
            }

            const data = await response.json();
            setSimilarPlace(data.similarPlace);
        } catch (error) {
            console.error("Error fetching similar place:", error);
            setSimilarPlace("Error fetching similar place");
            console.log("Error fetching similar place");
        } 
    }

    // to refresh the similar location everytime the user drags the marker
    useEffect(() => {
        if (userLocation) {
            getSimilarPlace(userLocation);
        }
    }, [userLocation]);

    // for sunrise set times
    const sunset = getSunset(userLocation[0], userLocation[1]);
    const sunrise = getSunrise(userLocation[0], userLocation[1]);

    function DraggableMarker() {
        const markerRef = useRef(null);

        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker != null) {
                        const newPosition = marker.getLatLng();
                        setUserLocation([newPosition.lat, newPosition.lng])
                }
                },
            }),
            [setUserLocation]
        );

        return (
            <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={userLocation}
            ref={markerRef}
            >
                <Popup minWidth={150} className="popup">
                    <span>
                    <span style={{ color: "#F0CD79" }}>sunrise: {sunrise.toLocaleTimeString()}</span> <br />
                    <span style={{ color: "#524982" }}>sunset: {sunset.toLocaleTimeString()}</span> <br />
                    <span style={{ color: "#D775BB" }}>{similarPlace}</span>
                    </span>
                </Popup>
            </Marker>
        );
    }

    // return the background div
    return (
        <div className="bg">
            <div className="container">
                <div className="map">
                {locationLoaded && (
                <MapContainer 
                    center={userLocation} 
                    zoom={5} 
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableMarker />
                </MapContainer>
                )}
                </div>
            </div>
        </div>
    )
}

export default Background