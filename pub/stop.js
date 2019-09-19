import away from "./away.js";

let Stop = {
	view: (vnode) => {
		if(vnode.state.error) {
			return m("ul", { id: "stop" }, [
				m("li", { id: "service-error" }, "An error occured when loading this stop")
			])
		}
		if(vnode.state.data == undefined) {
			return m("url", { id: "stop" }, [
				m("li", { id: "service-loading" }, "The stop is loading")
			])
		}
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
			let url = "http://hiccup01.com:8080" + "/api/stop/" + vnode.attrs.stopId; // TODO: This line will not work if the server is being hosted remotely.
			fetch(url).then(async (response) => {
				if(response.status != 200) {
					throw `Server returned status ${response.status}`;
				}
				vnode.state.data = await response.json();
				m.redraw();
			}).catch((e) => {
				console.log(`The error was: ${e}`);
				vnode.state.error = true;
				m.redraw();
			});
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
