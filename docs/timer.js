function init() {
	let now = new Date();
	let isEvent = false;
	let TextBox = document.querySelector("#container div:nth-child(2)");
	let eventDay, eventName;
	function setTextBox(str){
		TextBox.textContent = str;
	}
	function eventFunc(e) {
		const EVENTS = [ //Event, date, name
			["NewYear", new Date(now.getFullYear() + 1 + " 01 01 00:00"), "새해"],
			["Tomorrow", new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), "내일"]
		]
		for (var event of EVENTS) {
			if (event[0] == e) {
				eventDay = new Date(event[1]);
				eventName = event[2];
				return;
			}
		}
		isEvent = false;
	}
	function getTimeLeft() {
		curTime = new Date();
		gap = eventDay - curTime
		difDay = Math.floor((eventDay - curTime) / (1000 * 60 * 60 * 24));
		gap -= difDay * (1000 * 60 * 60 * 24);
		difHour = Math.floor(gap / (1000 * 60 * 60));
		gap -= difHour * (1000 * 60 * 60);
		difMin = Math.floor(gap / (1000 * 60));
		gap -= difMin * (1000 * 60);
		difSec = Math.floor(gap / 1000);
		setTextBox(difDay+'일'+difHour+'시간'+difMin+'분'+difSec+'초');
	}

	let parameters = (location.href.slice(location.href.indexOf('?') + 1,location.href.length)).split('&');
	parameters.forEach(function(e){
		switch(e[0]) {
			case 'm':
				month = e.slice(e.indexOf('=') + 1);
				break;
			case 'd':
				day = e.slice(e.indexOf('=') + 1);
				break;
			case 'n':
				eventName = decodeURI(e.slice(e.indexOf('=') + 1));
				break;
			case 'e':
				isEvent = true;
				event = e.slice(e.indexOf('=') + 1);
				break;
		}
	})
	if (eventName == undefined) { eventName = "일정";parameters.push([]);}

	if(isEvent) {
		eventFunc(event);
	}else{
		eventMD = '-'+month+'-'+day;
		eventDay = new Date(new Date().getFullYear() + eventMD);
	}
	document.title = eventName + '까지 남은 시간'
	if (parameters.length < 3 && !isEvent) {
		setTextBox('매개변수가 충분하지 않습니다.');
		return;
	}
	if(eventDay.getTime() < now.getTime()) {
		setTextBox(eventName + "은(는) 이미 시작되었거나 지났습니다.");
		return;
	}

	document.querySelector("#container div:first-child").textContent = eventName + "까지";
	document.querySelector("#container div:last-child").textContent = "남았습니다";
	setInterval(getTimeLeft, 500);
}