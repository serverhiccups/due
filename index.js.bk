import MetlinkApi from './src/libmetlink.js';
import { Server } from 'https://github.com/fen-land/deno-fen/raw/master//server.ts';
import { Router } from 'https://github.com/fen-land/deno-fen/raw/master//tool/router.ts';
import { staticProcess } from "https://github.com/fen-land/deno-fen/raw/master//tool/static.ts";
import { readFileStr } from 'https://deno.land/std/fs/mod.ts';

const serv = new Server();
serv.port = 8080;
serv.logger.changeLevel("ALL");

let metapi = new MetlinkApi();

let api = new Router("api");

api.get("/stop/:id",
		async context => {
				context.config.mimeType = "application/json";
				try {
						context.headers.set("Cache-Control", "no-cache");
						context.headers.set("Access-Control-Allow-Origin", "*");
						context.body = await metapi.getStop(context.data.get("router").params.id)
				} catch (e) {
						context.config.mimeType = "text/plain";
						context.throw(500, "An error occured when try to retreive data from the Metlink API");
				}
		}
);

let pub = new Router("pub");



pub.get("/:path",
	staticProcess({root: `${Deno.cwd()}/pub/`, index: "index.html"})
).get("/",
		async context => {
				context.headers.set("Access-Control-Allow-Origin", "*");
				context.headers.set("Access-Control-Allow-Methods", "GET");
				context.config.mimeType = "text/html";
				context.body = await readFileStr("./pub/index.html");
		}
).merge("/api", api);

serv.setController(pub.controller);
serv.start();
