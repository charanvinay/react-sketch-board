import React, { useState } from "react";
import "./App.css";
import SketchBoard from "./Sketchboard";

function App() {
  const [imagePath, setImagePath] = useState(null);
  return (
    <>
      <SketchBoard onSave={(e)=>setImagePath(e)}/>
      {imagePath && <img src={imagePath} alt="Sketch" />}
    </>
  );
}

export default App;
