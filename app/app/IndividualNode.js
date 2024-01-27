import React from "react";

function IndividualNode({
  id,
  startNode,
  endNode,
  excluded,
  setStartNode,
  setEndNode,
  header,
}) {
  return (
    <div
      id={id}
      className={`flex items-center justify-center w-2 h-2 border border-black  `}
      key={id}
      draggable="false"
      onClick={(e) => {
        if (header === "start") {
          if (startNode > 0)
            document.getElementById(startNode).style.backgroundColor = "white";
          e.target.style.backgroundColor = "green";
          setStartNode(id);
        } else if (header === "end") {
          if (id === endNode) return;
          if (endNode > 0)
            document.getElementById(endNode).style.backgroundColor = "white";
          e.target.style.backgroundColor = "red";
          setEndNode(id);
        }
      }}
    ></div>
  );
}

export default IndividualNode;
