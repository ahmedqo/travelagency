function Selector(SELECTOR) {
	let type, el;
	let list = [];
	if (typeof SELECTOR !== "string") {
		type = "o";
		el = SELECTOR;
	} else {
		type = SELECTOR.split("")[0];
		el = SELECTOR.substring(1);
	}
	if (type === "#") {
		list.push(document.getElementById(el));
	} else if (type === ".") {
		list = document.getElementsByClassName(el);
	} else if (type === ":") {
		list = document.getElementsByName(el);
	} else if (type === "o") {
		if (SELECTOR.length) {
			list = SELECTOR;
		} else {
			list.push(SELECTOR);
		}
	} else {
		list = document.getElementsByTagName(SELECTOR);
	}
	list = Array.from(list);
	return list;
}

function makeError(SEL, func, type, ele) {
	throw new Error(`XO("${SEL}").${func}(...) accept [${type}] not ["${typeof ele}"]`);
}

var XO = (function () {
	var XO = function (elems) {
			return new XOConstruct(elems);
		},
		XOConstruct = function (elems) {
			this.ele = elems;
			this.collection = Selector(elems);
			return this;
		};
	XO.fn = XOConstruct.prototype = {
		delay: 0,
		val: function (value) {
			selector = this.collection;
			if (typeof value === "undefined") {
				if (selector[0].tagName === "SELECT") {
					return selector[0].options[selector[0].selectedIndex].value;
				} else {
					return selector[0].value;
				}
			} else if (typeof value === "string" || typeof value === "number") {
				selector.forEach((sel) => {
					sel.value = value;
				});
			} else {
				makeError(this.ele, "val", `"String", "Number", "Undefined"`, value);
			}
			return this;
		},
		text: function (value) {
			selector = this.collection;
			if (typeof value === "undefined") {
				if (selector[0].tagName === "SELECT") {
					return selector[0].options[selector[0].selectedIndex].text;
				} else {
					return selector[0].innerText;
				}
			} else if (typeof value === "string" || typeof value === "number") {
				selector.forEach((sel) => {
					sel.innerText = value;
				});
			} else {
				makeError(this.ele, "text", `"String", "Number", "Undefined"`, value);
			}
			return this;
		},
		html: function (value) {
			selector = this.collection;
			if (typeof value === "undefined") {
				return selector[0].innerHTML;
			} else if (typeof value === "string" || typeof value === "number") {
				selector.forEach((sel) => {
					sel.innerHTML = value;
				});
			} else {
				makeError(this.ele, "html", `"String", "Number", "Undefined"`, value);
			}
			return this;
		},
		attr: function (name, value) {
			selector = this.collection;
			if (typeof name === "string") {
				if (typeof value === "undefined") {
					if (selector[0].getAttribute(name)) {
						return selector[0].getAttribute(name);
					} else {
						return false;
					}
				} else if (typeof value === "string" || typeof value === "number") {
					selector.forEach((sel) => {
						sel.setAttribute(name, value);
					});
				} else {
					makeError(this.ele, "attr", `"String", "Number"`, value);
				}
			} else if (typeof name === "object") {
				for (var key in name) {
					if (typeof name[key] === "string" || typeof name[key] === "number") {
						selector.forEach((sel) => {
							sel.setAttribute(key, name[key]);
						});
					}
				}
			} else {
				makeError(this.ele, "attr", `"String"`, value);
			}
			return this;
		},
		removeAttr: function (value) {
			selector = this.collection;
			if (typeof value === "string") {
				selector.forEach((sel) => {
					sel.removeAttribute(value);
				});
			} else if (Array.isArray(value)) {
				value.forEach((val) => {
					if (typeof val === "string") {
						selector.forEach((sel) => {
							sel.removeAttribute(val);
						});
					} else {
						makeError(this.ele, "removeAttr", `"List Of String"`, val);
					}
				});
			} else {
				makeError(this.ele, "removeAttr", `"String"`, value);
			}
			return this;
		},
		hasAttr: function (value) {
			selector = this.collection;
			if (typeof value === "string") {
				if (selector[0].getAttribute(value)) {
					return true;
				} else {
					return false;
				}
			} else {
				makeError(this.ele, "hasAttr", `"String"`, value);
			}
		},
		find: function (value) {
			selector = this.collection;
			let type = value.split("")[0];
			let ele = value.substring(1);
			let childs = [];
			for (let i = 0; i < selector.length; i++) {
				for (let j = 0; j < selector[i].children.length; j++) {
					if (type === "#") {
						if (selector[i].children[j].id === ele) {
							childs.push(selector[i].children[j]);
						}
					} else if (type === ".") {
						if (selector[i].children[j].classList.contains(ele)) {
							childs.push(selector[i].children[j]);
						}
					} else if (type === ":") {
						if (selector[i].children[j].name === ele) {
							childs.push(selector[i].children[j]);
						}
					} else {
						if (selector[i].children[j].tagName === value.toUpperCase()) {
							childs.push(selector[i].children[j]);
						}
					}
				}
			}
			if (childs.length === 0) {
				throw new Error(`XO("${this.ele}").find("${value}") Not Found In The DOM`);
			}
			return XO(childs);
		},
		attach: function (value) {
			selector = this.collection;
			if (typeof value === "string") {
				selector.forEach((sel) => {
					setTimeout(() => {
						sel.insertAdjacentHTML("beforeend", value);
					}, this.delay);
				});
			} else {
				makeError(this.ele, "attach", `"String"`, value);
			}
			return this;
		},
		attachElement: function (value) {
			selector = this.collection;
			if (typeof value === "object") {
				selector.forEach((sel) => {
					setTimeout(() => {
						sel.append(value);
					}, this.delay);
				});
			} else {
				makeError(this.ele, "attachElement", `"Object"`, value);
			}
			return this;
		},
		pretach: function (value) {
			selector = this.collection;
			if (typeof value === "string") {
				selector.forEach((sel) => {
					sel.insertAdjacentHTML("afterbegin", value);
				});
			} else {
				makeError(this.ele, "pretach", `"String"`, value);
			}
			return this;
		},
		pretachElement: function (value) {
			selector = this.collection;
			if (typeof value === "object") {
				selector.forEach((sel) => {
					sel.prepend(value);
				});
			} else {
				makeError(this.ele, "pretachElement", `"Object"`, value);
			}
			return this;
		},
		replace: function (value) {
			selector = this.collection;
			if (typeof value === "string") {
				selector.forEach((sel) => {
					sel.replaceWith(value);
				});
			} else {
				makeError(this.ele, "replace", `"String"`, value);
			}
			return;
		},
		replaceElement: function (value) {
			selector = this.collection;
			if (typeof value === "object") {
				selector.forEach((sel) => {
					sel.replaceWith(value);
				});
			} else {
				makeError(this.ele, "replaceElement", `"Object"`, value);
			}
			return;
		},
		detach: function (value) {
			selector = this.collection;
			if (typeof value === "string" || typeof value === "undefined") {
				selector.forEach((sel) => {
					if (value) {
						sel.parentNode.removeChild(value);
					} else {
						sel.parentNode.removeChild(sel);
					}
				});
			} else {
				makeError(this.ele, "detach", `"String", "Undefined"`, value);
			}
			return;
		},
		detachElement: function (value) {
			selector = this.collection;
			if (typeof value === "object") {
				selector.forEach((sel) => {
					sel.parentNode.removeChild(value);
				});
			} else {
				makeError(this.ele, "detachElement", `"Object"`, value);
			}
			return;
		},
		addClass: function (...value) {
			selector = this.collection;
			value.forEach((val) => {
				if (typeof val === "string") {
					selector.forEach((sel) => {
						sel.classList.add(val);
					});
				} else {
					makeError(this.ele, "addClass", `"String", "List Of Strings"`, val);
				}
			});
			return this;
		},
		removeClass: function (...value) {
			selector = this.collection;
			value.forEach((val) => {
				if (typeof val === "string") {
					selector.forEach((sel) => {
						sel.classList.remove(val);
					});
				} else {
					makeError(this.ele, "removeClass", `"String", "List Of Strings"`, val);
				}
			});

			return this;
		},
		toggleClass: function (...value) {
			selector = this.collection;
			value.forEach((val) => {
				if (typeof val === "string") {
					selector.forEach((sel) => {
						sel.classList.toggle(val);
					});
				} else {
					makeError(this.ele, "toggleClass", `"String", "List Of Strings"`, val);
				}
			});
			return this;
		},
		replaceClass: function (old, New) {
			selector = this.collection;
			if (typeof old === "string" && typeof New === "string") {
				selector.forEach((sel) => {
					sel.classList.replace(old, New);
				});
			} else {
				if (typeof old !== "string") {
					makeError(this.ele, "replaceClass", `"String", "List Of Strings"`, old);
				} else {
					makeError(this.ele, "replaceClass", `"String", "List Of Strings"`, New);
				}
			}
			return this;
		},
		hasClass: function (value) {
			selector = this.collection;
			if (typeof value === "string") {
				return selector[0].classList.contains(value);
			} else {
				makeError(this.ele, "hasClass", `"String"`, value);
			}
		},
		css: function (value) {
			selector = this.collection;
			if (typeof value === "object") {
				selector.forEach((sel) => {
					for (let j in value) {
						sel.style[j] = value[j];
					}
				});
			} else if (typeof value === "string") {
				let style = getComputedStyle(selector[0]);
				return style[value];
			} else if (typeof value === "undefined") {
				return selector[0].getAttribute("style");
			} else {
				makeError(this.ele, "css", `"Object", "String", "Undefined"`, value);
			}
			return this;
		},
		valid: function (...value) {
			selector = this.collection;
			const valid = {
				email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				phone: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
				zipcode: /^[0-9]{5}$/,
				upper: /.*[A-Z].*/,
				lower: /.*[a-z].*/,
				numeric: /.*\d.*/,
				special: /.*\W.*/,
			};
			const keys = Object.keys(valid);
			let res = [];
			value.forEach((val) => {
				if (typeof val === "string" && keys.includes(val)) {
					res.push(RegExp(valid[val]).test(selector[0].value));
				} else {
					makeError(this.ele, "valid", `"Strings"`, val);
				}
			});
			if (res.includes(false)) return false;
			else return true;
		},
		next: function () {
			selector = this.collection;
			return XO(selector[0].nextElementSibling);
		},
		prev: function () {
			selector = this.collection;
			return XO(selector[0].previousElementSibling);
		},
		parent: function () {
			selector = this.collection;
			return XO(selector[0].parentElement);
		},
		on: function (event, callback) {
			selector = this.collection;
			if (typeof event === "string") {
				if (typeof callback === "function") {
					selector.forEach((sel) => {
						sel.addEventListener(event, callback);
					});
				} else {
					makeError(this.ele, "on", `"Function"`, callback);
				}
			} else {
				makeError(this.ele, "on", `"String"`, event);
			}
			return this;
		},
		hover: function (callback_in, callback_out) {
			selector = this.collection;
			if (typeof callback_in === "function") {
				if (typeof callback_out === "function") {
					selector.forEach((sel) => {
						sel.addEventListener("mouseover", callback_in);
						sel.addEventListener("mouseout", callback_out);
					});
				} else {
					makeError(this.ele, "hover", `"Function"`, callback_out);
				}
			} else {
				makeError(this.ele, "hover", `"Function"`, callback_in);
			}
			return this;
		},
		load: function (callback) {
			selector = this.collection;
			if (typeof callback === "function") {
				selector.forEach((sel) => {
					sel.onreadystatechange = callback;
				});
			} else {
				makeError(this.ele, "load", `"Function"`, callback);
			}
			return this;
		},
		ready: function (callback) {
			selector = this.collection;
			let readyEventHandlersInstalled = false;
			if (typeof callback === "function") {
				selector.forEach((sel) => {
					if (sel.readyState === "complete") {
						setTimeout(callback, 1);
					} else if (!readyEventHandlersInstalled) {
						if (sel.addEventListener) {
							sel.addEventListener("DOMContentLoaded", callback, false);
							window.addEventListener("load", callback, false);
						} else {
							sel.attachEvent("onreadystatechange", readyStateChange);
							window.attachEvent("onload", callback);
						}
						readyEventHandlersInstalled = true;
					}
				});
			} else {
				makeError(this.ele, "ready", `"Function"`, callback);
			}
			return this;
		},
		push: function (callback) {
			selector = this.collection;
			if (typeof callback === "function") {
				selector.forEach((sel) => {
					sel.addEventListener("click", callback);
				});
			} else {
				makeError(this.ele, "push", `"Function"`, callback);
			}
			return this;
		},
		change: function (callback) {
			selector = this.collection;
			if (typeof callback === "function") {
				selector.forEach((sel) => {
					sel.onchange = callback;
				});
			} else {
				makeError(this.ele, "change", `"Function"`, callback);
			}
			return this;
		},
		submit: function (callback) {
			selector = this.collection;
			if (typeof callback === "function") {
				selector.forEach((sel) => {
					sel.onsubmit = callback;
				});
			} else {
				makeError(this.ele, "submit", `"Function"`, callback);
			}
			return this;
		},
		each: function (callback) {
			selector = this.collection;
			if (typeof callback === "function") {
				selector.forEach((sel) => {
					callback(sel);
				});
			} else {
				makeError(this.ele, "each", `"Function"`, callback);
			}
			return this;
		},
		fadeIn: function (t) {
			selector = this.collection;
			if (typeof t === "number" || typeof t === "undefined") {
				selector.forEach((sel) => {
					setTimeout(() => {
						XO(sel).css({
							display: XO(sel).attr("data-display"),
							transition: `opacity ${t}ms ease`,
							opacity: "0",
						});
						setTimeout(() => {
							XO(sel).css({
								opacity: XO(sel).attr("data-opacity"),
							});
						}, 1);
						setTimeout(() => {
							XO(sel).css({
								display: "",
								transition: "",
								opacity: "",
							});
							XO(sel).removeAttr("data-height");
							XO(sel).removeAttr("data-width");
							XO(sel).removeAttr("data-display");
							XO(sel).removeAttr("data-opacity");
							XO(sel).removeAttr("data-padding-top");
							XO(sel).removeAttr("data-padding-right");
							XO(sel).removeAttr("data-padding-bottom");
							XO(sel).removeAttr("data-padding-left");
						}, t);
					}, this.delay);
				});
			} else {
				makeError(this.ele, "fadeIn", `"Int", "Undefined"`, t);
			}
			return this;
		},
		fadeOut: function (t) {
			selector = this.collection;
			if (typeof t === "number" || typeof t === "undefined") {
				selector.forEach((sel) => {
					setTimeout(() => {
						XO(sel).attr({
							"data-height": XO(sel).css("height"),
							"data-width": XO(sel).css("width"),
							"data-display": XO(sel).css("display"),
							"data-opacity": XO(sel).css("opacity"),
							"data-padding-top": XO(sel).css("padding-top"),
							"data-padding-right": XO(sel).css("padding-right"),
							"data-padding-bottom": XO(sel).css("padding-bottom"),
							"data-padding-left": XO(sel).css("padding-left"),
						});
						XO(sel).css({
							transition: `opacity ${t}ms ease`,
						});
						setTimeout(() => {
							XO(sel).css({ opacity: "0" });
						}, 1);
						setTimeout(() => {
							XO(sel).css({
								display: "none",
								opacity: "",
							});
						}, t);
					}, this.delay);
				});
			} else {
				makeError(this.ele, "fadeOut", `"Int", "Undefined"`, t);
			}
			return this;
		},
		fadeToggle: function (t) {
			selector = this.collection;
			selector.forEach((sel) => {
				setTimeout(() => {
					if (XO(sel).css("display") === "none") {
						XO(sel).fadeIn(t);
					} else {
						XO(sel).fadeOut(t);
					}
				}, this.delay);
			});
			return this;
		},
		slideDown: function (t) {
			selector = this.collection;
			if (typeof t === "number" || typeof t === "undefined") {
				selector.forEach((sel) => {
					setTimeout(() => {
						XO(sel).css({
							display: XO(sel).attr("data-display"),
							transition: `height ${t}ms ease,padding ${t}ms ease`,
							overflow: "hidden",
							height: 0,
							"padding-top": 0,
							"padding-bottom": 0,
						});
						setTimeout(() => {
							XO(sel).css({
								height: XO(sel).attr("data-height"),
								"padding-top": XO(sel).attr("data-padding-top"),
								"padding-bottom": XO(sel).attr("data-padding-bottom"),
								"padding-left": XO(sel).attr("data-padding-left"),
								"padding-right": XO(sel).attr("data-padding-right"),
							});
						}, 1);
						setTimeout(() => {
							XO(sel).css({
								display: "",
								transition: "",
								overflow: "",
								height: "",
								"padding-top": "",
								"padding-bottom": "",
								"padding-left": "",
								"padding-right": "",
							});
							XO(sel).removeAttr("data-height");
							XO(sel).removeAttr("data-width");
							XO(sel).removeAttr("data-display");
							XO(sel).removeAttr("data-opacity");
							XO(sel).removeAttr("data-padding-top");
							XO(sel).removeAttr("data-padding-right");
							XO(sel).removeAttr("data-padding-bottom");
							XO(sel).removeAttr("data-padding-left");
						}, t);
					}, this.delay);
				});
			} else {
				makeError(this.ele, "slideDown", `"Int", "Undefined"`, t);
			}
			return this;
		},
		slideUp: function (t) {
			selector = this.collection;
			if (typeof t === "number" || typeof t === "undefined") {
				selector.forEach((sel) => {
					setTimeout(() => {
						XO(sel).attr("data-height", XO(sel).css("height"));
						XO(sel).attr("data-width", XO(sel).css("width"));
						XO(sel).attr("data-display", XO(sel).css("display"));
						XO(sel).attr("data-opacity", XO(sel).css("opacity"));
						XO(sel).attr("data-padding-top", XO(sel).css("padding-top"));
						XO(sel).attr("data-padding-right", XO(sel).css("padding-right"));
						XO(sel).attr("data-padding-bottom", XO(sel).css("padding-bottom"));
						XO(sel).attr("data-padding-left", XO(sel).css("padding-left"));
						XO(sel).css({
							transition: `height ${t}ms ease,padding ${t}ms ease`,
							overflow: "hidden",
							height: XO(sel).css("height"),
						});
						setTimeout(() => {
							XO(sel).css({
								height: "0",
								"padding-top": "0",
								"padding-bottom": "0",
								"padding-left": "0",
								"padding-right": "0",
							});
						}, 1);
						setTimeout(() => {
							XO(sel).css({
								display: "none",
								transition: "",
								overflow: "",
								height: "",
								"padding-top": "",
								"padding-bottom": "",
								"padding-left": "",
								"padding-right": "",
							});
						}, t);
					}, this.delay);
				});
			} else {
				makeError(this.ele, "slideUp", `"Int", "Undefined"`, t);
			}
			return this;
		},
		slideToggle: function (t) {
			selector = this.collection;
			selector.forEach((sel) => {
				setTimeout(() => {
					if (XO(sel).css("display") === "none") {
						XO(sel).slideDown(t);
					} else {
						XO(sel).slideUp(t);
					}
				}, this.sleep);
			});
			return this;
		},
		show: function (t) {
			selector = this.collection;
			if (typeof t === "number" || typeof t === "undefined") {
				selector.forEach((sel) => {
					setTimeout(() => {
						XO(sel).css({
							display: XO(sel).attr("data-display"),
							transition: `opacity ${t}ms ease,width ${t}ms
							ease,height ${t}ms ease,padding ${t}ms ease`,
							overflow: "hidden",
							opacity: "0",
							width: "0",
							height: "0",
							"padding-top": "0",
							"padding-right": "0",
							"padding-bottom": "0",
							"padding-left": "0",
						});
						setTimeout(() => {
							XO(sel).css({
								opacity: XO(sel).attr("data-opacity"),
								height: XO(sel).attr("data-height"),
								width: XO(sel).attr("data-width"),
								"padding-top": XO(sel).attr("data-padding-top"),
								"padding-right": XO(sel).attr("data-padding-right"),
								"padding-bottom": XO(sel).attr("data-padding-bottom"),
								"padding-left": XO(sel).attr("data-padding-left"),
							});
						}, 1);
						setTimeout(() => {
							XO(sel).css({
								display: "",
								transition: "",
								overflow: "",
								opacity: "",
								width: "",
								height: "",
								"padding-top": "",
								"padding-right": "",
								"padding-bottom": "",
								"padding-left": "",
							});
							XO(sel).removeAttr("data-height");
							XO(sel).removeAttr("data-width");
							XO(sel).removeAttr("data-display");
							XO(sel).removeAttr("data-opacity");
							XO(sel).removeAttr("data-padding-top");
							XO(sel).removeAttr("data-padding-right");
							XO(sel).removeAttr("data-padding-bottom");
							XO(sel).removeAttr("data-padding-left");
						}, t);
					}, this.delay);
				});
			} else {
				makeError(this.ele, "show", `"Int", "Undefined"`, t);
			}
			return this;
		},
		hide: function (t) {
			selector = this.collection;
			if (typeof t === "number" || typeof t === "undefined") {
				selector.forEach((sel) => {
					setTimeout(() => {
						XO(sel).attr("data-height", XO(sel).css("height"));
						XO(sel).attr("data-width", XO(sel).css("width"));
						XO(sel).attr("data-display", XO(sel).css("display"));
						XO(sel).attr("data-opacity", XO(sel).css("opacity"));
						XO(sel).attr("data-padding-top", XO(sel).css("padding-top"));
						XO(sel).attr("data-padding-right", XO(sel).css("padding-right"));
						XO(sel).attr("data-padding-bottom", XO(sel).css("padding-bottom"));
						XO(sel).attr("data-padding-left", XO(sel).css("padding-left"));
						XO(sel).css({
							transition: `opacity ${t}ms ease,width ${t}ms ease,height ${t}ms ease,padding ${t}ms ease`,
							height: XO(sel).css("height"),
							width: XO(sel).css("width"),
							"padding-top": XO(sel).css("padding-top"),
							"padding-right": XO(sel).css("padding-right"),
							"padding-bottom": XO(sel).css("padding-bottom"),
							"padding-left": XO(sel).css("padding-left"),
							overflow: "hidden",
						});
						setTimeout(() => {
							XO(sel).css({
								opacity: "0",
								padding: "0",
								height: "0",
								width: "0",
							});
						}, 1);
						setTimeout(() => {
							XO(sel).css({
								display: "none",
								opacity: "",
								height: "",
								width: "",
								padding: "",
							});
						}, t);
					}, this.delay);
				});
			} else {
				makeError(this.ele, "hide", `"Int", "Undefined"`, t);
			}
			return this;
		},
		toggle: function (t) {
			selector = this.collection;
			selector.forEach((sel) => {
				setTimeout(() => {
					if (XO(sel).css("display") === "none") {
						XO(sel).show(t);
					} else {
						XO(sel).hide(t);
					}
				}, this.delay);
			});
			return this;
		},
		sleep: function (t) {
			this.delay = t;
			return this;
		},
		include: function (page) {
			selector = this.collection;
			selector.forEach(async (sel) => {
				const res = await fetch(page);
				const data = await res.text();
				XO(sel).html(data);
			});
			return this;
		},
		index: function (i) {
			selector = this.collection;
			return selector[i];
		},
		size: function () {
			selector = this.collection;
			return selector.length;
		},
		before: function (e) {
			selector = this.collection;
			Target = selector[0];
			Parent = XO(selector[0]).parent().index(0);
			Parent.insertBefore(e, Target);
			return this;
		},
	};
	return XO;
})();

