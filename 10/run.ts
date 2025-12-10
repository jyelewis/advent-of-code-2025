import fs from "fs";
import { day10b } from "./10";

const input = fs.readFileSync("10/input.txt").toString("utf-8");
const answer = day10b(input);
console.log(answer);
