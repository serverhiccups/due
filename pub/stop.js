import away from "./away.js";

let Stop = {
		view: (vnode) => {
				let items = [];
				items.push(m("li", { class: "stop-name" }, vnode.state.data.name));
				items.push(vnode.state.data["services"].map((service) => {
						return m("li", { class: "stop-service" }, [
								m("span", { id: "service-id" }, service.id),
								m("span", { id: "service-realtime", title: service.realtime ? "The service is realtime." : "The service is schedule." }, service.realtime ? "RT" : "SCHED"),
								m("span", { id: "service-estimate" }, service.isDue ? "Due" : away(service.secondsUntilDeparture))
						])
				}));
				items = items.slice(0, vnode.attrs.servicesToShow);
				return m("ul", { id: "stop" }, items);
		},

		updateTimes: (vnode) => {
				let doUpdate = () => {
						let url = "http://127.0.0.1:8080" + "/api/stop/" + vnode.attrs.stopId; // TODO: This line will not work if the server is being hosted remotely.
						fetch(url).then(async (response) => {
								vnode.state.data = await response.json();
								m.redraw();
						})/*.catch((e) => {
								console.log(`The error was: ${e}`);
						});*/
				}
				doUpdate();
				vnode.state.interval = setInterval(doUpdate, 5*1000);
		},

		oninit: (vnode) => {
				vnode.state.data = {};
				vnode.state.data.services = [];
				vnode.tag.updateTimes(vnode);
		},

		onremove: (vnode) => {
				clearInterval(vnode.state.interval);
		}
}

export default Stop;
