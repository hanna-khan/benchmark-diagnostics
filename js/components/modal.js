document.addEventListener("DOMContentLoaded", () => {
	const openButtons = document.querySelectorAll("[data-modal-target]");
	const focusableSelector = [
		"a[href]",
		"area[href]",
		"button:not([disabled])",
		"input:not([disabled])",
		"select:not([disabled])",
		"textarea:not([disabled])",
		"iframe",
		"object",
		"embed",
		"[contenteditable]",
		"[tabindex]:not([tabindex='-1'])"
	].join(",");

	openButtons.forEach(openButton => {
		const modalId = openButton.getAttribute("data-modal-target");
		const modal = document.getElementById(modalId);

		if (!modal) {
			return;
		}

		const dialog = modal.querySelector("[role='dialog']");
		let previouslyFocusedElement = null;

		const getFocusableElements = () => [
			...dialog.querySelectorAll(focusableSelector)
		].filter(element => element.offsetParent !== null);

		const closeModal = () => {
			modal.classList.remove("is-open");
			modal.setAttribute("aria-hidden", "true");
			document.body.classList.remove("modal-open");

			if (previouslyFocusedElement) {
				previouslyFocusedElement.focus();
			}
		};

		const openModal = () => {
			previouslyFocusedElement = document.activeElement;
			modal.classList.add("is-open");
			modal.setAttribute("aria-hidden", "false");
			document.body.classList.add("modal-open");

			const firstFocusableElement = getFocusableElements()[0];

			if (firstFocusableElement) {
				firstFocusableElement.focus();
			}
		};

		openButton.addEventListener("click", openModal);

		modal.querySelectorAll("[data-modal-close]").forEach(closeButton => {
			closeButton.addEventListener("click", closeModal);
		});

		dialog.addEventListener("keydown", event => {
			if (event.key === "Escape") {
				event.preventDefault();
				closeModal();
				return;
			}

			if (event.key !== "Tab") {
				return;
			}

			const focusableElements = getFocusableElements();
			const firstFocusableElement = focusableElements[0];
			const lastFocusableElement = focusableElements[focusableElements.length - 1];

			if (event.shiftKey && document.activeElement === firstFocusableElement) {
				event.preventDefault();
				lastFocusableElement.focus();
			} else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
				event.preventDefault();
				firstFocusableElement.focus();
			}
		});
	});
});
