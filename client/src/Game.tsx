import React, { useEffect, useState } from "react";
import { Gesture, useGesture } from "react-with-gesture";

import { random, range, sample } from "lodash";

import { Camera } from "./Camera";

type ID = number;

interface Position {
  x: number;
  y: number;
}

interface Planet {
  id: ID;
  x: number;
  y: number;
}

interface Ship {
  id: ID;
  from: Planet;
  to: Planet;
  progress: number;
}

interface State {
  planets: Planet[];
  ships: Ship[];
  camera: Camera;
}

const toPercent = (x: number) => `${x * 100}%`;

function getInitialState(): State {
  const planetCount = 30;

  const planets: Planet[] = range(planetCount).map((id) => ({ id, x: random(true), y: random(true) }));

  const shipCount = planets.length;
  const ships: Ship[] = range(shipCount)
    .map((i) => ({
      id: i,
      from: sample(planets)!,
      to: sample(planets)!,
      progress: 0,
    }));

  return { camera: { zoom: 1, x: 0.5, y: 0.5 }, planets, ships };
}

const initialState = getInitialState();
export default function() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const fps = 60;
    const interval = setInterval(proceed, 1000 / fps);
    return () => clearInterval(interval);
  });

  const proceed = () => {
    const speed = 0.003;

    const { ships } = state;
    setState({
      ...state,
      ships: ships.map((i) => {
        const nextProgress = i.progress + speed / Math.hypot(i.from.x - i.to.x, i.from.y - i.to.y);
        if (nextProgress >= 1) {
          return { ...i, from: i.to, to: sample(state.planets)!, progress: 0 };
        } else {
          return { ...i, progress: nextProgress };
        }
      }),
    });
  };

  // public render() {
  const { planets, ships, camera } = state;

  const toView = (position: Position) => {
    const repeat = (x: number) => x - Math.floor(x);
    return {
      // TODO: 이해할수있도록
      x: repeat(position.x - camera.x + 0.5 / camera.zoom) * camera.zoom,
      y: repeat(position.y - camera.y + 0.5 / camera.zoom) * camera.zoom,
    };
  };

  const isVisible = ({ x, y }: Position): boolean => {
    return x >= 0 && x <= 1 && y >= 0 && y <= 1;
  };

  return (
    <Gesture
      onAction={(e) => {
        const { camera } = state;

        const dx = e.previous[0] - e.xy[0];
        const dy = e.previous[1] - e.xy[1];

        setState({
          ...state,
          camera: {
            ...camera,
            x: camera.x + dx / 1000,
            y: camera.y + dy / 1000,
          },
        });
      }}>
      {() =>
        <div
          onWheel={(e) => {
            const { camera } = state;
            const rect = (e.target as HTMLDivElement).getBoundingClientRect();
            // TODO: 줌 되있는거에 비례?반비례해서 움직여야함
            const dx = e.clientX / rect.right - 0.5;
            const dy = e.clientY / rect.bottom - 0.5;

            setState({
              ...state,
              camera: {
                // TODO: 0.01은 임의의 값.
                x: camera.x - dx * 0.01 * e.deltaY,
                y: camera.y - dy * 0.01 * e.deltaY,
                zoom: Math.max(1, camera.zoom - e.deltaY * 0.005),
              },
            });
          }}
          style={{
            height: "100%",
            width: "100%",
            overflowX: "hidden",
            overflowY: "hidden",
            backgroundColor: "black",
          }}>
          {planets.map((i) => {
            const j = toView(i);
            return (
              <div
                key={`planet-${i.id}`}
                style={{
                  position: "absolute",
                  left: toPercent(j.x),
                  top: toPercent(j.y),
                }}>
                🙂
              </div>
            );
          })}
          {ships.map(({ id, from, to, progress }) => {
            if (progress === 0 || progress === 1) {
              return null;
            }
            const slope = (to.y - from.y) / (to.x - from.x + 0.00001);

            const x = (to.x - from.x) * (progress) + from.x;
            const y = (to.y - from.y) * (progress) + from.y;

            const j = toView({ x, y });
            if (!isVisible(j)) {
              return null;
            }

            return (
              <div
                key={`ship-${id}`}
                style={{
                  position: "absolute",
                  left: toPercent(j.x),
                  top: toPercent(j.y),
                  transform: `rotate(${
                    0.25 * Math.PI
                    + ((to.x - from.x) > 0 ? Math.atan(slope) : Math.atan(slope) + Math.PI)}rad)`,
                }}>
                🚀
              </div>
            );
          })}
        </div>}
    </Gesture>
  );
}
