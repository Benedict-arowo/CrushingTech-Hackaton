const alertButton = document.getElementById("alert--button");
const infoButton = document.getElementById("info--button");
const dismissButton = document.getElementById("dismiss--button");

const infoPopoutComponent = document.getElementById("info--popout-component");
const alertPopoutComponent = document.getElementById("alert--popout-component");
const trialCalloutComponent = document.getElementById("trial-callout");
const searchComponent = document.getElementById("search");

const setupGuideContainer = document.getElementById("setup-guide--guides");
const setupGuideItems = document.getElementsByClassName("setup--guide--item");
const setupGuideButton = document.getElementById("setup-guide-button");

const setupGuideCompletionButton = document.querySelectorAll(
	"#setup-guide--guides>article div.svg--container"
);
const showSetupGuideButton = document.getElementById("show-setupGuide");
const hideSetupGuideButton = document.getElementById("hide-setupGuide");

let totalCompleted = 0;
const totalAmountOfItems = 5;
const progressBar = document.getElementById("progress-bar");
const amountCompleted = document.getElementById("amount-of-items-completed");

const infoItems = document.getElementById("info--popout-component").children;
const alertItems = document.getElementById(
	"alert--component--header-icons"
).children;

const closeAllDropdown = () => {
	Array.from(setupGuideItems).forEach((item) => {
		item.classList.remove("setupguide--menu--opened");
		item.setAttribute("aria-expanded", "false");
		item.dataset.state = "closed";
	});
};

const openDropdown = (item) => {
	closeAllDropdown();
	item.setAttribute("aria-expanded", "true");
	item.classList.add("setupguide--menu--opened");
	item.style.opacity = "0";
	item.dataset.state = "opened";
	item.style.opacity = "1";
};

const handleCompleteTask = (e) => {
	const itemId = e.currentTarget.dataset.id;
	const item = document.querySelector(`article[data-id="${itemId}"]`);

	const svgContainer = item.querySelector("div.svg--container");

	if (
		e.target.tagName === "svg" ||
		e.target.tagName === "circle" ||
		(e.target.tagName === "DIV" &&
			e.target.classList.contains("svg--container"))
	) {
		if (svgContainer.dataset.state !== "completed") {
			svgContainer.children[0].outerHTML = loadingSvg;
			svgContainer.setAttribute("aria-checked", true);
			svgContainer.dataset.state = "completed";
			totalCompleted++;
			setTimeout(() => {
				svgContainer.children[0].outerHTML = completedSvg;
			}, 300);

			let id = 0;
			// Loops through the setup guide tasks and opens the next one that hasn't been completed yet, and if there aren't any, it doesn't open anything.
			// Maximum number of times it can loop is the total number of items that exists to prevent infinite recursion.
			while (id <= totalAmountOfItems) {
				if (id >= totalAmountOfItems) {
					closeAllDropdown();
					break;
				}

				let nextItem = setupGuideContainer.querySelector(
					`article[data-id='${Number(id) + 1}']`
				);

				let svgContainer = nextItem.querySelector("div.svg--container");

				if (svgContainer.dataset.state === "pending") {
					openDropdown(nextItem);
					svgContainer.focus();
					break;
				}

				id = id + 1;
			}
		} else {
			svgContainer.dataset.state = "pending";
			svgContainer.setAttribute("aria-checked", false);
			totalCompleted--;
			svgContainer.children[0].outerHTML = pendingSvg;
		}

		// Updating the progress bar, and the amount completed elements
		amountCompleted.innerText = totalCompleted;
		progressBar.style.width = `${
			(totalCompleted / totalAmountOfItems) * 100
		}%`;
	}
};

// Handles everything about the completion of tasks
Array.from(setupGuideCompletionButton).forEach((button) => {
	button.addEventListener("click", (e) => {
		handleCompleteTask(e);
	});

	button.addEventListener("keydown", (e) => {
		// console.log(button);
		if (e.key === "Escape") {
			toggleSetupGuideDisplay();
			showSetupGuideButton.parentElement.focus();
		}
		if (e.key === "Enter" || e.key === " ") handleCompleteTask(e);
	});
});

const handleOpenSetupGuide = (e) => {
	const selectedItem = e.currentTarget;
	// Stops the menu from opening up when the user completes/uncompletes it.
	console.log(e.target.tagName);
	if (
		e.target.tagName === "svg" ||
		e.target.tagName === "path" ||
		e.target.tagName === "circle" ||
		(e.target.tagName === "DIV" &&
			e.target.classList.contains("svg--container"))
	)
		return;

	// If the selected guide is already being displayed, then just ignore.
	if (selectedItem.dataset.state === "opened") return;
	else {
		openDropdown(selectedItem);
	}
};

