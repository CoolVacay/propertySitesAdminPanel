// app/page.tsx  (or wherever your Home component lives)

"use client"; // because we’re using hooks

import { useState, useEffect } from "react";
import PropertyJsonEditor from "./PropertyJsonEditor";
const DUMMY_PROPS = [
  { id: "http://localhost:3000/", name: "Local Host" },
  { id: "https://property-sites.vercel.app/", name: "Inn at camache" },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState(DUMMY_PROPS[0].id);

  // useEffect(() => {
  //   // 1. Replace this with your real “list all properties” endpoint
  //   fetch("/api/properties")
  //     .then((res) => {
  //       if (!res.ok) throw new Error(res.statusText);
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setProperties(data);
  //       if (data.length) setSelectedId(data[0].id);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to load properties:", err);
  //     });
  // }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <label
        htmlFor="property-select"
        className="block mb-2 font-medium text-gray-700"
      >
        Select Property:
      </label>
      <select
        id="property-select"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="mb-6 w-full p-2 border border-gray-300 rounded"
      >
        {DUMMY_PROPS.map((prop) => (
          <option key={prop.id} value={prop.id} className="text-black">
            {prop.name}
          </option>
        ))}
      </select>

      {selectedId ? (
        <PropertyJsonEditor propertyId={selectedId} />
      ) : (
        <p className="text-gray-500">No property selected.</p>
      )}
    </div>
  );
}
