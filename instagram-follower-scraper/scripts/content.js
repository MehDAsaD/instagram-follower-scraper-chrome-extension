chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
	if (data.msg === 'do-scraping') {
		DoScrape()
	}
});

let timerId;
async function DoScrape(){
	//create a notifer element
	let notifer_el = document.createElement("div");
	notifer_el = document.createElement("div");
	notifer_el.style.zIndex = 999;
	notifer_el.style.backgroundColor = "#A40F4EFF";
	notifer_el.style.color = "#ffffff";
	notifer_el.style.position = "absolute";
	notifer_el.style.left = "12px";
	notifer_el.style.top = "12px";
	notifer_el.style.width = "340px";
	notifer_el.style.fontSize = "x-small";
	notifer_el.style.padding = "6px 10px 6px 10px";
	notifer_el.style.border = "5px solid rgb(255, 208, 0)";
	notifer_el.style.borderRadius = "7px";
	notifer_el.innerHTML = "Instagram Target Page Follower Scraper (by v-User) </ br> Scraping process started...";
	console.log("Scraping process started...");
	document.body.insertBefore(notifer_el, document.body.firstChild);

	var all_members_info = "";
	const loading_el = document.querySelector("[data-visualcompletion=loading-state],[role=progressbar]")
	let memberRows = document.querySelectorAll("[role=dialog] a[role=link]");
	if (loading_el && memberRows.length > 1) {

		await doLoading();
		console.log("All Followers Are loaded");
		memberRows = document.querySelectorAll("[role=dialog] a[role=link]");

		let el_href = "" , black_list = "",uniqueCounter = 0;

		try {
			memberRows.forEach(function (el){
				el_href = el.getAttribute("href");
				if (!black_list.includes(el_href)){
					const username = el_href.replaceAll("/","");
					const profile_link = `https://www.instagram.com${el_href}`

					const current_member_info = `Username: ${username}, Profile Link: ${profile_link}`;
					all_members_info += current_member_info + "\r\n";

					uniqueCounter++;
					black_list = black_list + el_href;
					if (uniqueCounter > 499){
						throw new Error('break');
					}
				}
			});
		} catch (e) {
			if (e.message !== 'break') throw e;
		}

		const member_amount_info = `Found ${uniqueCounter} users`;
		console.log(member_amount_info);
		notifer_el.innerHTML = `Instagram Target Page Follower Scraper (by v-User) </ br> Scraping process finished and found ${uniqueCounter} unique user.`;
		console.log("Scraping process finished.");

		let targetPage = document.querySelector("header h2");
		//get group name as export file name
		let fn = targetPage.textContent + "followers scraped by vUser";
		fn = fn.replace(/[\/\\?%*:|"<>.]/g, '-'); // remove illegal chars from the file name
		all_members_info=all_members_info.replace("#","-")
		//save as a text file
		const uri = "data:text/plain;charset=utf-8," + all_members_info;
		let ea = document.createElement("a");
		ea.href = uri;
		ea.download = fn; //group name
		document.body.appendChild(ea);
		ea.click();
		// 	document.body.removeChild(ea);

	}
	else {
		notifer_el.style.backgroundColor = "#ad0000";
		notifer_el.innerHTML = "Instagram Target Page Follower Scraper (by v-User) </ br> Error: Members list is not visible!";
		console.log("Error: Members list is not visible!");
	}
}


function doLoading(){
	return new Promise(resolve => {
		setInterval(function (){
			let loading_el = document.querySelector("[data-visualcompletion=loading-state],[role=progressbar]");
			if (loading_el){
				loading_el.scrollIntoView();
				let flws = document.querySelectorAll("[role=dialog] a[role=link]");
				if (flws.length > 800){
					clearInterval()
					resolve();
				}
			}else{
				clearInterval()
				resolve();
			}
		},1500)
	});
}

function waitForElm(selector) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}
		const observer = new MutationObserver(mutations => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}
async function clickbackbtn(){
	const backButton = await waitForElm('div.messages-layout button[title=Back]');
	backButton.dispatchEvent(new MouseEvent("mousedown", {view: window, bubbles: true, cancelable: true, buttons: 1}));
	if(backButton){
		clearInterval(timerId);
	}
}