// Handles opening of a setup guide
Array.from(setupGuideItems).forEach((item) => {
	item.addEventListener("click", (e) => {
		handleOpenSetupGuide(e);
	});

	item.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " ") handleOpenSetupGuide(e);
	});
});

const expandSetupGuide = () => {
	setupGuideContainer.setAttribute("data-state", "expanded");
	setupGuideButton.setAttribute("aria-expanded", true);

	hideSetupGuideButton.style.display = "none";
	showSetupGuideButton.style.display = "block";
	setupGuideContainer.style.opacity = "0";
	setupGuideContainer.style.display = "flex";
	const firstSetupGuide = setupGuideItems[0].querySelector("svg");
	firstSetupGuide.setAttribute("tabindex", 0);
	firstSetupGuide.focus();

	setTimeout(() => {
		setupGuideContainer.style.opacity = "1";
	}, 100);
};

const hideSetupGuide = () => {
	setupGuideContainer.setAttribute("data-state", "hidden");
	setupGuideButton.setAttribute("aria-expanded", false);

	setupGuideContainer.style.opacity = "0";
	setupGuideContainer.style.display = "none";
	hideSetupGuideButton.style.display = "block";
	showSetupGuideButton.style.display = "none";
	showSetupGuideButton.parentElement.focus();
};

const toggleSetupGuideDisplay = () => {
	const currentState = setupGuideContainer.dataset.state;
	if (currentState === "expanded") {
		hideSetupGuide();
	} else {
		expandSetupGuide();
	}
};

setupGuideButton.addEventListener("click", toggleSetupGuideDisplay);
setupGuideButton.addEventListener("keydown", (e) => {
	if (e.key === "Enter" || e.key === " ") {
		e.preventDefault();
		toggleSetupGuideDisplay();
	}
});

let activeNavComponent = null;

const toggleAlertButton = () => {
	if (activeNavComponent == "info") {
		infoPopoutComponent.style.display = "none";
		infoButton.setAttribute("aria-expanded", false);
		activeNavComponent = null;
	}

	// close alert tab if it's opened
	if (activeNavComponent == "alert") {
		alertPopoutComponent.style.opacity = 0;
		setTimeout(() => {
			alertPopoutComponent.style.display = "none";
			activeNavComponent = null;
			alertButton.setAttribute("aria-expanded", false);
		}, 100);
	} else {
		// open alert tab
		alertPopoutComponent.style.opacity = 0;
		alertButton.setAttribute("aria-expanded", true);
		alertPopoutComponent.style.display = "flex";
		activeNavComponent = "alert";
		alertItems[0].focus();
		setTimeout(() => {
			alertPopoutComponent.style.opacity = 1;
		}, 100);
	}
};

const toggleInfoButton = () => {
	if (activeNavComponent == "alert") {
		alertButton.setAttribute("aria-expanded", false);
		alertPopoutComponent.style.display = "none";
		activeNavComponent = null;
	}

	// close info tab if it's opened
	if (activeNavComponent == "info") {
		infoPopoutComponent.style.opacity = "0";

		setTimeout(() => {
			infoPopoutComponent.style.display = "none";
			activeNavComponent = null;
			infoButton.setAttribute("aria-expanded", false);
		}, 200);
	} else {
		// open info tab
		infoButton.setAttribute("aria-expanded", true);
		infoPopoutComponent.style.opacity = "0";
		infoPopoutComponent.style.display = "flex";
		activeNavComponent = "info";
		infoItems[0].children[0].setAttribute("tabindex", 0);
		infoItems[0].children[0].focus();
		setTimeout(() => {
			infoPopoutComponent.style.opacity = "1";
		}, 200);
	}
};

alertButton.addEventListener("click", (e) => toggleAlertButton(e));
alertButton.addEventListener("keydown", (e) => {
	if (e.key === "Enter" || e.key === " ") {
		e.preventDefault();
		toggleAlertButton(e);
	}
});

dismissButton.addEventListener("click", () => {
	trialCalloutComponent.style.opacity = 0;
	trialCalloutComponent.tabIndex = -1;
	trialCalloutComponent.querySelector("a").setAttribute("tabIndex", -1);
	trialCalloutComponent.querySelector("button").setAttribute("tabIndex", -1);
});

infoButton.addEventListener("click", (e) => toggleInfoButton());
infoButton.addEventListener("keydown", (e) => {
	if (e.key === "Enter" || e.key === " ") {
		toggleInfoButton();
	}
});

Array.from(infoItems).forEach((item) => {
	item.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			toggleInfoButton();
			infoButton.focus();
		}
	});
});

Array.from(alertItems).forEach((item) => {
	item.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			toggleAlertButton();
			alertButton.focus();
		}
	});
});
