"use client";
// components/PropertyJsonEditor.tsx
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// react-json-view gives you a tree editor: collapse/expand, inline edit, add/remove
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

export default function PropertyJsonEditor({ propertyId }) {
  const [data, setData] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("idle");

  // 1. load the JSON on mount (or whenever propertyId changes)
  useEffect(() => {
    const loadData = async () => {
      try {
        setStatus("idle");
        const res = await fetch(
          `/api/property-actions?propertyId=${propertyId}`,
          {
            cache: "no-cache",
          }
        );
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const json = await res.json();
        setData(json);
        setDirty(false);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    loadData();
  }, [propertyId]);

  // 2. save handler
  const save = async () => {
    if (!data) return;
    setStatus("saving");
    try {
      const res = await fetch(
        `/api/property-actions?propertyId=${propertyId}`,
        {
          method: "POST",
          cache: "no-cache",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setStatus("saved");
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
      setDirty(false);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "error" && !data) {
    return <div>Failed to load property data. Check console.</div>;
  }
  if (!data) {
    return <div>Loading…</div>;
  }

  return (
    <div>
      <ReactJson
        src={data}
        onEdit={(e) => {
          setData(e.updated_src);
          setDirty(true);
        }}
        onAdd={(e) => {
          setData(e.updated_src);
          setDirty(true);
        }}
        onDelete={(e) => {
          setData(e.updated_src);
          setDirty(true);
        }}
        collapsed={false}
        enableClipboard={true}
        // ─── 2. Tweak spacing & fonts ─────────────────────────────────────────
        style={{
          fontFamily: `"Fira Code", monospace`,
          fontSize: "18px",
          lineHeight: "1.6",
          padding: "1rem",
          borderRadius: "8px",
          backgroundColor: "#f6f8fa",
          border: "1px solid #e2e8f0",
        }}
        // ─── 3. Adjust indentation & array grouping ───────────────────────────
        indentWidth={6} // default is 2
        groupArraysAfterLength={20} // collapses long arrays into a summary
        // ─── 4. Hide or restyle data types & object sizes ────────────────────
        displayDataTypes={false} // removes the little `<number>` labels
        displayObjectSize={true} // shows “Object[4]” counts in the header
      />

      <button
        onClick={save}
        disabled={!dirty || status === "saving"}
        style={{ marginTop: 16 }}
        className={`
          px-4 py-2 rounded
          transition-colors duration-300
          ${status === "saving" ? "bg-blue-400 text-white" : ""}
          ${
            status === "saved"
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white"
          }
          ${status === "error" ? "bg-red-500 text-white" : ""}
          ${
            !dirty
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600 hover:cursor-pointer"
          }
        `}
      >
        {" "}
        <span
          key={status}
          className="block transition-opacity duration-300 ease-in-out"
        >
          {status === "saving"
            ? "Saving…"
            : status === "saved"
            ? "Saved!"
            : "Save Changes"}
        </span>
      </button>
      {status === "error" && dirty && (
        <p style={{ color: "red" }}>Error saving. See console.</p>
      )}
    </div>
  );
}
