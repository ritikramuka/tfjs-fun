import React, { useRef } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  async function getHandpose() {
    // load the pre defined handpose model by tensorflow.js
    const model = await handpose.load();
    // console.log("model loaded!");

    setInterval(() => {
      getData(model);
    }, 1);
  }
  getHandpose();

  async function getData(model) {
    // check for video stream
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;

      const hand = await model.estimateHands(video);
      // console.log(hand);

      const context = canvasRef.current.getContext("2d");

      if (hand.length > 0) {
        // console.log(hand)
        hand.forEach((prediction) => {
          const landmarks = prediction.annotations;

          if (
            landmarks !== "undefined" &&
            landmarks !== null &&
            landmarks["indexFinger"] != null
          ) {
            const indexFinger = landmarks["indexFinger"];
            // console.log(indexFinger[0][1]);
            // context.beginPath();
            context.arc(
              indexFinger[3][0],
              indexFinger[3][1],
              0,
              0,
              3 * Math.PI
            );
            context.fillStyle = "black";
            context.stroke();
            // context.stroke();
            // context.closePath();
          }
        });
      }
    } else {
    }
  }

  return (
    <div className="App">
      <Webcam ref={webcamRef} className="window"></Webcam>
      <canvas ref={canvasRef} className="window"></canvas>
    </div>
  );
}

export default App;