XO.ajax = function ({ url, method, data, mode, progress, success, xhr }) {
	let XHR = new XMLHttpRequest();
	if (typeof xhr === "function") {
		xhr(XHR);
	}
	XHR.upload.onprogress = function (e) {
		if (typeof progress === "function") {
			progress(e);
		}
	};
	XHR.onload = function () {
		if (this.status === 200) {
			if (typeof success === "function") {
				success(this.responseText);
			}
		}
	};
	if (typeof method === "undefined" || method.localeCompare("get", undefined, { sensitivity: "accent" }) === 0) {
		method = "GET";
	} else if (method.localeCompare("post", undefined, { sensitivity: "accent" }) === 0) {
		method = "POST";
	}
	let form;
	if (method === "POST") {
		if (data instanceof FormData) {
			form = data;
		} else if (data instanceof Object) {
			form = new FormData();
			for (d in data) {
				form.append(d, data[d]);
			}
		}
	} else if (method === "GET") {
		form = "";
		for (d in data) {
			form += `&${d}=${data[d]}`;
		}
		form = form.substring(1);
		url = url + "?" + form;
		form = "";
	}
	if (typeof mode === "boolean") {
		if (typeof mode === "undefined") {
			mode = true;
		}
	}
	XHR.open(method, url, mode);
	XHR.send(form);
};

