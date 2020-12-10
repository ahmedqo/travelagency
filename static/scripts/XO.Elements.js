class Abstract extends HTMLElement {
	constructor() {
		super();
		if (this.constructor.observedAttributes && this.constructor.observedAttributes.length) {
			this.constructor.observedAttributes.forEach((attribute) => {
				Object.defineProperty(this, attribute, {
					get() {
						if (attribute === "class") {
							this.attr = this.getAttribute(attribute);
							if (this.attr) {
								return this.attr.split(" ");
							}
							return null;
						}
						return this.getAttribute(attribute);
					},
					set(attrValue) {
						if (attrValue) {
							this.setAttribute(attribute, attrValue);
						} else {
							this.removeAttribute(attribute);
						}
					},
				});
			});
		}
		this.DESIGNSTYLES = "@import './static/styles/XOElements.css';";
	}
}

class Alert extends Abstract {
	static get observedAttributes() {
		return ["message", "type", "trigger"];
	}
	constructor() {
		super();
		this.messageAttr = this.getAttribute("message");
		this.typeAttr = this.getAttribute("type");
		this.triggerAttr = this.getAttribute("trigger");
		this.root = this.attachShadow({ mode: "open" });
		this.wrapperElem = document.createElement("div");
		this.messageElem = document.createElement("p");
		this.triggerElem = document.createElement("button");
		this.designsElem = document.createElement("style");
		this._init();
	}

