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
	"#setup-guide--guides>article[data-id]"
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
		item.dataset.state = "closed";
	});
};

const openDropdown = (item) => {
	item.classList.add("setupguide--menu--opened");
	item.style.opacity = "0";
	item.dataset.state = "opened";
	item.style.opacity = "1";
};

const handleCompleteTask = (e) => {
	const item = e.currentTarget;
	const svgElement = item.querySelector("svg");
	if (e.target.tagName === "svg" || e.target.tagName === "circle") {
		if (svgElement.dataset.state !== "completed") {
			svgElement.innerHTML = completedSvg;
			svgElement.dataset.state = "completed";
			totalCompleted++;
			closeAllDropdown();
			let id = 0;
			// Loops through the setup guide tasks and opens the next one that hasn't been completed yet, and if there aren't any, it doesn't open anything.
			// Maximum number of times it can loop is the total number of items that exists to prevent infinite recursion.
			while (id <= totalAmountOfItems) {
				if (id >= totalAmountOfItems) break;

				let nextItem = setupGuideContainer.querySelector(
					`[data-id='${Number(id) + 1}']`
				);

				let svgElement = nextItem.querySelector("svg");
				if (!(svgElement.dataset.state === "completed")) {
					openDropdown(nextItem);
					nextItem.querySelector("header>svg").focus();
					break;
				}

				id = Number(id) + 1;
			}
		} else {
			svgElement.dataset.state = "pending";
			totalCompleted--;
			svgElement.innerHTML = pendingSvg;
		}

		// Upgrading the progress bar, and the amount completed elements
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
	if (
		e.target.tagName === "svg" ||
		e.target.tagName === "path" ||
		e.target.tagName === "circle"
	)
		return;
	// If the selected guide is already being displayed, then just ignore.
	if (selectedItem.dataset.state === "opened") return;
	else {
		closeAllDropdown();
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

const toggleSetupGuideDisplay = () => {
	const currentState = setupGuideContainer.dataset.state;

	if (currentState === "expanded") {
		setupGuideContainer.setAttribute("data-state", "hidden");
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
	} else {
		setupGuideContainer.setAttribute("data-state", "expanded");
		setupGuideContainer.style.opacity = "0";
		setupGuideContainer.style.display = "none";
		hideSetupGuideButton.style.display = "block";
		showSetupGuideButton.style.display = "none";
		showSetupGuideButton.parentElement.focus();
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

// searchComponent.addEventListener("keydown", )

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

infoButton.addEventListener("click", (e) => toggleInfoButton(e));
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

document.addEventListener("DOMContentLoaded", () => {
	toggleSetupGuideDisplay();
});