XO.uploadBox = function ({ selector, type, image }) {
	const name = XO(selector).attr("name");
	const cls = selector.substring(1);
	const el = document.querySelector(`[name='${cls}']`);
	const id = XO(selector).attr("id");
	let Display = "";
	if (typeof image === "string") {
		Display = '<img src="' + image + '">';
	}
	let container = document.createElement("div");
	let content = `
			<input type="file" name="${name}" id="${id}" />
			<span class="uploadbox-trigger"></span>
			<span class="uploadbox-display">${Display}</span>
		`;
	container.setAttribute("class", cls + " uploadbox " + type);
	container.innerHTML = content;
	el.replaceWith(container);
	document.querySelector(`.${cls} span.uploadbox-trigger`).style.display = "none";
	let input = document.querySelector(`#${id}`);
	let display = document.querySelector(`.${cls} .uploadbox-display`);
	let cancel = document.querySelector(`.${cls} span.uploadbox-trigger`);
	input.addEventListener("change", (event) => {
		let image = `<img src="${URL.createObjectURL(event.target.files[0])}">`;
		display.innerHTML = image;
		cancel.style.display = "block";
	});
	cancel.addEventListener("click", function () {
		this.style.display = "none";
		display.innerHTML = Display;
		input.type = "text";
		input.type = "file";
	});
};

