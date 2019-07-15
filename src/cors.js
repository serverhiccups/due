/* This is an implementation of CORS middleware for oak, based on koa's cors middleware. */

function cors(providedOptions) {
		let defaults = {
		allowedMethods: "GET, HEAD, PUT, POST, DELETE, PATCH",
		origin: true
		}

		let options = Object.assign(defaults, providedOptions);

		return async function(context, next) {
				if(!context.request.headers.get("Origin")) return await next();

				context.response.headers.set("Vary", "*");

				let origin = ""
				if(typeof options.origin == "string") {
						origin = options.origin;
				} else if(options.origin == true) {
						origin = "*";
				} else if(typeof options.origin === 'function') {
						origin = options.origin(context.request);
				} else if(options.origin == false) {
						origin = false;
				}


				context.response.headers.set("Access-Control-Allow-Origin", origin);
				context.response.headers.set("Access-Control-Allow-Methods", options.allowedMethods);

				if(context.request.method === 'OPTIONS') {
						this.status = 204;
				} else {
						return await next();
				}
		}
}

export default cors;
