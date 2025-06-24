"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import PropertyJsonEditor from "./PropertyJsonEditor";

const DUMMY_PROPS = [
  { id: "http://localhost:3000/", name: "Local Host" },
  { id: "https://property-sites.vercel.app/", name: "Inn at Camache" },
];

// 🎯 your allow-list:
const ALLOWED_EMAILS = [
  "toni.gashi@lj-support.com",
  "amy.dobson@lemonjuice.biz",
];

export default function Home() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [selectedId, setSelectedId] = useState(DUMMY_PROPS[0].id);

  // once Clerk has loaded the user, check email and kick out if not allowed
  useEffect(() => {
    if (!isLoaded || !user) return;

    const primaryEmail = user.emailAddresses
      .find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress.toLowerCase();

    if (primaryEmail && !ALLOWED_EMAILS.includes(primaryEmail)) {
      // log them out immediately
      signOut();
    }
  }, [isLoaded, user, signOut]);

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
