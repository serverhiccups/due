import Stop from "./stop.js";

let App = {
		addOrMoveStop: (stop, vnode) => {
				let index = vnode.tag.loadingStop(stop, vnode);
				if(index != -1) {
						vnode.state.stops.splice(index, 1);
				}
				vnode.state.stops.push(stop);
				m.redraw();
		},

		loadingStop: (stop, vnode) => {
				let found = -1;
				vnode.state.stops.forEach((i, it) => {
						if(i == stop) found = it;
				})
				return found;
		},

		inputSub: (e, vnode) => {
				let value = e.target[0].value;
				if(typeof value == "number") value = e.target[0].value.toString().padStart(4, "0");
				vnode.tag.addOrMoveStop(value, vnode);
				e.target.value = "";
		},

		view: (vnode) => {
				return [
						m("div", { id: "services" }, vnode.state.stops.map((stop) => {
								return m(Stop, { stopId: stop, servicesToShow: 5 })
						})),
						m("form", { onsubmit: (e) => {
								e.preventDefault();
								vnode.tag.inputSub(e, vnode);
						}},
								m("input", { type: "text" })
						)
				]
		},

		oninit: (vnode) => {
				vnode.state.stops = [];
		}
}

export default App;
