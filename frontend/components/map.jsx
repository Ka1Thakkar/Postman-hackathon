import { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import markerIcon from '@/public/marker.svg'
import L from 'leaflet';
import { CircleX } from "lucide-react";
import { DM_Serif_Display, DM_Sans, Roboto_Condensed, Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Axios from 'axios';
// import { RadioGroupItem, RadioGroup } from "./ui/radio-group";
// import { Input } from "./ui/input";
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
// import toast, { Toaster } from 'react-hot-toast';

const headingFont = Roboto_Condensed({ subsets: ['latin'], weight: 'variable' });
const contentFont = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

const myIcon = L.divIcon({
    html: `<img src=${markerIcon.src} alt="marker" />`,
    iconSize: [0, 0],
    className: 'leaflet-div-icon',
    iconAnchor: [-15, -15]
});

const Map = ({ coordinates, layer, mode }) => {
    const lat = coordinates[0]
    const lng = coordinates[1]
    const [markers, setMarkers] = useState([])
    const [Data, setData] = useState([])
    const [modal, setModal] = useState(false)
    const [markerData, setMarkerData] = useState([])
    const [locationData, setLocationData] = useState([])
    const [updating, setUpdating] = useState(false)


    const getMarkers = (async () => {
        console.log("inside getSuggestions");
        // const resHistoricalMonuments = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + coordinates[0] + `,` + coordinates[1] + `;r=200000&q=hospital&apiKey=XtQVI2v2Gva5boMgpLNShDE55F1dCyxN_vK_PyYhtWk`)
        const resTouristAttractions = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + coordinates[0] + `,` + coordinates[1] + `;r=200000&q=city+hall&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const resLandmarkAttractions = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=civic-community+center&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const resReligiousPlaces = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=school&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        // const resMuseums = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=museums&apiKey=XtQVI2v2Gva5boMgpLNShDE55F1dCyxN_vK_PyYhtWk`)
        // const dataHistoricalMonuments = await resHistoricalMonuments.json();
        const dataTouristAttractions = await resTouristAttractions.json();
        const dataLandmarkAttractions = await resLandmarkAttractions.json();
        // const dataMuseums = await resMuseums.json();
        const dataReligiousPlaces = await resReligiousPlaces.json();
        const data = dataReligiousPlaces?.items.concat(dataTouristAttractions?.items, dataLandmarkAttractions?.items)
        // const data = dataHistoricalMonuments.items
        setMarkers(data)
        console.log(data)
        setUpdating(false)
    }
    );
    useEffect(() => {
        if (coordinates[0] !== undefined && coordinates[1] !== undefined && !updating) {
            getMarkers();
        }

    }, [coordinates])

    function getActiveMarkers() {
        Axios.get("http://localhost:3001/fetch-booths").then(res => { console.log(res); setMarkers(res.data); setUpdating(true);})
    }

    return (
        <>
            <AnimatePresence>
                {modal && !updating && (<Modal markerData={markerData} state={modal} stateFunction={setModal} mode={mode} />)}
            </AnimatePresence>
            <AnimatePresence>
                {modal && updating && (<UpdateModal markerData={markerData} state={modal} stateFunction={setModal} mode={mode} />)}
            </AnimatePresence>
            <div className="absolute z-[99999] p-5 bottom-0 left-0 flex flex-col gap-5">
                <div role="button" onClick={() => { setModal(false); getMarkers();  }} className={cn("rounded-full backdrop-blur px-5 py-2 w-fit", mode === 'dark' ? 'bg-neutral-300/80' : 'bg-neutral-700/80')}>
                    Add new active station
                </div>
                <div role="button" onClick={() => { setModal(false); getActiveMarkers(); }} className={cn("rounded-full backdrop-blur px-5 py-2", mode === 'dark' ? 'bg-neutral-300/80' : 'bg-neutral-700/80')}>
                    Show Active Stations
                </div>
            </div>
            <MapContainer
                id="Map"
                center={[28.679079, 77.069710]}
                zoom={15}
                scrollWheelZoom={true}
                zoomControl={false}
                zoomAnimation
                className="w-[100vw] h-[100vh]"
            >
                {layer === 'HERE' && mode === 'light' && (<TileLayer
                    url={"https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?apiKey=dA79pI6GZbkml0izXgw5wOwGCVcMn_FK0cC50LGG4sc&ppi=320"}
                    // attribution="&copy; <a>HERE Maps</a> contributors" 
                    className=" grayscale"
                />)}
                {layer === 'HERE' && mode === 'dark' && (<TileLayer
                    url={"https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/reduced.night/{z}/{x}/{y}/512/png8?apiKey=dA79pI6GZbkml0izXgw5wOwGCVcMn_FK0cC50LGG4sc&ppi=320"}
                    // attribution="&copy; <a>HERE Maps</a> contributors" 
                    className=" grayscale contrast-200"
                />)}
                {layer === 'OpenStreetMap' && mode === 'light' && (<TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // attribution="&copy; <a>OpenStreetMap</a> contributors" 
                    className=" grayscale"
                />)}
                {layer === 'OpenStreetMap' && mode === 'dark' && (<TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // attribution="&copy; <a>OpenStreetMap</a> contributors" 
                    className=" grayscale invert"
                />)}
                <RecenterAutomatically lat={lat} lng={lng} />
                {markers && markers?.map((marker, index) => {
                    console.log(marker);
                    const markerLat = updating ? marker.lat : marker.position.lat
                    const markerLng = updating ? marker.lng : marker.position.lng
                    return (
                        <Marker icon={myIcon} key={index} position={marker !== undefined ? [markerLat, markerLng] : [lat, lng]}>
                            <Popup className="">
                                <div className="">
                                    <h1 className={cn(headingFont.className, " text-base font-semibold")}>
                                        {marker?.title || marker?.name}
                                    </h1>
                                    <button className={cn(contentFont.className, " text-blue-950 pt-2")} onClick={() => { setModal(true); setMarkerData(marker) }}>
                                        Read More...
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
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

const Modal = ({ markerData, state, stateFunction, mode }) => {

    const [name, setName] = useState(markerData.title);
    const [category, setCategory] = useState("Normal");
    // const [active, setActive] = useState("False");
    const [staff, setStaff] = useState(10);
    const [police, setPolice] = useState(10);
    const [total, setTotal] = useState(2);
    const [exists, setExists] = useState(false);
    const [open, setOpen] = useState(false)
    const [score, setScore] = useState(0)
    const [populationDensity, setPopulationDensity] = useState(Math.floor((Math.random() * 100) + 1))

    useEffect(() => {
        if (populationDensity > 90 && populationDensity <= 100) {
            setPolice(20)
            setStaff(10)
            setTotal(4)
        } else if (populationDensity > 75 && populationDensity <= 90) {
            setPolice(15)
            setStaff(7)
            setTotal(3)
        } else if (populationDensity > 25 && populationDensity <= 75) {
            setPolice(10)
            setStaff(5)
            setTotal(1)
        } else {
            setPolice(7)
            setStaff(4)
            setTotal(1)
        }
    }, [markerData])

    async function getScore() {
        const lat = markerData.position.lat;
        const lng = markerData.position.lng;

        const resHospitals = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + lat + `,` + lng + `;r=2000&q=hospital&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const dataHospitals = await resHospitals.json();
        const resPoliceStations = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + lat + `,` + lng + `;r=2000&q=police+station&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const dataPoliceStations = await resPoliceStations.json();
        const resFireStations = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + lat + `,` + lng + `;r=5000&q=fire+department&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const dataFireStations = await resFireStations.json();
        const resIndustrial = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + lat + `,` + lng + `;r=5000&q=industrial+zone&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const dataIndustrial = await resIndustrial.json();
        const resCargo = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + lat + `,` + lng + `;r=5000&q=cargo+center&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const dataCargo = await resCargo.json();

        let hosp_len = dataHospitals.items.length;
        let pol_len = dataPoliceStations.items.length;
        let fire_len = dataFireStations.items.length;
        let ind_len = dataIndustrial.items.length;
        let carg_len = dataCargo.items.length;
        console.log(hosp_len + pol_len + fire_len + ind_len + carg_len)
        setScore((hosp_len * 0.3 + pol_len * 0.4 + fire_len * 0.3 + (ind_len + carg_len) * (-0.2)))

    }

    useEffect(() => {
        const lat = markerData.position.lat;
        const lng = markerData.position.lng;
        Axios.post("http://localhost:3001/check-booth", {
            lat: lat,
            lng: lng
        }).then((response) => {
            console.log(response);
            if (response.data.message) {
                setExists(false);
            }
            else {
                setName(response.data[0].name);
                setCategory(response.data[0].category);
                setTotal(response.data[0].total);
                setStaff(response.data[0].staff);
                setPolice(response.data[0].police);
                setExists(true);
                // setActive("True")
            }
        });

        getScore();

    }, [markerData])

    function addBooth() {
        const lat = markerData.position.lat;
        const lng = markerData.position.lng;
        Axios.post("http://localhost:3001/add-booth", {
            lat: lat,
            lng: lng,
            name: markerData.title,
            category: category,
            // active: active,
            total: total,
            staff: staff,
            police: police,
        }).then((response) => {
            console.log(response);
            if (response.data.message === "Booth successfully registered") {
                // setExists(false);
                console.log(response.data.message);
                toast('Successfully added');
            }
            else if (response.data.message === "Booth already registered") {

            }
        });
    }


    return (
        <>
        <div>
            {/* <Toaster/> */}
        </div>
            {!exists && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                exit={{ opacity: 0 }}
                className={cn("absolute z-[9999] h-fit lg:h-screen lg:top-0 right-0 flex items-end lg:items-end p-5 w-[100vw] lg:w-fit", contentFont.className)}
            >
                <motion.div
                    initial={{ opacity: 0, y: 500 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    exit={{ opacity: 0, y: 500 }}
                    className={cn("lg:w-[30vw] w-full h-fit backdrop-blur-xl p-5 rounded-2xl z-[99999] relative overflow-y-auto", mode === 'dark' ? 'bg-neutral-300/80 text-neutral-900' : 'bg-neutral-700/80 text-neutral-100')}
                >
                    <div role="button" className={cn("fixed top-5 right-5", mode === 'dark' ? 'text-red-700' : 'text-red-400')} onClick={() => stateFunction(!state)}>
                        <CircleX size={30} />
                    </div>
                    <div className=" flex flex-col gap-2">
                        <p className={cn("text-4xl font-semibold", headingFont.className)}>
                            {markerData.title}
                        </p>
                        {/* <p className="pt-10 text-sm font-light">
                            <span className="font-bold">Address</span>: {markerData.address.label || markerData.address}
                        </p> */}
                        <div className="flex gap-5 items-start pt-2">
                            <p className="text-sm font-bold">
                                Category:
                            </p>
                            <div className="text-sm">
                                <RadioGroup defaultValue="option-one">
                                    <div role="button" onClick={() => setCategory('Normal')} className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-one" id="option-one" onCheck={() => setCategory('Normal')} />
                                        <p htmlFor="option-one">Normal</p>
                                    </div>
                                    <div role="button" onClick={() => setCategory('Disability Friendly')} className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-two" id="option-two" onCheck={() => setCategory('Disability Friendly')} />
                                        <p htmlFor="option-two">Disability Friendly</p>
                                    </div>
                                    <div role="button" onClick={() => setCategory('Senior Citizen Friendly')} className="flex items-center space-x-2">
                                        <RadioGroupItem value="Senior Citizen Friendly" id="option-three" onCheck={() => setCategory('Senior Citizen Firendly')} />
                                        <p htmlFor="option-two">Senior Citizen Friendly</p>
                                    </div>
                                </RadioGroup>

                            </div>
                        </div>
                        {/* <div className="flex gap-5 items-start pt-2">
                            <p className="text-sm font-bold">
                                Active:
                            </p>
                            <p className="text-sm">
                                {active}
                            </p>
                        </div> */}
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                These are the recommended number of Police, Emergency Staff and Number of booths for the elections. (According to the population density)
                            </p>
                        </div>
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                Staff:
                            </p>
                            <Input value={staff} onChange={e => { setStaff(parseInt(e.target.value, 10)); if (e.target.value === "") { setStaff(0) }; }} />
                        </div>
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                Police:
                            </p>
                            <Input onChange={e => { setPolice(parseInt(e.target.value, 10)); if (e.target.value === "") { setPolice(0) }; }} value={police} />
                        </div>
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                Total Number of Booths:
                            </p>
                            <Input onChange={e => { setTotal(parseInt(e.target.value, 10)); if (e.target.value === "") { setTotal(0) }; }} value={total} />
                        </div>
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                Score:
                            </p>
                            <p className="text-sm">
                                {score}
                            </p>
                        </div>
                        <div role="button" className="text-sm py-2 px-5 bg-neutral-500/40 w-fit rounded-xl mt-5" onClick={() => { addBooth(); setExists(true) }}>
                            Add Station
                        </div>
                    </div>
                </motion.div>

            </motion.div>}
            {exists && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                exit={{ opacity: 0 }}
                className={cn("absolute z-[9999] h-fit lg:h-screen lg:top-0 right-0 flex items-end lg:items-end p-5 w-[100vw] lg:w-fit", contentFont.className)}
            >
                <motion.div
                    initial={{ opacity: 0, y: 500 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    exit={{ opacity: 0, y: 500 }}
                    className={cn("lg:w-[30vw] w-full h-fit backdrop-blur-xl p-5 rounded-2xl z-[99999] relative overflow-y-auto", mode === 'dark' ? 'bg-neutral-300/80 text-neutral-900' : 'bg-neutral-700/80 text-neutral-100')}
                >
                    <div role="button" className={cn("fixed top-5 right-5", mode === 'dark' ? 'text-red-700' : 'text-red-400')} onClick={() => stateFunction(!state)}>
                        <CircleX size={30} />
                    </div>
                    <div className=" flex flex-col gap-2">
                        <p className={cn("text-4xl font-semibold", headingFont.className)}>
                            {name}
                        </p>
                        {/* <p className="pt-10 text-sm font-light">
                            <span className="font-bold">Address</span>: {markerData.address.label}
                        </p> */}
                        <div className="flex gap-5 items-start pt-2">
                            <p className="text-sm font-bold">
                                Category:
                            </p>
                            <div className="text-sm">
                                {category}
                            </div>
                        </div>
                        {/* <div className="flex gap-5 items-start pt-2">
                            <p className="text-sm font-bold">
                                Active:
                            </p>
                            <p className="text-sm">
                                {active}
                            </p>
                        </div> */}
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                Staff:
                            </p>
                            <p className="text-sm">
                                {staff}
                            </p>
                        </div>
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                Police:
                            </p>
                            <p className="text-sm">
                                {police}
                            </p>
                        </div>
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                Total Number of Booths:
                            </p>
                            <p className="text-sm">
                                {total}
                            </p>
                        </div>
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                Score:
                            </p>
                            <p className="text-sm">
                                {score}
                            </p>
                        </div>
                        {/* <div className=" text-xs w-fit rounded-xl mt-5 text-red-700">
                            This station is already an active polling station.
                        </div> */}
                    </div>
                </motion.div>

            </motion.div>}
        </>
    )
}

const UpdateModal = ({ markerData, state, stateFunction, mode }) => {
    console.log(markerData)
    const [name, setName] = useState(markerData.name);
    const [category, setCategory] = useState("Normal");
    // const [active, setActive] = useState("False");
    const [staff, setStaff] = useState(10);
    const [police, setPolice] = useState(10);
    const [total, setTotal] = useState(2);
    const [exists, setExists] = useState(false);
    const [open, setOpen] = useState(false)
    const [score, setScore] = useState(0)

    async function getScore() {
        const lat = markerData.lat;
        const lng = markerData.lng;

        const resHospitals = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + lat + `,` + lng + `;r=2000&q=hospital&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const dataHospitals = await resHospitals.json();
        const resPoliceStations = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + lat + `,` + lng + `;r=2000&q=police+station&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const dataPoliceStations = await resPoliceStations.json();
        const resFireStations = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + lat + `,` + lng + `;r=5000&q=fire+department&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const dataFireStations = await resFireStations.json();
        const resIndustrial = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + lat + `,` + lng + `;r=5000&q=industrial+zone&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const dataIndustrial = await resIndustrial.json();
        const resCargo = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:` + lat + `,` + lng + `;r=5000&q=cargo+center&apiKey=kGazDsQs8YlydHOPeHk7RSPIWhIQ1CIyscHpeqU8LQ4`)
        const dataCargo = await resCargo.json();

        let hosp_len = dataHospitals.items.length;
        let pol_len = dataPoliceStations.items.length;
        let fire_len = dataFireStations.items.length;
        let ind_len = dataIndustrial.items.length;
        let carg_len = dataCargo.items.length;
        console.log(hosp_len + pol_len + fire_len + ind_len + carg_len)
        setScore((hosp_len * 0.3 + pol_len * 0.4 + fire_len * 0.3 + (ind_len + carg_len) * (-0.2)))

    }

    useEffect(() => {
        const lat = markerData.lat;
        const lng = markerData.lng;
        Axios.post("http://localhost:3001/check-booth", {
            lat: lat,
            lng: lng
        }).then((response) => {
            console.log(response);
            if (response.data.message) {
                setExists(false);
            }
            else {
                setName(response.data[0].name);
                setCategory(response.data[0].category);
                setTotal(response.data[0].total);
                setStaff(response.data[0].staff);
                setPolice(response.data[0].police);
                setExists(true);
                // setActive("True")
            }
        });


    }, [markerData,])


    function updateBooth() {
        const lat = markerData.lat;
        const lng = markerData.lng;
        Axios.put("http://localhost:3001/update-booth", {
            lat: lat,
            lng: lng,
            category: category,
            // active: active,
            total: total,
            staff: staff,
            police: police,
        }).then((response) => {
            console.log(response);
            if (response.data.message) {
                stateFunction(false)
            }
            else {

            }
        });
    }

    // function deleteBooth() {
    //     const lat = markerData.lat;
    //     const lng = markerData.lng;
    //     Axios.post("http://localhost:3001/delete-booth", {
    //         lat: lat,
    //         lng: lng,
    //     }).then((response) => {
    //         console.log(response);
    //         if (response.data.message==="Booth removed successfully") {
    //             console.log("lmaoo");
    //             setExists(false);
    //             stateFunction(false)
    //         }
    //     });
    // }
    return (
        <>
            {exists && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                exit={{ opacity: 0 }}
                className={cn("absolute z-[9999] h-fit lg:h-screen lg:top-0 right-0 flex items-end lg:items-end p-5 w-[100vw] lg:w-fit", contentFont.className)}
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
                    <div className=" flex flex-col gap-2">
                        <p className={cn("text-5xl font-semibold", headingFont.className)}>
                            {name}
                        </p>
                        {/* <p className="pt-10 text-sm font-light">
                            <span className="font-bold">Address</span>: {markerData.address.label || markerData.address}
                        </p> */}
                        <div className="flex gap-5 items-start pt-2">
                            <p className="text-sm font-bold">
                                Category:
                            </p>
                            <div className="text-sm">
                                <RadioGroup defaultValue="option-one">
                                    <div role="button" onClick={() => setCategory('Normal')} className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-one" id="option-one" onCheck={() => setCategory('Normal')} />
                                        <p htmlFor="option-one">Normal</p>
                                    </div>
                                    <div role="button" onClick={() => setCategory('Disability Friendly')} className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-two" id="option-two" onCheck={() => setCategory('Disability Friendly')} />
                                        <p htmlFor="option-two">Disability Friendly</p>
                                    </div>
                                    <div role="button" onClick={() => setCategory('Senior Citizen Friendly')} className="flex items-center space-x-2">
                                        <RadioGroupItem value="Senior Citizen Friendly" id="option-three" onCheck={() => setCategory('Senior Citizen Firendly')} />
                                        <p htmlFor="option-two">Senior Citizen Friendly</p>
                                    </div>
                                </RadioGroup>

                            </div>
                        </div>
                        {/* <div className="flex gap-5 items-start pt-2">
                            <p className="text-sm font-bold">
                                Active:
                            </p>
                            <p className="text-sm">
                                {active}
                            </p>
                        </div> */}
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                Staff:
                            </p>
                            <Input value={staff} onChange={e => { setStaff(parseInt(e.target.value, 10)); if (e.target.value === "") { setStaff(0) }; }} />
                        </div>
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                Police:
                            </p>
                            <Input onChange={e => { setPolice(parseInt(e.target.value, 10)); if (e.target.value === "") { setPolice(0) }; }} value={police} />
                        </div>
                        <div className="flex gap-5 items-center pt-2">
                            <p className="text-sm font-bold">
                                Total Number of Booths:
                            </p>
                            <Input onChange={e => { setTotal(parseInt(e.target.value, 10)); if (e.target.value === "") { setTotal(0) }; }} value={total} />
                        </div>
                        <div className="flex gap-5">
                            <div role="button" className="text-sm py-2 px-5 bg-neutral-500/40 w-fit rounded-xl mt-5" onClick={() => { updateBooth(); setExists(true) }}>
                                Update Station Details
                            </div>
                            {/* <div role="button" className="text-sm py-2 px-5 bg-neutral-500/40 w-fit rounded-xl mt-5" onClick ={() => { deleteBooth();}}>
                                Set as inactive station
                            </div> */}
                        </div>
                    </div>
                </motion.div>
            </motion.div>}
        </>
    )
}