XO.accordion = function (target) {
	setTimeout(() => {
		XO(target).find(".accordion-panel").slideUp();
	}, 100);
	XO(target)
		.find(".accordion-button")
		.push(function () {
			this.classList.toggle("active");
			XO(this).next().slideToggle(100);
		});
};

XO.slider = function (target, time) {
	XO(target).each((t) => {
		let dots;
		let slides = XO(t).find(".slider-slide").collection;
		try {
			dots = XO(t).find(".slider-controll").find(".dot").collection;
			if (XO(dots).size() === 1) XO(t).find(".slider-controll").index(0).style.display = "none";
		} catch {
			XO(t).find(".slider-controll").index(0).style.display = "none";
		}
		let prev = XO(t).find(".slider-controll").find(".prev").index(0);
		let next = XO(t).find(".slider-controll").find(".next").index(0);
		let index = 0;
		let ds = [];
		dots[index].classList.add("active");
		slides[index].style["pointer-events"] = "all";
		slides[index].style["opacity"] = "1";
		slides[index].style["position"] = "relative";
		dots.forEach((dot) => {
			ds.push(dot);
		});
		let hideslides = function () {
			slides.forEach((slide) => {
				slide.style["pointer-events"] = "none";
				slide.style["opacity"] = "0";
				slide.style["position"] = "";
			});
		};
		let removedot = function () {
			dots.forEach((dot) => {
				dot.classList.remove("active");
			});
		};
		let Next = function () {
			if (index < slides.length - 1) {
				removedot();
				hideslides();
				dots[index + 1].classList.add("active");
				slides[index + 1].style["pointer-events"] = "all";
				slides[index + 1].style["opacity"] = "1";
				slides[index + 1].style["position"] = "relative";
				index++;
			} else {
				removedot();
				hideslides();
				index = 0;
				dots[index].classList.add("active");
				slides[index].style["pointer-events"] = "all";
				slides[index].style["opacity"] = "1";
				slides[index].style["position"] = "relative";
			}
		};
		let Prev = function () {
			if (index > 0) {
				removedot();
				hideslides();
				dots[index - 1].classList.add("active");
				slides[index - 1].style["pointer-events"] = "all";
				slides[index - 1].style["opacity"] = "1";
				slides[index - 1].style["position"] = "relative";
				index--;
			} else {
				removedot();
				hideslides();
				index = slides.length - 1;
				dots[index].classList.add("active");
				slides[index].style["pointer-events"] = "all";
				slides[index].style["opacity"] = "1";
				slides[index].style["position"] = "relative";
			}
		};
		dots.forEach((dot) => {
			dot.addEventListener("click", function () {
				hideslides();
				removedot();
				dots[ds.indexOf(dot)].classList.add("active");
				slides[ds.indexOf(dot)].style["pointer-events"] = "all";
				slides[ds.indexOf(dot)].style["opacity"] = "1";
				slides[ds.indexOf(dot)].style["position"] = "relative";
				index = ds.indexOf(dot);
			});
		});
		next.addEventListener("click", function () {
			Next();
		});
		prev.addEventListener("click", function () {
			Prev();
		});
		if (typeof time !== "undefined" && typeof time === "number") {
			setInterval(() => {
				Next();
			}, time);
		}
	});
};

