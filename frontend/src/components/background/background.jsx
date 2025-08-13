import { useEffect, useState, useRef, useMemo } from 'react';
import './background.css';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import NewMarker from '../../assets/marker.png';
import tzlookup from "tz-lookup";

function Background() {
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [similarPlace, setSimilarPlace] = useState("");
    const [timezone, setTimezone] = useState("EST");

    // defining the icon for the marker
    const MarkerIcon = L.icon({
        iconUrl: NewMarker,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });


    // get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setLocationLoaded(true);
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
        setSimilarPlace("loading...");

        try {
            const response = await fetch('http://localhost:4000/findSimilarPlace' || 'https://technical-assessment-25-26-production.up.railway.app/findSimilarPlace', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userLocation: location }),
            });

            if (!response.ok) {
                console.log("error fetching similar place");
            }

            const data = await response.json();
            setSimilarPlace(data.similarPlace);
        } catch (error) {
            console.error("error fetching similar place:", error);
            setSimilarPlace("error fetching similar place");
        }
    }

    // to refresh the similar location everytime the user drags the marker
    useEffect(() => {
        if (locationLoaded) {
            getSimilarPlace(userLocation);
            const newTZ = tzlookup(userLocation[0], userLocation[1]);
            setTimezone(newTZ || "EST");
        }
    }, [userLocation, locationLoaded]);

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

        const getLocalTimes = () => {
            const sunrise = getSunrise(userLocation[0], userLocation[1]);
            const sunset = getSunset(userLocation[0], userLocation[1]);
            
            try {
                const sunriseLocal = sunrise.toLocaleTimeString("en-US", {
                    timeZone: timezone,
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit'
                });
                
                const sunsetLocal = sunset.toLocaleTimeString("en-US", {
                    timeZone: timezone,
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit'
                });
                
                return { sunrise: sunriseLocal, sunset: sunsetLocal };
            } catch (error) {
                console.error("Error formatting times:", error);
                // Fallback to default formatting if timezone is invalid
                return {
                    sunrise: sunrise.toLocaleTimeString("en-US", { hour12: true, hour: 'numeric', minute: '2-digit' }),
                    sunset: sunset.toLocaleTimeString("en-US", { hour12: true, hour: 'numeric', minute: '2-digit' })
                };
            }
        };

        const localTimes = getLocalTimes();

        return (
            <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={userLocation}
            ref={markerRef}
            icon={MarkerIcon}
            >
                <Popup minWidth={150} className="popup">
                    <span>
                    <span style={{ color: "#FFB487" }}>sunrise: {localTimes.sunrise}</span> <br />
                    <span style={{ color: "#415777" }}>sunset: {localTimes.sunset}</span> <br />
                    <br />
                    <span style={{ color: "#151515" }}>your location has similar times to:</span> <br />
                    <span style={{ color: "#151515" }}>{similarPlace}</span>
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
                    scrollWheelZoom={true}
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