let innerDiv;
let container;
function Init() {
	container = document.querySelector("#container")
	innerDiv = container.children;
	let now = new Date();
	let isEvent = false;
	let TextBox = innerDiv[1];
	let eventDay, eventName;
	function setTextBox(str){
		TextBox.textContent = str;
	}
	function eventFunc(e) {
		const EVENTS = [ //Event, date, name
			["NewYear", new Date(now.getFullYear() + 1 + " 01 01 00:00"), "새해"],
			["Tomorrow", new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), "내일"],
			["Christmas", new Date(now.getFullYear() + " 12 25"), "크리스마스"]
		]
		for (var event of EVENTS) {
			if (event[0] == e) {
				eventDay = new Date(event[1]);
				eventName = event[2];
				return true;
			}
		}
		return false
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
	if (parameters.length == 1 && !isEvent) { InitHome(); return }
	if (eventName == undefined) { eventName = "일정";parameters.push([]);}

	document.title = eventName + '까지 남은 시간'
	if (parameters.length < 3 && !isEvent) {
		GoToHome();
		return;
	}

	if(isEvent) {
		if(!eventFunc(event)) {
			GoToHome();
			return;
		}
	}else{
		eventMD = '-'+month+'-'+day;
		eventDay = new Date(new Date().getFullYear() + eventMD);
	}

	if(eventDay.getTime() < now.getTime()) {
		setTextBox(eventName + "은(는) 이미 시작되었거나 지났습니다.");
		return;
	}

	innerDiv[0].textContent = eventName + "까지";
	innerDiv[2].textContent = "남았습니다";
	setInterval(getTimeLeft, 500);
}

function GoToHome() {
	location.href = "./index.html";
}

function InitHome() {
	innerDiv[1].textContent = "";
	document.title = "일정 설정하기";
	document.body.id = "home";
	const DAYS_IN_MONTH = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	let title = document.querySelector("title");
	let result = document.querySelector("#urlCopy")
	let body = document.body;
	let url = location.href;
	let inputs = [];
	for (let div of innerDiv) {
		let temp = document.createElement("input");
		inputs.push(temp);
		div.appendChild(temp);
	}
	inputs[0].placeholder = "일정의 이름";
	inputs[1].placeholder = "월";
	inputs[2].placeholder = "일";

	inputs[1].addEventListener("focus", () => { innerDiv[1].classList.remove("error") });
	inputs[2].addEventListener("focus", () => { innerDiv[2].classList.remove("error") });
	result.addEventListener("click", () => {
		let error = false;
		let name = inputs[0].value;
		let month = inputs[1].value;
		let day = inputs[2].value;

		if (month < 1 || month > 12 || !month || isNaN(month)) {
			error = true;
			innerDiv[1].classList.add("error");
		}
		if (day < 0 || day > DAYS_IN_MONTH[month] || !day || isNaN(day)) {
			error = true;
			innerDiv[2].classList.add("error");
		}
		if (error) { return }
		url = location.href + "?n=" + name + "&m=" + month + "&d=" + day;
		navigator.clipboard.writeText(url);
	})
}