XO.timer = function ({ target, Class, hours, minutes, seconds }) {
	let spanh = document.createElement("span");
	let spanm = document.createElement("span");
	let spans = document.createElement("span");
	let spanbreak1 = document.createElement("span");
	let spanbreak2 = document.createElement("span");
	spanh.setAttribute("id", "timer-hours");
	spanm.setAttribute("id", "timer-minutes");
	spans.setAttribute("id", "timer-seconds");
	spanh.setAttribute("class", "icon");
	spanm.setAttribute("class", "icon");
	spans.setAttribute("class", "icon");
	spanbreak1.setAttribute("class", "tag tag-sm tag-blank");
	spanbreak2.setAttribute("class", "tag tag-sm tag-blank");
	if (Class) {
		clh = spanh.getAttribute("class");
		clm = spanm.getAttribute("class");
		cls = spans.getAttribute("class");
		clh = clh + " " + Class;
		clm = clm + " " + Class;
		cls = cls + " " + Class;
		spanh.setAttribute("class", clh);
		spanm.setAttribute("class", clm);
		spans.setAttribute("class", cls);
	}
	document.querySelector(target).appendChild(spanh);
	document.querySelector(target).appendChild(spanbreak1);
	document.querySelector(target).appendChild(spanm);
	document.querySelector(target).appendChild(spanbreak2);
	document.querySelector(target).appendChild(spans);
	setInterval(() => {
		if (seconds < 1) {
			seconds = 60;
			minutes--;
		}
		if (minutes < 1) {
			minutes = 59;
			hours--;
		}
		if (hours < 1) {
			hours = 00;
		}
		seconds--;
		if (hours.toString().length < 2) {
			spanh.innerText = "0" + hours;
		} else {
			spanh.innerText = hours;
		}
		if (minutes.toString().length < 2) {
			spanm.innerText = "0" + minutes;
		} else {
			spanm.innerText = minutes;
		}
		if (seconds.toString().length < 2) {
			spans.innerText = "0" + seconds;
		} else {
			spans.innerText = seconds;
		}
	}, 1000);
};

