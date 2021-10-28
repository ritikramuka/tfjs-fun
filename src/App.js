import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import "./App.css";
import pepcoding from "./logo.png";
import rikrak from "./rikrak.jpg";

function App() {
  const webcamRef = useRef(null);

  const [pose, setPose] = useState(null);
  const poseImage = { thumbs_up: pepcoding, victory: rikrak };

  async function getHandpose() {
    // load the pre defined handpose model by tensorflow.js
    const model = await handpose.load();
    // console.log("model loaded!");

    setInterval(() => {
      getData(model);
    }, 100);
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

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
        ]);

        const estimatedGestures = await GE.estimate(hand[0].landmarks, 7.5);
        if (
          estimatedGestures.gestures !== undefined &&
          estimatedGestures.gestures.length > 0 &&
          estimatedGestures.gestures[0] !== undefined
        ) {
          setPose(estimatedGestures.gestures[0].name);
        }
      }
    }
  }

  return (
    <div className="App">
      <Webcam ref={webcamRef} className="window"></Webcam>
      {pose !== null && poseImage[pose] !== undefined ? <img src={poseImage[pose]} className="pose" alt="pose"></img> : ""}
    </div>
  );
}

export default App;