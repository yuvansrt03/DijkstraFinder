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
      className={`flex items-center justify-center w-[.19rem] h-[.19rem] xs:w-[.23rem] xs:h-[.23rem] md:w-[.45rem] md:h-[.45rem] lg:w-[.6rem] lg:h-[.6rem] xl:w-[.7rem] xl:h-[.7rem]  border border-gray-700`}
      key={id}
      draggable="false"
      onClick={(e) => {
        if (header === "start") {
          if (startNode > 0)
            document.getElementById(startNode).style.backgroundColor = "white";
          e.target.style.backgroundColor = "#00D100";
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