XO.getNum = function (string) {
	if (typeof string === "string") {
		return string.match(/\d/g).join("");
	} else {
		throw new Error("you must insert a string");
	}
};

XO.storage = function (name, value) {
	if (typeof name === "string") {
		if (typeof value === "undefined") {
			if (localStorage.getItem(name)) {
				return localStorage.getItem(name);
			} else {
				return false;
			}
		} else {
			localStorage.setItem(name, value);
			return true;
		}
	} else {
		throw new Error(`XO("${selector}").attr(...) accept String as first argument not ${typeof name}`);
	}
};

XO.removeStorage = function (name) {
	if (typeof name === "string") {
		if (localStorage.removeItem(name)) {
			return true;
		} else {
			return false;
		}
	} else {
		throw new Error(`XO("${selector}").attr(...) accept String as first argument not ${typeof name}`);
	}
};

XO.hasStorage = function (name) {
	if (typeof name === "string") {
		if (localStorage.getItem(name)) {
			return true;
		} else {
			return false;
		}
	} else {
		throw new Error(`XO("${selector}").attr(...) accept String as first argument not ${typeof name}`);
	}
};

XO.session = function (name, value) {
	if (typeof name === "string") {
		if (typeof value === "undefined") {
			if (sessionStorage.getItem(name)) {
				return sessionStorage.getItem(name);
			} else {
				return false;
			}
		} else {
			sessionStorage.setItem(name, value);
			return true;
		}
	} else {
		throw new Error(`XO("${selector}").attr(...) accept String as first argument not ${typeof name}`);
	}
};

