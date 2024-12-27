'use client'
import { Input } from "@/components/ui/input";
import { Layers, Search, Menu, QrCode } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { DM_Sans, Roboto, Roboto_Condensed } from "next/font/google";
import dynamic from "next/dynamic";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";
import { useParams } from "next/navigation";
import  Axios  from "axios";
import { useSearchParams } from "next/navigation";
// import MapComponent from "@/components/new_map";
// import Map from "@/components/map";

const Map = dynamic(() => import('@/components/user-map'), { ssr: false });

const headingFont = Roboto_Condensed({ subsets: ['latin'], weight: 'variable' });
const contentFont = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

export default function Home() {
  const [coordinates, setCoordinates] = useState([])
  const [fetched, setFetched] = useState(false)
  const [Data, setData] = useState([])
  const [value, setValue] = useState([])
  const [suggestData, setSuggestData] = useState([]);
  const [layerType, setLayerType] = useState('OpenStreetMap')
  const [layerMode, setLayerMode] = useState('light')
  const [QROpen, setQROpen] = useState(false)
  const [boothId, setboothId] = useState(1);
  const [userEmail, setUserEmail] = useState("")
  const [boothDetail, setboothDetail] = useState({})
  const email = useSearchParams().get('email')
  useLayoutEffect(() => {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
    };

    function success(pos) {
      const crd = pos.coords;

      setCoordinates([crd.latitude, crd.longitude])
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

  }, [setCoordinates])

  useEffect(() => {
    console.log(email);
    setUserEmail(email)
    if (userEmail !== "") {
      Axios.post("http://localhost:3001/check-user", {
      email: userEmail,
    }).then((response) => {
      console.log(response);
      if (response.data[0].email && response.data[0].boothId) {
        setboothId(response.data[0].boothId);
      }
    });
  }
  }, [userEmail])

  useEffect(() => {
    console.log(boothId);
    if (boothId) {
      Axios.post("http://localhost:3001/get-booth-details", {
      boothId: boothId,
    }).then((response) => {
      console.log(response);
      if (response.data[0].lat && response.data[0].lng) {
        setboothDetail(response.data[0])
        // console.log(boothCoords);
      }
    });
  }
  }, [boothId])

  useEffect(() => {
    document.getElementById('input')?.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const place = document.getElementById('input')?.value.toString();

        const res = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=` + place + `&apiKey=SOV8D2I84TlonDGDDlSlKHuGbWNTRyrvXAwmUZDkXMc`);
        const data = await res.json();
        const lat = await data.items[0].position.lat;
        const lng = await data.items[0].position.lng;
        setFetched(true)
        setData(data)
        setSuggestData([])
      }
    })
    if (fetched) {
      setCoordinates([Data.items[0].position.lat, Data.items[0].position.lng])
      setFetched(false)
    }
  }, [fetched])

  useEffect(() => {
    const getSuggestions = (async () => {
      const res = await fetch(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=` + coordinates[0] + `,` + coordinates[1] + `&limit=5&lang=en&q=` + value + `&apiKey=SOV8D2I84TlonDGDDlSlKHuGbWNTRyrvXAwmUZDkXMc`)
      const data = await res.json();
      const filteredData = data.items.filter((item) => item.resultType === "administrativeArea" || item.resultType === 'locality');
      setSuggestData(filteredData)
    }
    );

    if (value.length !== 0) {
      getSuggestions();
    } else {
      setSuggestData([])
    }

  }, [value])

  function changeTheMap(data) {
    setSuggestData([]);
    setValue([])
    setCoordinates([data.position.lat, data.position.lng]);
  }

  const onLayerClick = (layer, mode) => {
    setLayerType(layer)
    setLayerMode(mode)
  }

  return (
    <main className={headingFont.className + " relative max-w-screen text-neutral-900"}>
      <div className="absolute z-[99999] p-5 w-screen lg:w-fit">
        <div className="flex gap-5 items-center pb-5">
          <div className={cn("lg:w-[30vw] w-max rounded-full border-none text-xl font-semibold backdrop-blur overflow-hidden flex gap-5 items-center pl-2 pr-5", layerMode === 'dark' ? 'bg-neutral-300/80 text-neutral-900' : 'bg-neutral-700/80 text-neutral-100')}>
            <Input id="input" className={cn("bg-transparent border-none rounded-full text-xl")} onChange={e => setValue(e.target.value)} value={value} />
            <Search className={cn(layerMode === 'dark' ? 'text-neutral-900' : 'text-neutral-100')} />
          </div>
          <div className={cn("rounded-full text-xl font-medium backdrop-blur p-2", layerMode === 'dark' ? 'bg-neutral-300/80' : 'bg-neutral-700/80')}>
            <DropdownMenu>
              <DropdownMenuTrigger className={cn("z-[99999] border-none outline-none flex items-center", layerMode === 'dark' ? 'text-neutral-900' : 'text-neutral-100')}>
                <Layers />
              </DropdownMenuTrigger>
              <DropdownMenuContent className={cn("z-[99999] border-none outline-none mt-5 backdrop-blur", layerMode === 'dark' ? 'text-neutral-900 bg-neutral-300/80' : 'text-neutral-100 bg-neutral-700/80', contentFont.className)}>
                <DropdownMenuLabel>Choose the layer you prefer:</DropdownMenuLabel>
                <DropdownMenuSeparator className={cn(layerMode === 'dark' ? "bg-neutral-800" : "bg-neutral-200")} />
                <DropdownMenuItem>
                  <button onClick={() => onLayerClick('OpenStreetMap', 'light')}>
                    OpenStreetMap Light
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => onLayerClick('OpenStreetMap', 'dark')}>
                    OpenStreetMap Dark
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => onLayerClick('HERE', 'light')}>
                    HERE Maps Light
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => onLayerClick('HERE', 'dark')}>
                    HERE Maps Dark
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className={cn("rounded-full text-xl font-medium backdrop-blur p-2", layerMode === 'dark' ? 'bg-neutral-300/80' : 'bg-neutral-700/80')}>
            <div role="button" className={cn("z-[99999] border-none outline-none flex items-center", layerMode === 'dark' ? 'text-neutral-900' : 'text-neutral-100')} onClick={() => { setQROpen(!QROpen) }}>
              <QrCode />
            </div>
          </div>
        </div>
        <div className={cn(suggestData.length !== 0 ? "z-[99999] flex flex-col gap-2 backdrop-blur w-full lg:w-[30vw] rounded-xl p-5" : 'hidden', layerMode === 'dark' ? 'bg-neutral-300/80 text-neutral-900' : 'bg-neutral-700/80 text-neutral-100')}>
          {suggestData.map((data, id) => {
            return (
              <div key={id} role="button" onClick={e => changeTheMap(data)}>
                <h1 className={cn(headingFont.className, "text-xl font-medium")}>
                  {data.title}
                </h1>
                <p className={cn(contentFont.className, "flex gap-2")}>
                  <span>
                    {data.resultType === "administrativeArea" && data.administrativeAreaType}
                    {data.resultType === "locality" && data.localityType}
                  </span>
                  <span>
                    ({data.position.lat}, {data.position.lng})
                  </span>
                </p>
              </div>
            )
          })}
        </div>
      </div>
      {QROpen && (<div className="absolute z-[99999] p-5 lg:w-fit top-0 right-0 w-[20vw]">
        <div className={cn("rounded-xl text-xl font-medium backdrop-blur p-5 w-[20vw]", layerMode === 'dark' ? 'bg-neutral-300/80' : 'bg-neutral-700/80')}>
          <div className="overflow-hidden rounded-lg">
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={"fnadsjfnadkfnads"}
              viewBox={`0 0 256 256`}
              bgColor={layerMode === 'dark' ? "#CCd4d4d4" : '#CC404040'}
              fgColor={layerMode !== 'dark' ? "#d4d4d4" : '#404040'}
              level="Q"
            />
          </div>
          <h1 className={cn(headingFont.className, layerMode === 'dark' ? 'text-neutral-900' : 'text-neutral-100', "text-xl mt-5 font-semibold text-center")}>
            Scan this QR Code at the station
          </h1>
        </div>
      </div>)}
      <Map coordinates={coordinates} layer={layerType} mode={layerMode} boothDetail={boothDetail} />
    </main>
  );
}
