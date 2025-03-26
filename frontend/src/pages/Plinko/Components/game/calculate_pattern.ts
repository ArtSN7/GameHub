import { outcomes } from "./outcomes";
import { MULTIPLIERS } from "./constants";


const TOTAL_DROPS = 16;


export default function calc_function() {
    let outcome = 0;
    const pattern = []
    for (let i = 0; i < TOTAL_DROPS; i++) {
        if (Math.random() > 0.5) { // if random number from 0 to 1 is more than 0.5, then it goes right
            pattern.push("R")
            outcome++; // if it is right then we add to outcome +1, then to check in multipliers by key value
        } else {
            pattern.push("L")
        }
    }

    const multiplier = MULTIPLIERS[outcome];
    const possiblieOutcomes = outcomes[outcome];

    return {
        point: possiblieOutcomes[Math.floor(Math.random() * possiblieOutcomes.length || 0)], // the point is selected by the array of points which lead to the specific sink 
        multiplier,
        pattern
    };
}
