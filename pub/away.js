export default function away(s) {
		const minutes = Math.round(s / 60);
		if(s < 59) return `${minutes}m away`;
		const hours = Math.round(minutes / 60);
		return `${hours}h away`;
}
