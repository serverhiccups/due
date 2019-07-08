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
				vnode.state.interval = setInterval(() => {
						let url = window.location.host + "/api/stop/" + vnode.attrs.stopId;
						console.log(url, vnode.attrs);
						fetch(window.location.host + "/api/stop/" + vnode.attrs.stopId).then((response) => { // The bug is somewhere in here, because this always throws.
								vnode.state.data = JSON.parse(response);
								console.log("Got a response");
								m.redraw();
						})/*.catch((e) => {
								console.log(`The error was: ${e}`);
						});*/
				}, 2*1000);
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
