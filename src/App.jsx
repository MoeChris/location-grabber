import { useState, useEffect } from "react";
import "./App.css";
import supabase from "./supabase-client.js";

function App() {
  const [codeMassar, setCodeMassar] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longtitude, setLongtitude] = useState(null);
  const [pendingSubmit, setPendingSubmit] = useState(false);

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
    } else {
      console.log("Geolocation is not supported by this browser.");
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
      // only proceed when we have both coordinates
      if (latitude == null || longtitude == null) return;

      const { data, error } = await supabase
        .from("location")
        .insert([
          {
            code_massar: codeMassar,
            latitude: latitude,
            longtitude: longtitude,
          },
        ]);

      if (error) {
        console.log("Error inserting data:", error);
      } else {
        console.log("Data inserted successfully:", data);
        setCodeMassar("");
      }
      setPendingSubmit(false);
    };

    doInsert();
  }, [codeMassar, latitude, longtitude, pendingSubmit]);
  return (
    <>
      <form
        action=""
        method=""
        className="flex flex-col gap-4 w-96 mx-auto mt-10"
        onSubmit={addData}
      >
        <input
          type="text"
          placeholder="Code Massar"
          className="border border-gray-500 p-1 rounded"
          value={codeMassar}
          onChange={(e) => {
            setCodeMassar(e.target.value);
          }}
        />
        <button
          type="submit"
          className="bg-blue-700 text-white font-semibold p-2 rounded cursor-pointer hover:bg-blue-900"
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default App;