XO.removeSession = function (name) {
	if (typeof name === "string") {
		if (sessionStorage.removeItem(name)) {
			return true;
		} else {
			return false;
		}
	} else {
		throw new Error(`XO("${selector}").attr(...) accept String as first argument not ${typeof name}`);
	}
};

XO.hasSession = function (name) {
	if (typeof name === "string") {
		if (sessionStorage.getItem(name)) {
			return true;
		} else {
			return false;
		}
	} else {
		throw new Error(`XO("${selector}").attr(...) accept String as first argument not ${typeof name}`);
	}
};

XO.block = function () {
	var el = document.createElement("div");
	XO(el).addClass("block").addClass("col-8").addClass("md-12").addClass("sm-12");
	return el;
};

XO.title = function (args) {
	var valid = ["one", "two", "three", "four", "five", "six"];
	if (typeof args === "undefined") args = {};
	if (typeof args.text === "undefined") args.text = "Header here";
	if (typeof args.type === "undefined") args.type = "one";
	if (typeof args.text !== "string" && typeof args.text !== "number") throw new Error(`${args.text} must be a string || number`);
	if (typeof args.type !== "string") throw new Error(`${args.type} must be a string`);
	if (valid.includes(args.type) !== true) throw new Error(`${args.type} must be one of ${valid}`);
	var el = document.createElement("h1");
	XO(el)
		.addClass("margin-bottom-five")
		.addClass("margin-top-four")
		.addClass("title-" + args.type)
		.text(args.text);

	return el;
};

XO.subTitle = function (args) {
	var valid = ["one", "two", "three", "four", "five", "six"];
	if (typeof args === "undefined") args = {};
	if (typeof args.text === "undefined") args.text = "Header here";
	if (typeof args.type === "undefined") args.type = "one";
	if (typeof args.text !== "string" && typeof args.text !== "number") throw new Error(`${args.text} must be a string || number`);
	if (typeof args.type !== "string") throw new Error(`${args.type} must be a string`);
	if (valid.includes(args.type) !== true) throw new Error(`${args.type} must be one of ${valid}`);
	var el = document.createElement("h1");
	XO(el)
		.addClass("subtitle-" + args.type)
		.text(args.text)
		.addClass("margin-bottom-six");
	return el;
};

XO.textBox = function (args) {
	if (typeof args === "undefined") args = {};
	if (typeof args.text === "undefined") args.text = "Type here";
	if (typeof args.holder === "undefined") args.holder = "Type here";
	if (typeof args.text !== "string" && typeof args.text !== "number") throw new Error(`${args.text} must be a string || number`);
	if (typeof args.holder !== "string" && typeof args.holder !== "number") throw new Error(`${args.holder} must be a string`);
	var el = document.createElement("input");
	XO(el)
		.val(args.text)
		.attr("placeholder", args.holder)
		.attr("type", "text")
		.addClass("formbox")
		.addClass("formbox-lg")
		.addClass("horizontal-fluid")
		.css({ margin: "5px 0" });
	return el;
};

XO.textArea = function (args) {
	if (typeof args === "undefined") args = {};
	if (typeof args.text === "undefined") args.text = "Type here";
	if (typeof args.holder === "undefined") args.holder = "Type here";
	if (typeof args.text !== "string" && typeof args.text !== "number") throw new Error(`${args.text} must be a string || number`);
	if (typeof args.holder !== "string" && typeof args.holder !== "number") throw new Error(`${args.holder} must be a string`);
	var el = document.createElement("textarea");
	XO(el)
		.text(args.text)
		.attr("placeholder", args.holder)
		.attr("rows", 3)
		.addClass("formbox")
		.addClass("formbox-lg")
		.addClass("horizontal-fluid")
		.css({ margin: "5px 0" });
	return el;
};

XO.alert = function (args) {
	var valid = ["", "primary", "secondary", "success", "info", "warning", "danger", "dark"];
	if (typeof args === "undefined") args = {};
	if (typeof args.text === "undefined") args.text = "Text here";
	if (typeof args.type === "undefined") args.type = "";
	if (typeof args.ctrl === "undefined") args.ctrl = false;
	if (typeof args.text !== "string" && typeof args.text !== "number") throw new Error(`${args.text} must be a string || number`);
	if (typeof args.type !== "string") throw new Error(`${args.type} must be a string`);
	if (typeof args.ctrl !== "boolean") throw new Error(`${args.ctrl} must be a boolean`);
	if (valid.includes(args.type) !== true) throw new Error(`${args.type} must be one of ${valid}`);
	var container = document.createElement("div");
	var graph = document.createElement("p");
	XO(graph).text(args.text);
	if (args.ctrl) {
		var btn = document.createElement("button");
		XO(btn).addClass("close").html("&times;");
		XO(btn).on("click", function () {
			XO(this).parent().remove();
		});
		XO(container).attachElement(btn);
	}
	if (args.type !== null) {
		if (args.type === "dark") args.type = "bold";
		args.type = "alert-" + args.type;
	}
	XO(container).addClass(args.type);
	XO(container)
		.addClass("alert")
		.css({
			margin: "5px 0",
			"border-radius": "var(--gap)",
		})
		.attachElement(graph);
	return container;
};

