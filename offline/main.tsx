import React from "react";
import { createRoot } from "react-dom/client";
import CodeQuest from "../components/CodeQuest";
import catalog from "../content/catalog.json";
import lessons from "../content/lessons.json";
import type { Unit, Lesson } from "../lib/types";
import "../app/globals.css";
createRoot(document.getElementById("root")!).render(
  <CodeQuest units={catalog.units as Unit[]} lessons={lessons as Lesson[]} />,
);
