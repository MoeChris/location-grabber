import { useState, useEffect } from "react";
import supabase from "./supabase-client.js";
import Logo from "./assets/Logo.png";
import "./App.css";

const App = () => {
  const [codeMassar, setCodeMassar] = useState("");
  const [codeBus, setCodeBus] = useState("");

  // Load Bus Code once
  useEffect(() => {
    const savedBus = localStorage.getItem("codeBus");
    if (savedBus) setCodeBus(savedBus);
  }, []);

  const busIsLocked = Boolean(localStorage.getItem("codeBus"));

  const addData = (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longtitude = position.coords.longitude;

        const { error } = await supabase.from("location").insert([
          {
            code_massar: codeMassar,
            latitude,
            longtitude,
            bus_code: codeBus,
          },
        ]);

        if (error) {
          console.error(error);
          alert("Submission failed");
          return;
        }

        // Lock bus code after first successful submit
        if (!localStorage.getItem("codeBus")) {
          localStorage.setItem("codeBus", codeBus);
        }

        setCodeMassar("");
        alert("Submitted successfully");
      },
      (err) => {
        console.error(err);

        if (err.code === err.PERMISSION_DENIED) {
          alert("Please allow location access");
        } else if (err.code === err.TIMEOUT) {
          alert("Location timeout. Try again.");
        } else {
          alert("Unable to get location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pt-10 gap-y-30">
      <img src={Logo} alt="" width={150} height={150} className="mx-auto" />

      <form className="flex flex-col gap-4 w-96 mx-auto" onSubmit={addData}>
        <input
          type="text"
          placeholder="رقم الحافلة"
          className="border border-gray-500 p-1 rounded text-right"
          value={codeBus}
          disabled={busIsLocked}
          onChange={(e) => setCodeBus(e.target.value)}
        />

        <input
          type="text"
          placeholder="الرقم المدرسي"
          className="border border-gray-500 p-1 rounded text-right"
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
