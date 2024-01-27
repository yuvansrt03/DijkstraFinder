"use client";
import Image from "next/image";
import { use, useEffect } from "react";
import { dijkstra } from "./dijkstra.js";
import { useState } from "react";
import React from "react";
import IndividualNode from "./IndividualNode.js";
let excluded = [];
let isDragging = false;
let underSimulation = false;
let terminateAllSimulation = false;
let prevpath = [];
const Home = () => {
  const [header, setHeader] = useState("start");
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    document.body.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
    document.body.addEventListener("drop", (event) => {
      event.preventDefault();
    });
    document.body.addEventListener("mouseenter", (event) => {
      event.preventDefault();
    });
  }, []);
  const List = [];
  for (let i = 0; i < 4000; i++) {
    List.push(
      <IndividualNode
        key={i + 1}
        startNode={startNode}
        endNode={endNode}
        setStartNode={setStartNode}
        setEndNode={setEndNode}
        header={header}
        excluded={excluded}
        id={i + 1}
      />
    );
  }
  const pageHeader = (header) => {
    switch (header) {
      case "start":
        return <div>Select the Starting Node</div>;
      case "end":
        return <div>Select the Destination Node</div>;
      case "block":
        return <div>Select the Blocking Node by Clicking or Dragging</div>;
      case "default":
        return <div>Default</div>;
    }
  };
  async function simulate(startNode, endNode, excluded) {
    clearPath();
    terminateAllSimulation = true;
    setTimeout(() => {
      terminateAllSimulation = false;
    }, 1);
    underSimulation = true;
    if (!startNode || !endNode) {
      console.log(startNode, endNode);
      setError("Please select start AND end node before simulating");
      return;
    }
    let uppath = await dijkstra(excluded, startNode, endNode, setError);
    prevpath = Array.from(uppath);

    const runTimer = () => {
      setInterval(() => {
        if (terminateAllSimulation) {
          uppath = [];
        }
      }, 1);
      if (uppath.length === 0) {
        return;
      }
      const node = uppath.shift();
      const element = document.getElementById(node);
      if (element && node !== startNode && node !== endNode) {
        element.style.backgroundColor = "#00D100";
      }
      setTimeout(runTimer, 10);
    };
    runTimer();
  }
  function generate(header) {
    if (header === "start" || header === "end") return;
    for (let i = 0; i < 4000; i++) {
      document.getElementById(i + 1).onmousedown = () => {
        isDragging = true;
        if (startNode == i + 1 || endNode == i + 1) return;
        if (excluded.includes(i + 1)) {
          document.getElementById(i + 1).style.backgroundColor = "white";
          excluded = excluded.filter((item) => item !== i + 1);
        } else {
          document.getElementById(i + 1).style.backgroundColor = "black";
          excluded.push(i + 1);
        }
      };
      document.getElementById(i + 1).onmouseup = () => {
        isDragging = false;
        if (
          underSimulation &&
          excluded.some((item) => prevpath.includes(item))
        ) {
          clearPath();
          terminateAllSimulation = true;
          setTimeout(() => {
            terminateAllSimulation = false;
            simulate(startNode, endNode, excluded);
          }, 1);
        }
      };

      document.getElementById(i + 1).onmouseover = () => {
        if (isDragging) {
          if (
            excluded.includes(i + 1) ||
            startNode == i + 1 ||
            endNode == i + 1
          )
            return;
          document.getElementById(i + 1).style.backgroundColor = "black";
          document.getElementById(i + 1).style.color = "white";
          excluded.push(i + 1);
        }
      };
    }
  }
  function degenerate() {
    for (let i = 0; i < 4000; i++) {
      document.getElementById(i + 1).onmousedown = () => {};
      document.getElementById(i + 1).onmouseup = () => {};
      document.getElementById(i + 1).onmouseover = () => {};
    }
  }
  function clearAll(header, endNode) {
    excluded = [];
    if (header == "end") setEndNode(0);
    for (let i = 0; i < 4000; i++) {
      if (i + 1 == startNode || (i + 1 == endNode && header == "block"))
        continue;
      document.getElementById(i + 1).style.backgroundColor = "white";
    }
  }
  function clearPath() {
    for (let i = 0; i < 4000; i++) {
      if (i + 1 == startNode || i + 1 == endNode || excluded.includes(i + 1))
        continue;
      document.getElementById(i + 1).style.backgroundColor = "white";
    }
  }
  function handleNext(header, startNode, endNode) {
    if (header === "start") {
      if (startNode == 0) {
        setError("Please select start node before proceeding");
        return;
      }
      setError("");
      setHeader("end");
    } else if (header === "end") {
      if (endNode == 0) {
        setError("Please select end node before proceeding");
        return;
      }
      setError("");
      setHeader("block");
      generate("block");
      underSimulation = false;
    } else setHeader("block");
  }
  function handleBack(header, startNode, endNode) {
    if (header === "start") {
      setHeader("start");
    } else if (header === "end") {
      clearAll("end", endNode);
      setHeader("start");
    } else {
      setHeader("end");
      clearAll("block", endNode);
      degenerate();
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      {<div>{pageHeader(header)}</div>}
      {<div className="text-red-500">{error}</div>}
      <div className="flex flex-row w-auto mt-2 justify-evenly">
        <button
          onClick={() => {
            underSimulation = false;
            terminateAllSimulation = true;
            clearAll(header, endNode);
            setTimeout(() => {
              terminateAllSimulation = false;
            }, 100);
          }}
          className={`px-3 py-1 my-2 text-white bg-green-400`}
        >
          Reset
        </button>
      </div>
      <div>
        <div className="grid h-full gap-0 bg-white border border-black cursor-pointer grid-cols-100">
          {List}
        </div>
      </div>

      <div className="flex flex-row justify-between w-11/12 mt-2 md:mx-0 md:w-7/12 lg:w-5/12">
        <button
          onClick={() => handleBack(header, startNode, endNode)}
          className={`px-3 py -1 my-2 text-white bg-green-400 `}
        >
          Back
        </button>
        <button
          onClick={() => {
            simulate(startNode, endNode, excluded);
          }}
          className={`px-3 py-1 my-2 text-white bg-green-400 mx-12 lg:mx-24 ${
            header === "block" ? "" : "hidden"
          }`}
        >
          Simulate
        </button>
        <button
          onClick={() => handleNext(header, startNode, endNode)}
          className={`px-3 py-1 my-2 text-white bg-green-400`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default Home;
