"use client";
import Image from "next/image";
import { use, useEffect } from "react";
import { dijkstra } from "./dijkstra.js";
import { useState } from "react";
import React from "react";
const Home = () => {
  const [exclude, setExclude] = useState([]);
  const [header, setHeader] = useState("start");
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(0);
  const [error, setError] = useState("");
  const pageHeader = (header) => {
    switch (header) {
      case "start":
        return <div>Select the Start Node</div>;
      case "end":
        return <div>Select the End Node</div>;
      case "block":
        return <div>Select the Blocking Node</div>;
      case "default":
        return <div>Default</div>;
    }
  };

  let List = [];
  for (let i = 0; i < 100; i++) {
    List.push(
      <div
        id={i + 1}
        className="flex items-center justify-center w-10 h-10 border border-black"
        key={i + 1}
        onClick={() => {
          if (header === "start") {
            if (i + 1 === endNode) return;
            for (let i = 0; i < 100; i++) {
              if (i + 1 === endNode) continue;
              document.getElementById(i + 1).style.backgroundColor = "white";
              document.getElementById(i + 1).style.color = "black";
            }
            document.getElementById(i + 1).style.backgroundColor = "green";
            document.getElementById(i + 1).style.color = "white";
            setStartNode(i + 1);
          } else if (header === "end") {
            if (i + 1 === startNode) return;
            for (let i = 0; i < 100; i++) {
              if (i + 1 === startNode) continue;
              document.getElementById(i + 1).style.backgroundColor = "white";
              document.getElementById(i + 1).style.color = "black";
            }
            document.getElementById(i + 1).style.backgroundColor = "red";
            document.getElementById(i + 1).style.color = "white";
            setEndNode(i + 1);
          } else {
            if (exclude.includes(i + 1)) {
              document.getElementById(i + 1).style.backgroundColor = "white";
              document.getElementById(i + 1).style.color = "black";
              setExclude(exclude.filter((item) => item !== i + 1));
            } else {
              document.getElementById(i + 1).style.backgroundColor = "black";
              document.getElementById(i + 1).style.color = "white";
              setExclude([...exclude, i + 1]);
            }
          }
        }}
      >
        {i + 1}
      </div>
    );
  }

  const simulate = async (startNode, endNode) => {
    setError("");
    if (!startNode || !endNode) {
      console.log(startNode, endNode);
      setError("Please select start AND end node before simulating");
      return;
    }
    for (let i = 0; i < 100; i++) {
      if (exclude.includes(i + 1) || i + 1 == startNode || i + 1 == endNode)
        continue;
      document.getElementById(i + 1).style.backgroundColor = "white";
      document.getElementById(i + 1).style.color = "black";
    }
    const { dist, parent } = await dijkstra(exclude, startNode);
    const uppath = [];
    let node = endNode;
    if (parent[node] === null) {
      setError("No path found");
      return;
    }
    while (parent[node] !== node) {
      uppath.push(node);
      node = parent[node];
    }
    uppath.push(node);
    uppath.reverse();
    const runTimer = () => {
      if (uppath.length === 0) {
        return;
      }
      const node = uppath.shift();
      const element = document.getElementById(node);
      if (element && node !== startNode && node !== endNode) {
        element.style.backgroundColor = "#00FFFF";
      }
      setTimeout(runTimer, 100);
    };
    runTimer();
  };

  function clearAll(header, endNode) {
    setExclude([]);
    if (header == "end") setEndNode(0);
    for (let i = 0; i < 100; i++) {
      if (i + 1 == startNode || (i + 1 == endNode && header == "block"))
        continue;
      document.getElementById(i + 1).style.backgroundColor = "white";
      document.getElementById(i + 1).style.color = "black";
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {<div>{pageHeader(header)}</div>}
      {<div className="text-red-500">{error}</div>}
      <div>
        <div className="grid h-full grid-cols-10 gap-0 cursor-pointer">
          {List}
        </div>
      </div>
      <div className="flex flex-row justify-between w-auto mt-2">
        <button
          onClick={() => {
            if (header === "start") {
              setHeader("start");
            } else if (header === "end") {
              clearAll("end", endNode);
              setHeader("start");
            } else {
              setHeader("end");
              clearAll("block", endNode);
            }
          }}
          className={`px-3 py-1 my-2 text-white bg-green-400 ${
            header === "start" && "bg-transparent cursor-default"
          }`}
        >
          Back
        </button>
        <button
          onClick={() => {
            simulate(startNode, endNode);
          }}
          className={`px-3 py-1 my-2 text-white bg-green-400 mx-24 ${
            (header === "end" && "bg-transparent cursor-default") ||
            (header === "start" && "bg-transparent cursor-default")
          }`}
        >
          Simulate
        </button>
        <button
          onClick={() => {
            if (header === "start") {
              setHeader("end");
            } else if (header === "end") {
              setHeader("block");
            } else setHeader("block");
          }}
          className={`px-3 py-1 my-2 text-white bg-green-400 ${
            header === "block" && "bg-transparent cursor-default"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default Home;
