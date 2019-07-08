export default class MetlinkApi {
		constructor() {
				this.apiUrl = "https://www.metlink.org.nz/api/v1";
		}

		async getStop(stop) {
				let url = this.apiUrl + "/StopDepartures/" + stop;
				try {
						let response = await fetch(url);
						if(response.status == 404) {
								throw "An invalid url was passed to getStop (The api returned 404).";
						} else if (!response.ok) {
								throw "An error was sent back from the server when using getStop. Does the API still work?";
						}
						let json = await response.json();
						return {
								name: json["Stop"]["Name"],
								id: json["Stop"]["Sms"],
								services: json["Services"].map((service) => {
										return this.niceifyService(service);
								})
						}
				} catch (e) {
						console.log(`An error occured when sending a request to this url: ${url}. The error is below.`);
						console.log(e);
						return;
				}
		}

		niceifyService(service) {
				let newService = {};
				newService.id = service["ServiceID"];
				newService.isRealtime = service["IsRealtime"];
				newService.direction = service["Direction"];
				newService.secondsUntilDeparture = service["DisplayDepartureSeconds"];
				newService.isDue = newService.secondsUntilDeparture <= 90 ? true : false;
				return newService;
		}
}