XO.box = function (args) {
	var valid = ["", "primary", "secondary", "success", "info", "warning", "danger", "dark"];
	if (typeof args === "undefined") args = {};
	if (typeof args.text === "undefined") args.text = "Text here";
	if (typeof args.head === "undefined") args.head = "Text here";
	if (typeof args.type === "undefined") args.type = "";
	if (typeof args.ctrl === "undefined") args.ctrl = false;
	if (typeof args.text !== "string" && typeof args.text !== "number") throw new Error(`${args.text} must be a string || number`);
	if (typeof args.head !== "string" && typeof args.head !== "number") throw new Error(`${args.head} must be a string || number`);
	if (typeof args.type !== "string") throw new Error(`${args.type} must be a string`);
	if (typeof args.ctrl !== "boolean") throw new Error(`${args.ctrl} must be a boolean`);
	if (valid.includes(args.type) !== true) throw new Error(`${args.type} must be one of ${valid}`);
	var container = document.createElement("div");
	var head = document.createElement("div");
	var graph = document.createElement("p");
	XO(head).text(args.head);
	XO(graph).text(args.text);
	if (args.ctrl) {
		var btn = document.createElement("button");
		XO(btn).addClass("close").html("&times;");
		XO(btn).on("click", function () {
			XO(this).parent().detach();
		});
		XO(container).attachElement(btn);
	}
	if (args.type !== null) {
		if (args.type === "dark") args.type = "bold";
		args.type = "box-" + args.type;
	}
	XO(container).addClass(args.type);
	XO(head).addClass("box-header");
	XO(container)
		.addClass("box")
		.css({
			"border-radius": "var(--gap)",
		})
		.attachElement(head)
		.attachElement(graph);
	return container;
};

XO.btn = function (args) {
	var valid = ["", "primary", "secondary", "success", "info", "warning", "danger", "dark"];
	if (typeof args === "undefined") args = {};
	if (typeof args.text === "undefined") args.text = "Button";
	if (typeof args.type === "undefined") args.type = "";
	if (typeof args.load === "undefined") args.load = false;
	if (typeof args.text !== "string" && typeof args.text !== "number") throw new Error(`${args.text} must be a string || number`);
	if (typeof args.type !== "string") throw new Error(`${args.type} must be a string`);
	if (typeof args.load !== "boolean") throw new Error(`${args.load} must be a boolean`);
	if (valid.includes(args.type) !== true) throw new Error(`${args.type} must be one of ${valid}`);
	var el = document.createElement("button");
	XO(el).addClass("btn").text(args.text).css({ margin: "5px 0" });
	if (args.type !== null) {
		if (args.type === "dark") args.type = "bold";
		args.type = "btn-" + args.type;
	}
	XO(el).addClass(args.type);
	if (args.load) XO(el).addClass("btn-loading");
	return el;
};

XO.checkBox = function (args) {
	var valid = ["", "primary", "secondary", "success", "info", "warning", "danger", "dark"];
	if (typeof args === "undefined") args = {};
	if (typeof args.text === "undefined") args.text = "Text";
	if (typeof args.type === "undefined") args.type = "";
	if (typeof args.active === "undefined") args.active = false;
	if (typeof args.text !== "string" && typeof args.text !== "number") throw new Error(`${args.text} must be a string || number`);
	if (typeof args.type !== "string") throw new Error(`${args.type} must be a string`);
	if (typeof args.active !== "boolean") throw new Error(`${args.active} must be a boolean`);
	if (valid.includes(args.type) !== true) throw new Error(`${args.type} must be one of ${valid}`);
	var wrap = document.createElement("label");
	var check = document.createElement("input");
	var trigger = document.createElement("span");
	var label = document.createElement("span");
	if (args.type !== null) {
		if (args.type === "dark") args.type = "bold";
		args.type = "switch-" + args.type;
	}
	XO(wrap).addClass(args.type);
	XO(wrap).addClass("switch").addClass("switch-rounded").css({ margin: "5px 0", display: "flex" });
	XO(check).attr("type", "checkbox");
	XO(trigger).addClass("switch-trigger");
	XO(label).addClass("switch-label").text(args.text);
	if (args.active) check.checked = true;
	XO(wrap).attachElement(check).attachElement(trigger).attachElement(label);
	return wrap;
};

XO.create = function (ele) {
	if (typeof ele !== "string") {
		throw new Error(`XO.create(...) accept ["String"] not ["${typeof ele}"]`);
	}
	ele = document.createElement(ele);
	return XO(ele);
};

XO.validate = (form, success, error) => {
	var childs = [];
	form = document.querySelector(form);
	if (form.tagName !== "FORM") return false;
	for (let i = 0; i < form.length; i++) {
		if (form[i].nodeType == 1 && (form[i].tagName === "INPUT" || form[i].tagName === "TEXTEARA")) getChilds(form[i], childs);
	}
	var valid = [];
	childs.forEach((child) => {
		if (child.value.trim() === "") {
			valid.push(false);
			error(child);
		} else {
			valid.push(true);
			success(child);
		}
	});
	if (valid.includes(false)) return false;
	else return true;
};

const getChilds = (el, descendants) => {
	descendants.push(el);
	var children = el.childNodes;
	for (let i = 0; i < children.length; i++) {
		if (children[i].nodeType == 1) {
			getChilds(children[i]);
		}
	}
};
