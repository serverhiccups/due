import { Application, Router, send } from "https://raw.githubusercontent.com/serverhiccups/oak/update-std-v.0.11.0/mod.ts";
import cors from "./src/cors.js";
import MetlinkApi from "./src/libmetlink.js";


(async () => {
	let logger = (async (context, next) => {
		console.log("*************");
		console.log(`${context.request.method} ${context.request.url}`);
		console.log("Request:");
		context.request.headers.forEach((value, key) => {
			console.log(`${key}: ${value}`);
		})
		await next();
		console.log("Response:");
		context.response.headers.forEach((value, key) => {
			console.log(`${key}: ${value}`);
		})
	});

	let metapi = new MetlinkApi();

	const router = new Router();
	router.get("/:path", async context => {
		await send(context, context.request.path, { root: `${Deno.cwd()}/pub/`, index: "index.html", gzip: false, brotli: false });
	}).get("/", async context => {
		await send(context, context.request.path, { root: `${Deno.cwd()}/pub/`, index: "index.html", gzip: false, brotli: false });
	}).get("/api/stop/:stop", async context => {
		try {
			context.response.body = await metapi.getStop(context.params.stop);
			context.response.headers.set("Content-Type", "application/json");
			context.response.status = 200;
		} catch(e) {
			context.response.body = "An error occured when getting the data from the Metlink API. Is the provided stop id valid?";
			context.response.headers.set("Content-Type", "text/plain");
			context.response.status = 400;
		}
	}).get("/api/display/:stop/:show", async context => {
		try {
			context.response.body = await metapi.getStop(context.params.stop);
			context.response.body["services"] = context.response.body["services"].slice(0, parseInt(context.params.show));
			context.response.headers.set("Content-Type", "application/json");
			context.response.status = 200;
		} catch (e) {
			console.log(e);
			context.response.body = "An error occured when getting the data from the Metlink API. Is the provided stop id valid?";
			context.response.headers.set("Content-Type", "text/plain");
			context.response.status = 400;
		}
	}).get("/api/verify/:stop", async context => {
		//try {
			context.response.body = await metapi.verifyStop(context.params.stop);
			context.response.headers.set("Content-Type", "application/json");
			context.response.status = 200;
		//} catch (e) {
			//context.response.body = "An error occured when getting the data from the Metlink API. Is the provided stop id valid?";
			//context.response.headers.set("Content-Type", "text/plain");
			//context.response.status = 400;
		//}
	});

	const app = new Application();
	//app.use(logger);
	app.use(cors({ origin: true }));
	app.use(router.routes());
	app.use(router.allowedMethods());

	await app.listen("0.0.0.0:8080");
})();
