import { readJsonSync, writeJsonSync } from "https://deno.land/std/fs/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
const { args } = Deno;
let parsed = parse(args);
let { howMany } = parsed;
howMany = parseInt(howMany);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let getStops = async (upTo, howManyx) => {
		let stops = [];
		for(let i = upTo + 1; (i < upTo + 2 + howManyx) && (i < 10000); i++) {
				console.log(`Stop id: ${i}`);
				let response = await fetch("https://metlink.org.nz/api/v1/Stop/" + i.toString().padStart(4, "0"));
				if(response.status == 429) {
						console.log("Got a 429.");
						await sleep(3000);
						i--;
				}
				if(!response.ok) continue;
				let json = await response.json();
				stops.push({name: json["Name"], id: json["Sms"]});
		}
		return stops;
}

let database = readJsonSync("./stops.json");
if(database.upTo == undefined) {
		database.upTo = 0;
		database.stops = [];
}

getStops(database.upTo - 1, howMany).then((got) => {
		console.log("Adding stops to database");
		database.stops.push(...got);
		database.upTo = database.upTo + howMany;
		console.log("Writing databse");
		writeJsonSync("./stops.json", database);
		console.log("finished writing");
});