	attributeChangedCallback(name, oldVal, newVal) {
		this._attr();
		if (name === "message") {
			this.messageElem.innerText = newVal;
		}
		if (name === "type") {
			if (["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(newVal)) {
				this._class(newVal);
			} else {
				this._class("");
				this.removeAttribute("type");
			}
		}
		if (name === "trigger") {
			if (newVal === "true") {
				this.triggerElem.style.display = "flex";
			} else {
				this.triggerElem.style.display = "none";
			}
		}
	}

	connectedCallback() {
		this._attr();
		this.triggerElem.addEventListener("click", () => {
			this.style.display = "none";
		});
	}

	disconnectedCallback() {
		this.triggerElem.removeEventListener("click", {});
	}

	hide() {
		this.style.display = "none";
		return this;
	}

	show() {
		this.style.display = "block";
		return this;
	}

	_init() {
		this.wrapperElem.appendChild(this.designsElem);
		this.wrapperElem.appendChild(this.messageElem);
		this.wrapperElem.appendChild(this.triggerElem);
		this.root.appendChild(this.wrapperElem);
	}
	_attr() {
		this._style();
		this.messageElem.innerText = this.messageAttr;
		this.wrapperElem.classList.add("alert");
		this.triggerElem.classList.add("close");
		this.triggerElem.innerHTML = "&times;";
	}
	_style() {
		this.designsElem.textContent = this.DESIGNSTYLES;
		if (this.typeAttr && ["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(this.typeAttr)) {
			this._class(this.typeAttr);
		}
		if (this.triggerAttr === "true") {
			this.triggerElem.style.display = "flex";
		} else {
			this.triggerElem.style.display += "none";
		}
	}

	_class(cls) {
		this.wrapperElem.classList.remove("primary", "secondary", "success", "info", "warning", "danger", "dark");
		if (cls) this.wrapperElem.classList.add(cls);
	}
}

class Box extends Abstract {
	static get observedAttributes() {
		return ["header", "message", "type", "trigger"];
	}
	constructor() {
		super();
		this.headerAttr = this.getAttribute("header");
		this.messageAttr = this.getAttribute("message");
		this.typeAttr = this.getAttribute("type");
		this.triggerAttr = this.getAttribute("trigger");
		this.root = this.attachShadow({ mode: "open" });
		this.wrapperElem = document.createElement("div");
		this.headerElem = document.createElement("div");
		this.messageElem = document.createElement("p");
		this.triggerElem = document.createElement("button");
		this.designsElem = document.createElement("style");
		this._init();
		this._attr();
		this._style();
	}

	attributeChangedCallback(name, oldVal, newVal) {
		if (name === "message") {
			this.messageElem.innerText = newVal;
		}
		if (name === "header") {
			this.headerElem.innerText = newVal;
		}
		if (name === "type") {
			if (["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(newVal)) {
				this._class(newVal);
			} else {
				this._class("");
				this.removeAttribute("type");
			}
		}
		if (name === "trigger") {
			if (newVal === "true") {
				this.triggerElem.style.display = "flex";
			} else {
				this.triggerElem.style.display = "none";
			}
		}
	}

	connectedCallback() {
		this.triggerElem.addEventListener("click", () => {
			this.style.display = "none";
		});
	}

	disconnectedCallback() {
		this.triggerElem.removeEventListener("click", {});
	}

	hide() {
		this.style.display = "none";
		return this;
	}

	show() {
		this.style.display = "block";
		return this;
	}

	_init() {
		this.wrapperElem.appendChild(this.designsElem);
		this.wrapperElem.appendChild(this.headerElem);
		this.wrapperElem.appendChild(this.messageElem);
		this.wrapperElem.appendChild(this.triggerElem);
		this.root.appendChild(this.wrapperElem);
	}
	_attr() {
		this.headerElem.innerText = this.headerAttr;
		this.messageElem.innerText = this.messageAttr;
		this.wrapperElem.classList.add("box");
		this.headerElem.classList.add("header");
		this.triggerElem.classList.add("close");
		this.triggerElem.innerHTML = "&times;";
	}
	_style() {
		this.designsElem.textContent = this.DESIGNSTYLES;
		if (this.typeAttr && ["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(this.typeAttr)) {
			this._class(this.typeAttr);
		}
		if (this.triggerAttr === "true") {
			this.triggerElem.style.display = "flex";
		} else {
			this.triggerElem.style.display += "none";
		}
	}

	_class(cls) {
		this.wrapperElem.classList.remove("primary", "secondary", "success", "info", "warning", "danger", "dark");
		if (cls) this.wrapperElem.classList.add(cls);
	}
}

class Card extends Abstract {
	static get observedAttributes() {
		return ["header", "body", "image", "type", "trigger"];
	}
	constructor() {
		super();
		this.headerAttr = this.getAttribute("header");
		this.bodyAttr = this.getAttribute("body");
		this.imageAttr = this.getAttribute("image");
		this.typeAttr = this.getAttribute("type");
		this.triggerAttr = this.getAttribute("trigger");
		this.root = this.attachShadow({ mode: "open" });
		this.wrapperElem = document.createElement("div");
		this.triggerElem = document.createElement("button");
		this.designsElem = document.createElement("style");
		this.headerElem = document.createElement("div");
		this.bodyElem = document.createElement("div");
		this.imageElem = document.createElement("div");
		this.sourceElem = document.createElement("img");
		this._init();
	}

	attributeChangedCallback(name, oldVal, newVal) {
		this._attr();
		if (name === "header") {
			this.headerElem.innerText = newVal;
		}
		if (name === "body") {
			this.bodyElem.innerText = newVal;
		}
		if (name === "image") {
			this.sourceElem.src = newVal;
		}
		if (name === "type") {
			if (["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(newVal)) {
				this._class(newVal);
			} else {
				this._class("");
				this.removeAttribute("type");
			}
		}
		if (name === "trigger") {
			if (newVal === "true") {
				this.triggerElem.style.display = "flex";
			} else {
				this.triggerElem.style.display = "none";
			}
		}
	}

	connectedCallback() {
		this._attr();
		this.triggerElem.addEventListener("click", () => {
			this.style.display = "none";
		});
	}

	disconnectedCallback() {
		this.triggerElem.removeEventListener("click", {});
	}

	hide() {
		this.style.display = "none";
		return this;
	}

	show() {
		this.style.display = "block";
		return this;
	}

	_init() {
		this.imageElem.appendChild(this.sourceElem);
		this.wrapperElem.appendChild(this.designsElem);
		this.wrapperElem.appendChild(this.imageElem);
		this.wrapperElem.appendChild(this.headerElem);
		this.wrapperElem.appendChild(this.bodyElem);
		this.wrapperElem.appendChild(this.triggerElem);
		this.root.appendChild(this.wrapperElem);
	}
	_attr() {
		this._style();
		this.headerElem.innerText = this.headerAttr;
		this.bodyElem.innerText = this.bodyAttr;
		this.wrapperElem.setAttribute("part", "card");
		this.wrapperElem.classList.add("card");
		this.imageElem.classList.add("image");
		this.headerElem.classList.add("header");
		this.bodyElem.classList.add("body");
		this.triggerElem.classList.add("close");
		this.triggerElem.innerHTML = "&times;";
	}
	_style() {
		this.designsElem.textContent = this.DESIGNSTYLES;
		if (this.typeAttr && ["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(this.typeAttr)) {
			this._class(this.typeAttr);
		}
		if (this.triggerAttr === "true") {
			this.triggerElem.style.display = "flex";
		} else {
			this.triggerElem.style.display += "none";
		}
	}

	_class(cls) {
		this.wrapperElem.classList.remove("primary", "secondary", "success", "info", "warning", "danger", "dark");
		if (cls) this.wrapperElem.classList.add(cls);
	}
}

class Dropdown extends Abstract {
	static get observedAttributes() {
		return ["type", "placeholder", "css"];
	}
	constructor() {
		super();
		this.STYLE = this.getAttribute("css");
		this.typeAttr = this.getAttribute("type");
		this.holderAttr = this.getAttribute("placeholder");
		this.root = this.attachShadow({ mode: "open" });
		this.wrapperElem = document.createElement("div");
		this.fieldElem = document.createElement("input");
		this.itemsElem = document.createElement("div");
		this.arrowElem = document.createElement("div");
		this.designsElem = document.createElement("style");
		this.childsElem = Array.from(this.children).filter((item) => {
			if (item.tagName === "XO-ITEM") return item;
		});
		this._init();
	}

	attributeChangedCallback(name, oldVal, newVal) {
		this._attr();
		if (name === "type") {
			if (["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(newVal)) {
				this._class(newVal);
			} else {
				this._class("");
				this.removeAttribute("type");
			}
		}
		if (name === "placeholder") {
			this.fieldElem.setAttribute("placeholder", newVal);
		}
		if (name === "css") {
			this.fieldElem.setAttribute("style", newVal);
		}
		if (!this.getAttribute("placeholder")) {
			this.fieldElem.removeAttribute("placeholder");
		}
	}

	connectedCallback() {
		this._attr();
		const DOM = this;
		this.arrowElem.addEventListener("click", () => {
			if (this.itemsElem.style.display === "none") {
				DOM.itemsElem.style.display = "";
			} else {
				DOM.itemsElem.style.display = "none";
			}
		});
		this.fieldElem.addEventListener("keyup", function () {
			Array.prototype.forEach.call(DOM.childsElem, function (el) {
				if (el.textContent.trim().indexOf(DOM.fieldElem.value) > -1) el.style.display = "";
				else el.style.display = "none";
			});
		});
		this.fieldElem.addEventListener("blur", function () {
			var valid = true;
			DOM.itemsElem.style.display = "none";
			DOM.childsElem.forEach((el) => {
				el.style.display = "";
				el.removeAttribute("selected");
				if (el.text === DOM.fieldElem.value) {
					valid = false;
					DOM.text = el.text;
					DOM.value = el.value;
					el.setAttribute("selected", true);
				}
			});
			if (valid) {
				DOM.fieldElem.value = "";
				DOM.text = "";
				DOM.value = "";
			}
		});
	}

	disconnectedCallback() {
		this.arrowElem.removeEventListener("click", {});
		this.fieldElem.removeEventListener("keyup", {});
		this.fieldElem.removeEventListener("blur", {});
	}

	selectval(value) {
		this.childsElem.forEach((child) => {
			if (child.value === value) {
				child.click();
			}
		});
	}

	unselect() {
		const DOM = this;
		this.fieldElem.value = "";
		this.childsElem.forEach((child) => {
			child.removeAttribute("selected");
			DOM.text = "";
			DOM.value = "";
		});
	}

	_init() {
		this.itemsElem.setAttribute("class", "items");
		this.arrowElem.classList.add("arrow");
		if (!this.getAttribute("placeholder")) {
			this.fieldElem.removeAttribute("placeholder");
		}
		this.wrapperElem.appendChild(this.designsElem);
		this.wrapperElem.appendChild(this.arrowElem);
		this.wrapperElem.appendChild(this.fieldElem);
		this.childsElem.forEach((child) => {
			this.itemsElem.appendChild(child);
		});
		this.wrapperElem.appendChild(this.itemsElem);
		const children = this.childsElem;
		const DOM = this;
		this.root.appendChild(this.wrapperElem);
		this.childsElem = Array.from(this.root.querySelectorAll("xo-item"));
		this.childsElem.forEach((child) => {
			child.addEventListener("click", function () {
				children.forEach((ch) => {
					ch.removeAttribute("selected");
				});
				child.setAttribute("selected", true);
				DOM.text = DOM.fieldElem.value = child.text;
				DOM.itemsElem.style.display = "none";
				DOM.value = child.value;
			});
		});
	}
	_attr() {
		this._style();
		this.fieldElem.setAttribute("placeholder", this.holderAttr);
		this.fieldElem.classList.add("dropdownField");
		this.wrapperElem.classList.add("dropdown");
	}
	_style() {
		this.designsElem.textContent = this.DESIGNSTYLES;
		if (this.typeAttr && ["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(this.typeAttr)) {
			this._class(this.typeAttr);
		}
		this.itemsElem.style.display = "none";
	}

	_class(cls) {
		this.wrapperElem.classList.remove("primary", "secondary", "success", "info", "warning", "danger", "dark");
		if (cls) {
			this.wrapperElem.classList.add(cls);
			this.childsElem.forEach((child) => {
				child.setAttribute("type", cls);
			});
		} else {
			this.childsElem.forEach((child) => {
				child.setAttribute("type", "");
			});
		}
	}
}

class Item extends Abstract {
	static get observedAttributes() {
		return ["text", "type", "value", "selected"];
	}
	constructor() {
		super();
		this.textAttr = this.getAttribute("text");
		this.typeAttr = this.getAttribute("type");
		this.selectedAttr = this.getAttribute("selected");
		this.root = this.attachShadow({ mode: "open" });
		this.wrapperElem = document.createElement("div");
		this.textElem = document.createElement("p");
		this.designsElem = document.createElement("style");
		this._init();
	}

	attributeChangedCallback(name, oldVal, newVal) {
		this._attr();
		if (name === "text") {
			this.textElem.innerText = newVal;
		}
		if (name === "selected") {
			if (newVal === "true") {
				this.wrapperElem.classList.add("active");
			} else {
				this.wrapperElem.classList.remove("active");
			}
		}
		if (name === "type") {
			if (["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(newVal)) {
				this._class(newVal);
			} else {
				this._class("");
				this.removeAttribute("type");
			}
		}
	}

	connectedCallback() {
		this._attr();
	}

	disconnectedCallback() {}

	_init() {
		this.innerText = this.textAttr;
		this.wrapperElem.appendChild(this.designsElem);
		this.wrapperElem.appendChild(this.textElem);
		this.root.appendChild(this.wrapperElem);
	}
	_attr() {
		this._style();
		//this.innerText = this.textAttr;
		this.textElem.innerText = this.textAttr;
		this.wrapperElem.classList.add("item");
	}
	_style() {
		this.designsElem.textContent = this.DESIGNSTYLES;
		if (this.typeAttr && ["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(this.typeAttr)) {
			this._class(this.typeAttr);
		}
		if (this.selectedAttr === "true") {
			this.wrapperElem.classList.add("active");
		} else {
			this.wrapperElem.classList.remove("active");
		}
	}

	_class(cls) {
		this.wrapperElem.classList.remove("primary", "secondary", "success", "info", "warning", "danger", "dark");
		if (cls) this.wrapperElem.classList.add(cls);
		if (!this.getAttribute("selected")) {
			this.wrapperElem.classList.remove("active");
		} else {
			this.wrapperElem.classList.add("active");
		}
	}
}

class Panel extends Abstract {
	static get observedAttributes() {
		return ["header", "body", "footer", "type", "trigger"];
	}
	constructor() {
		super();
		this.headerAttr = this.getAttribute("header");
		this.bodyAttr = this.getAttribute("body");
		this.footerAttr = this.getAttribute("footer");
		this.typeAttr = this.getAttribute("type");
		this.triggerAttr = this.getAttribute("trigger");
		this.root = this.attachShadow({ mode: "open" });
		this.wrapperElem = document.createElement("div");
		this.headerElem = document.createElement("div");
		this.bodyElem = document.createElement("div");
		this.footerElem = document.createElement("div");
		this.triggerElem = document.createElement("button");
		this.designsElem = document.createElement("style");
		this._init();
	}

	attributeChangedCallback(name, oldVal, newVal) {
		this._attr();
		if (name === "header") {
			this.headerElem.innerText = newVal;
		}
		if (name === "header") {
			this.headerElem.innerText = newVal;
		}
		if (name === "footer") {
			this.footerElem.innerText = newVal;
		}
		if (name === "type") {
			if (["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(newVal)) {
				this._class(newVal);
			} else {
				this._class("");
				this.removeAttribute("type");
			}
		}
		if (name === "trigger") {
			if (newVal === "true") {
				this.triggerElem.style.display = "flex";
			} else {
				this.triggerElem.style.display = "none";
			}
		}
		if (name === "footer") {
			if (newVal) {
				this.footerElem.style.display = "";
			} else {
				this.footerElem.style.display = "none";
			}
		}
	}

	connectedCallback() {
		this._attr();
		this.triggerElem.addEventListener("click", () => {
			this.style.display = "none";
		});
	}

	disconnectedCallback() {
		this.triggerElem.removeEventListener("click", {});
	}

	hide() {
		this.style.display = "none";
		return this;
	}

	show() {
		this.style.display = "block";
		return this;
	}

	_init() {
		this.wrapperElem.appendChild(this.designsElem);
		this.wrapperElem.appendChild(this.headerElem);
		this.wrapperElem.appendChild(this.bodyElem);
		this.wrapperElem.appendChild(this.footerElem);
		this.wrapperElem.appendChild(this.triggerElem);
		this.root.appendChild(this.wrapperElem);
	}
	_attr() {
		this._style();
		this.headerElem.innerText = this.headerAttr;
		this.bodyElem.innerText = this.bodyAttr;
		this.footerElem.innerText = this.footerAttr;
		this.wrapperElem.classList.add("panel");
		this.headerElem.classList.add("header");
		this.bodyElem.classList.add("body");
		this.footerElem.classList.add("footer");
		this.triggerElem.classList.add("close");
		this.triggerElem.innerHTML = "&times;";
	}
	_style() {
		this.designsElem.textContent = this.DESIGNSTYLES;
		if (this.typeAttr && ["primary", "secondary", "success", "info", "warning", "danger", "dark"].includes(this.typeAttr)) {
			this._class(this.typeAttr);
		}
		if (this.triggerAttr === "true") {
			this.triggerElem.style.display = "flex";
		} else {
			this.triggerElem.style.display += "none";
		}
		if (this.footerAttr) {
			this.footerElem.style.display = "";
		} else {
			this.footerElem.style.display = "none";
		}
	}

	_class(cls) {
		this.wrapperElem.classList.remove("primary", "secondary", "success", "info", "warning", "danger", "dark");
		if (cls) this.wrapperElem.classList.add(cls);
	}
}

window.customElements.define("xo-alert", Alert);
window.customElements.define("xo-box", Box);
window.customElements.define("xo-card", Card);
window.customElements.define("xo-dropdown", Dropdown);
window.customElements.define("xo-item", Item);
window.customElements.define("xo-panel", Panel);

export { Alert, Box, Card, Dropdown, Item, Panel };
