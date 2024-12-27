import { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Polyline } from 'react-leaflet';
import markerIcon from '@/public/marker.svg'
import L from 'leaflet';
import { CircleX } from "lucide-react";
import { DM_Serif_Display, DM_Sans, Roboto_Condensed, Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Axios from "axios";

const headingFont = Roboto_Condensed({ subsets: ['latin'], weight: 'variable' });
const contentFont = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

const myIcon = L.divIcon({
    html: `<img src=${markerIcon.src} alt="marker" />`,
    iconSize: [0, 0],
    className: 'leaflet-div-icon',
    iconAnchor: [-15, -15]
});


const Map = ({ coordinates, boothDetail, layer, mode }) => {
    const lat = coordinates[0]
    const lng = coordinates[1]
    const [markers, setMarkers] = useState([])
    const [Data, setData] = useState([])
    const [modal, setModal] = useState(false)
    const [markerData, setMarkerData] = useState([])
    const [locationData, setLocationData] = useState([])
    const [routeData, setRouteData] = useState({})
    const lineOptions = { color: 'red', stroke : true, weight : 5, opacity:0.75}
    const [polyline, setPolyline] = useState([])
    const [polyExists, setPolyExists] = useState(false)
    function decodeInteger(character) {
        const DECODING_TABLE = [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, 62, -1, -1, 52, 53,
            54, 55, 56, 57, 58, 59, 60, 61, -1, -1,
            -1, -1, -1, -1, -1, 0, 1, 2, 3, 4,
            5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, -1, -1, -1, -1, 63, -1, 26, 27, 28,
            29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
            39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
            49, 50, 51
        ];

        // Get the ASCII code of the character
        const asciiCode = character.charCodeAt(0);

        // Check if the code is within the decoding table range
        if (asciiCode < 0 || asciiCode >= DECODING_TABLE.length) {
            return -1; // Invalid character
        }

        // Return the corresponding index from the decoding table
        return DECODING_TABLE[asciiCode];
    }
    function decodeHeader(encodedString) {
        // Check if the encoded string has at least 2 characters
        if (encodedString.length < 2) {
            throw new Error('Invalid encoded string: must have at least 2 characters');
        }

        const headerVersion = decodeInteger(encodedString[0]);
        const headerContent = decodeInteger(encodedString[1]);

        // Check if decoding of individual characters was successful
        if (headerVersion === -1 || headerContent === -1) {
            throw new Error('Invalid encoded string: failed to decode header characters');
        }

        const precision2d = headerContent & 0xF; // Bitwise AND with 0xF to get lower 4 bits
        const type3d = (headerContent >> 4) & 0x7; // Bitwise right shift by 4, then AND with 0x7 to get next 3 bits
        const precision3d = (headerContent >> 7) & 0xF; // Bitwise right shift by 7, then AND with 0xF to get last 4 bits

        return [precision2d, type3d, precision3d];
    }

    function decodeSignedDeltas(encodedDeltas) {
        const values = [];
        let nextValue = 0;
        let shift = 0;

        for (const character of encodedDeltas) {
            const chunk = decodeInteger(character);

            // Check for invalid character
            if (chunk === -1) {
                throw new Error('Invalid encoded string: failed to decode character');
            }

            const isLastChunk = (chunk & 0x20) === 0;
            const chunkValue = chunk & 0x1F;

            // Prepend chunk value to next_value
            nextValue = (chunkValue << shift) | nextValue;
            shift += 5;

            if (isLastChunk) {
                // Convert chunk_value to signed integer
                const signedValue = (nextValue & 1) === 1
                    ? -((nextValue + 1) >> 1) // Negative if first bit is 1
                    : (nextValue >> 1); // Positive if first bit is 0

                values.push(signedValue);
                nextValue = 0;
                shift = 0;
            }
        }

        return values;
    }

    function decodeFlexpolyline2D(encodedString, precision) {
        // Decode the signed deltas from the encoded string
        const deltas = decodeSignedDeltas(encodedString);

        const coordinates = [];
        let latitude = 0;
        let longitude = 0;

        for (let i = 0; i < deltas.length; i += 2) {
            latitude += deltas[i];
            longitude += deltas[i + 1];

            // Apply precision for coordinates
            coordinates.push([latitude / Math.pow(10, precision), longitude / Math.pow(10, precision)]);
        }

        return coordinates;
    }
    function foo(routeData) {
        console.log(routeData);
    }
    useEffect(() => {
        function getPolyline() 
        {
            Axios.get(`https://router.hereapi.com/v8/routes?transportMode=car&origin=${coordinates[0]},${coordinates[1]}&destination=${boothDetail.lat},${boothDetail.lng}&return=polyline&apikey=SOV8D2I84TlonDGDDlSlKHuGbWNTRyrvXAwmUZDkXMc`)
                .then(response => {setRouteData((response.data)); setPolyExists(true)})
                .catch(error => console.log(error));
        }

        if (coordinates[0] !== undefined && coordinates[1] !== undefined && boothDetail.lat !== NaN && boothDetail.lng !== NaN) {
            getPolyline();
        }
    }, [coordinates])
    useEffect(() => {
        // console.log(routeData)
        console.log(typeof (routeData))
        console.log(routeData)
        if (routeData.routes && routeData.routes.length > 0) {
            console.log("hello");
            console.log(routeData);
            const precision = decodeHeader(routeData.routes[0].sections[0].polyline)[0];
            console.log(precision);
            setPolyline(decodeFlexpolyline2D(routeData.routes[0].sections[0].polyline.substr(2), precision));
            console.log(polyline);
        }

    }, [routeData])
    useEffect(() => {
        const getMarkers = (async () => {
            // console.log("inside getSuggestions");
            // const resHistoricalMonuments = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=200000&q=hospital&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
            // const resTouristAttractions = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=200000&q=city+hall&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
            // const resLandmarkAttractions = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=civic-community+center&apiKey=`+process.env.LOCATION_API)
            // const resReligiousPlaces = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=school&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
            // const resMuseums = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=museums&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
            // const dataHistoricalMonuments = await resHistoricalMonuments.json();
            // const dataTouristAttractions = await resTouristAttractions.json();
            // const dataLandmarkAttractions = await resLandmarkAttractions.json();
            // const dataMuseums = await resMuseums.json();
            // const dataReligiousPlaces = await resReligiousPlaces.json();
            // const data = dataHistoricalMonuments.items.concat(dataTouristAttractions.items, dataLandmarkAttractions.items, dataMuseums.items, dataReligiousPlaces.items)
            // const data = dataLandmarkAttractions.items
            // setMarkers(data)
            // console.log(data)
        }
        );
        if (coordinates[0] !== undefined && coordinates[1] !== undefined) {
            getMarkers();
        }

    }, [coordinates])
    return (
        <>
            <AnimatePresence>
                {modal && (
                    <Modal boothDetail={boothDetail} state={modal} stateFunction={setModal} mode={mode} />
                )}
            </AnimatePresence>
            <MapContainer
                id="Map"
                center={[28.679079, 77.069710]}
                zoom={15}
                scrollWheelZoom={true}
                zoomControl={false}
                zoomAnimation
                className="w-[100vw] h-[100vh]"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // attribution="&copy; <a>OpenStreetMap</a> contributors" 
                    className=" grayscale"
                />
                <RecenterAutomatically lat={lat} lng={lng} />
                {polyExists && (<Marker icon={myIcon} position={boothDetail !== NaN ? [boothDetail.lat, boothDetail.lng] : [lat, lng]} className=" flex items-center justify-center">
                    <Popup>
                        <div className="">
                            <h1 className={cn(headingFont.className, " text-base font-semibold")}>
                                {boothDetail.name}
                            </h1>
                            <button className={cn(contentFont.className, " text-blue-950 pt-2")} onClick={() => {setModal(true)}}>
                                Read More...
                            </button>
                        </div>
                    </Popup>
                </Marker>)}
                {/* {markers?.map((marker, index) => {
                    return (
                        <Marker icon={myIcon} key={index} position={marker !== undefined ? [marker?.position.lat, marker?.position.lng] : [lat, lng]}>
                            <Popup className="">
                                <div className="">
                                    <h1 className={cn(headingFont.className, " text-base font-semibold")}>
                                        {marker?.title}
                                    </h1>
                                    <button className={cn(contentFont.className, " text-blue-950 pt-2")} onClick={() => {setModal(true); setMarkerData(marker)}}>
                                        Read More...
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })} */}
                {polyExists && <Polyline pathOptions={lineOptions} positions={polyline} smoothFactor={1} />}
            </MapContainer>
        </>
    );
}

export default Map;

const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat !== undefined) {
            map.setView([lat, lng]);
        } else {
            map.setView([28.679079, 77.069710]);
        }
    }, [lat, lng]);
    return null;
}

