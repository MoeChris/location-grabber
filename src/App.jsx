import { useState, useEffect } from "react";
import supabase from "./supabase-client.js";
import Logo from "./assets/Logo.png";
import "./App.css";

const App = () => {
  const [codeMassar, setCodeMassar] = useState("");
  const [codeBus, setCodeBus] = useState("");

  const [latitude, setLatitude] = useState(null);
  const [longtitude, setLongtitude] = useState(null);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // Load Bus Code and disable the input if it exists
  useEffect(() => {
    const savedBus = localStorage.getItem("codeBus");
    if (savedBus) {
      setCodeBus(savedBus);
    }
  }, []);

  const busIsLocked = localStorage.getItem("codeBus") ? true : false;

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongtitude(position.coords.longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setPendingSubmit(false);
        }
      );
    }
  };

  const addData = (e) => {
    e.preventDefault();
    setPendingSubmit(true);
    getLocation();
  };

  useEffect(() => {
    const doInsert = async () => {
      if (!pendingSubmit) return;
      if (latitude == null || longtitude == null) return;

      const { data, error } = await supabase.from("location").insert([
        {
          code_massar: codeMassar,
          latitude,
          longtitude,
          bus_code: codeBus,
        },
      ]);

      if (error) {
        console.log("Error inserting data:", error);
      } else {
        console.log("Data inserted:", data);

        if (!localStorage.getItem("codeBus")) {
          localStorage.setItem("codeBus", codeBus);
        }

        setCodeMassar("");
      }

      setPendingSubmit(false);
    };

    doInsert();
  }, [pendingSubmit, latitude, longtitude, codeMassar, codeBus]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pt-10 gap-y-36">
      <img src={Logo} alt="" width={150} height={150} className="mx-auto" />

      <form className="flex flex-col gap-4 w-96 mx-auto" onSubmit={addData}>
        
        <input
          type="text"
          placeholder="Code Bus"
          className="border border-gray-500 p-1 rounded"
          value={codeBus}
          disabled={busIsLocked}   // lock after first submit
          onChange={(e) => setCodeBus(e.target.value)}
        />
        <input
          type="text"
          placeholder="Code Massar"
          className="border border-gray-500 p-1 rounded"
          value={codeMassar}
          onChange={(e) => setCodeMassar(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-700 text-white font-semibold p-2 rounded hover:bg-blue-900"
        >
          Submit
        </button>

      </form>
    </div>
  );
};

export default App;
