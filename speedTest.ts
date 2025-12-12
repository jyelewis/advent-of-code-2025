import { range } from "./utilities";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import fs from "fs";

if (isMainThread) {
  // Main thread: create workers for each challenge
  async function main() {
    const numChallenges = 11;
    const days = range(1, numChallenges);

    console.time("All");

    // Create and run all workers in parallel
    const workers = days.map((day) => {
      return new Promise<{ day: number; duration: number }>((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: { day },
        });

        worker.on("message", (message) => {
          resolve(message);
        });

        worker.on("error", (err) => {
          console.error(`Worker ${day} error:`, err);
          reject(err);
        });
        worker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error(`Worker for day ${day} stopped with exit code ${code}`));
          }
        });
      });
    });

    // Wait for all workers to complete
    const results = await Promise.all(workers);

    // Sort results by day and display
    results.sort((a, b) => a.day - b.day);
    for (const result of results) {
      if (result && typeof result.duration === "number") {
        console.log(`>${result.day}: ${result.duration.toFixed(3)}ms`);
      } else {
        console.log(`>${result.day}: Error - no duration received`);
      }
    }

    console.timeEnd("All");
  }

  main().catch(console.error);
} else {
  // Worker thread: run the challenge for a specific day
  const { day } = workerData;
  const dayStr = day.toString().padStart(2, "0");

  const startTime = performance.now();

  const input = fs.readFileSync(`./${dayStr}/input.txt`, "utf8");
  const solutionCode = require(`./${dayStr}/${dayStr}.js`);

  const fns = Object.values(solutionCode);
  fns.forEach((fn: any) => fn(input));

  const duration = performance.now() - startTime;

  parentPort?.postMessage({ day, duration });
}