const Modal = ({ boothDetail, state, stateFunction, mode }) => {
    const [queue, setQueue] = useState(Math.floor((Math.random() * 200) + 20))
    const [avgTime, setAvgTime] = useState(queue * 2/boothDetail.total)
    const [avgTimeString, setAvgTimeString] = useState("")
    function timeConvert(n) {
        // Store the input number of minutes in a variable num
        var num = n;
        // Calculate the total hours by dividing the number of minutes by 60
        var hours = (num / 60);
        // Round down the total hours to get the number of full hours
        var rhours = Math.floor(hours);
        // Calculate the remaining minutes after subtracting the full hours from the total hours
        var minutes = (hours - rhours) * 60;
        // Round the remaining minutes to the nearest whole number
        var rminutes = Math.round(minutes);
        // Construct and return a string representing the conversion result
        const timeString = rhours + " hour(s) and " + rminutes + " minute(s)."
        setAvgTimeString(timeString)
    }
    useEffect(() => {
        timeConvert(avgTime)
    }, [boothDetail])
    // const getMessage = async (marker : any) => {
    //     if (marker.title !== undefined) {const res = await fetch('/api/claude-ai', {
    //         method : 'POST',
    //         headers :{
    //             'ContentType' : 'application/json'
    //         },
    //         body : JSON.stringify({
    //             someData : true,
    //             topic : marker.title
    //         })
    //     })}
    // }

    // useEffect(() => {
    //     getMessage(markerData)
    // })

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            exit={{ opacity: 0 }}
            className={cn("absolute z-[9999] h-fit lg:h-screen lg:top-0 bottom-0 left-0 flex items-end lg:items-end p-5 w-[100vw] lg:w-fit", contentFont.className)}
        >
            <motion.div
                initial={{ opacity: 0, y: 500 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                exit={{ opacity: 0, y: 500 }}
                className={cn("lg:w-[30vw] w-full h-fit backdrop-blur-xl p-10 rounded-2xl z-[99999] relative overflow-y-auto", mode === 'dark' ? 'bg-neutral-300/80 text-neutral-900' : 'bg-neutral-700/80 text-neutral-100')}
            >
                <div role="button" className={cn("fixed top-5 right-5", mode === 'dark' ? 'text-red-700' : 'text-red-400')} onClick={() => stateFunction(!state)}>
                    <CircleX size={30} />
                </div>
                <div className=" flex flex-col gap-1">
                    <p className={cn("text-5xl font-semibold", headingFont.className)}>
                        {boothDetail.name}
                    </p>
                    <p className="pt-10 text-sm font-light">
                        <span className="font-bold">Staff</span> : {boothDetail.staff}
                    </p>
                    <p className="text-sm font-light">
                        <span className="font-bold">Police</span> : {boothDetail.police}
                    </p>
                    <p className="text-sm font-light">
                        <span className="font-bold">Number of booths</span> : {boothDetail.total}
                    </p>
                    <p className="text-sm font-light">
                        <span className="font-bold">Queue</span> : {queue}
                    </p>
                    <p className="text-sm font-light">
                        <span className="font-bold">Queue Per Booth</span> : {Math.floor(queue/boothDetail.total)}
                    </p>
                    <p className="text-sm font-light">
                        <span className="font-bold">Average Time</span> : {avgTimeString}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}
