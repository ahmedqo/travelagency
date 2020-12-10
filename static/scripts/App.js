const navSystem = () => {
    const w = window.innerWidth;
    if (w > 770) {
        XO(".nav-menu").slideDown(100);
    } else {
        XO(".nav-menu").slideUp(100);
    }
};

const goTo = async(url) => {
    XO("#root").html("<div class='loading'></div>");
    lnk = url.split("#");
    if (!Object.keys(URLS).includes(lnk[0])) {
        goTo("/404/");
        return false;
    }
    if (IDS.includes(lnk[0]) && lnk[1] === undefined) {
        goTo("/404/");
        return false;
    }
    if (!IDS.includes(lnk[0]) && lnk[1] !== undefined) {
        goTo("/404/");
        return false;
    }
    history.pushState(null, URLS[lnk[0]]["title"], "#" + url);
    const req = await fetch(URLS[lnk[0]]["url"]);
    const res = await req.text();
    XO("#root").html(res);
    document.title = URLS[lnk[0]]["title"];
    if (URLS[lnk[0]]["def"]) URLS[lnk[0]]["def"]();
};

const alert = (msg) => {
    var box = XO.create("xo-box").attr({ header: msg["head"], message: msg["text"], type: msg["type"], trigger: msg["ctrl"] }).index(0);
    var wrapper = XO.create("div")
        .addClass("boxWrapper", "col-4", "lg-8", "md-10", "sm-12", "position-fixed", "position-bottom-center", "padding-none")
        .attachElement(box)
        .index(0);
    XO(document.body).attachElement(wrapper);
    setTimeout(() => {
        if (XO(".boxWrapper").size() > 0) XO(wrapper).detach();
    }, 5000);
};

const validation = (form) => {
    if (form.tagName !== "FORM") return false;
    const childs = [];
    for (let i = 0; i < form.length; i++) {
        if (form[i].nodeType == 1 && (form[i].tagName === "INPUT" || form[i].tagName === "TEXTEARA")) getChilds(form[i], childs);
    }
    var valid = [];
    childs.forEach((child) => {
        if (child.value.trim() === "") {
            valid.push(false);
            XO(child).css({
                border: "1px solid var(--danger_dark)",
                "background-color": "var(--danger_light)",
            });
        } else {
            valid.push(true);
            XO(child).css({
                border: "1px solid var(--success_dark)",
                "background-color": "var(--success_light)",
            });
        }
    });
    if (valid.includes(false)) return false;
    else return true;
};

const validPhone = () => {
    if (!XO(":phone").valid("phone")) {
        XO(":phone").css({
            border: "1px solid var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "Phone number Not valid."];
    }
    return [true];
};

const validEmail = () => {
    if (!XO(":email").valid("email")) {
        XO(":email").css({
            border: "1px solid var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "Email Not valid."];
    }
    return [true];
};

const validPass = () => {
    if (!XO(":password").valid("lower", "upper", "numeric")) {
        XO(":password").css({
            border: "1px solid var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "Password Must Contain (uppercase letters, lowercase letters and numbers)."];
    }
    return [true];
};

const validRPass = () => {
    if (XO(":confirmPassword").val() !== XO(":password").val()) {
        XO(":confirmPassword").css({
            border: "1px solid var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "Passwords Do Not Match."];
    }
    return [true];
};

const passToText = (e) => {
    const t = XO(e.target).next();
    if (t.attr("type") === "text") {
        t.attr("type", "password");
    } else {
        t.attr("type", "text");
    }
};

const copyText = (e) => {
    XO(e.target).next().index(0).select();
    document.execCommand("copy");
};

const inputBlur = () => {
    XO("input").each(function(i) {
        XO(i).on("blur", () => {
            if (XO(i).val().trim() == "") {
                XO(i).css({
                    "border-color": "var(--danger)",
                    background: "var(--danger_light)",
                });
                valid = false;
            } else {
                XO(i).css({
                    "border-color": "var(--success)",
                    background: "var(--success_light)",
                });
                valid = true;
            }
        });
    });
};

const validCreateUserForm = (e) => {
    if (!validation(e)) {
        return [false, "All Fields Required."];
    }
    if (!validPhone()[0]) {
        return validPhone();
    }
    if (!validEmail()[0]) {
        return validEmail();
    }
    if (XO(":password").size() > 0) {
        if (!validPass()[0]) {
            return validPass();
        }
    }
    if (XO(":confirmPassword").size() > 0) {
        if (!validRPass()[0]) {
            return validRPass();
        }
    }
    return [true];
};

const createUser = async(e) => {
    e.preventDefault();
    const message = { head: "Error Message", text: "", type: "danger", ctrl: "true" };
    const valid = validCreateUserForm(e.target);
    if (!valid[0]) {
        message["text"] = valid[1];
        alert(message);
    } else {
        const entries = new FormData(e.target);
        entries.append("action", "create");
        const req = await fetch("controllers/users.php", { method: "POST", body: entries });
        const res = await req.json();
        if (res["type"] === "success") {
            message["head"] = "Success Message";
            e.target.reset();
        } else {
            message["head"] = "Error Message";
        }
        message["type"] = res["type"];
        message["text"] = res["message"];
        alert(message);
    }
};

const signIn = async(e) => {
    e.preventDefault();
    const message = { head: "Error Message", text: "", type: "danger", ctrl: "true" };
    if (!validation(e.target)) {
        message["text"] = "All Fields Required.";
        alert(message);
    } else {
        const entries = new FormData(e.target);
        entries.append("action", "login");
        const req = await fetch("controllers/users.php", { method: "POST", body: entries });
        const res = await req.json();
        if (res["type"] === "success") message["head"] = "Success Message";
        else message["head"] = "Error Message";
        message["type"] = res["type"];
        message["text"] = res["message"];
        alert(message);
        if (res.status === 200) {
            const valid = await getSession();
            if (valid["type"] !== "-1") goTo("/a/profile/");
            else goTo("/m/profile/");
        }
    }
};

const updateUser = async(e) => {
    e.preventDefault();
    const message = { head: "Error Message", text: "", type: "danger", ctrl: "true" };
    if (!validation(e.target)) {
        message["text"] = "All Fields Required.";
        alert(message);
    } else {
        const entries = new FormData(e.target);
        entries.append("action", "update");
        const req = await fetch("controllers/users.php", { method: "POST", body: entries });
        const res = await req.json();
        if (res["type"] === "success") message["head"] = "Success Message";
        else message["head"] = "Error Message";
        message["type"] = res["type"];
        message["text"] = res["message"];
        alert(message);
    }
};

const updatePassword = async(e) => {
    e.preventDefault();
    const message = { head: "Error Message", text: "", type: "danger", ctrl: "true" };
    if (!validation(e.target)) {
        message["text"] = "All Fields Required.";
        alert(message);
    } else {
        const entries = new FormData(e.target);
        entries.append("action", "updatePassword");
        const req = await fetch("controllers/users.php", { method: "POST", body: entries });
        const res = await req.json();
        if (res["type"] === "success") {
            message["head"] = "Success Message";
            e.target.reset();
        } else {
            message["head"] = "Error Message";
        }
        message["type"] = res["type"];
        message["text"] = res["message"];
        alert(message);
    }
};

const loadNavBar = async() => {
    const req = await fetch("views/navbar.html");
    const res = await req.text();
    XO("#menu").html(res);
    navSystem();
    changeNavBar();
    XO(".menu-item").each((i) => {
        XO(i).push(async() => {
            const url = XO(i).attr("data-url");
            goTo(url);
        });
    });
    XO(".nav-trigger").push(() => {
        XO(".nav-menu").slideToggle(100);
    });
    XO(window).on("resize", () => {
        navSystem();
    });
};

const changeNavBar = async() => {
    const valid = await getSession();
    if (valid) {
        let url = "/profile/";
        if (valid["type"] !== "-1") url = "/a" + url;
        else url = "/a" + url;
        const link = document.createElement("a");
        XO(link).attr("data-url", url).addClass("menu-item").text("Account");
        XO(".nav-menu").html("").attachElement(link);
        XO(link).push(async() => {
            goTo(url);
        });
    }
};

const loadAccordion = () => {
    XO.accordion(".accordion");
    XO.slider(".slider", 3000);
    setTimeout(() => {
        XO(".accordion-button").index(0).click();
    }, 1000);
};

const homeNavBar = async() => {
    await loadNavBar();
    await loadAccordion();
    XO(".nav")
        .addClass("homenav")
        .css({ "background-color": "transparent" })
        .parent()
        .parent()
        .addClass("position-absolute", "position-top-left")
        .removeClass("bg-primary");
    XO(".nav-container").css({ "background-color": "transparent" });
    XO(".nav-menu").css({ "background-color": "transparent" });
    XO(window).on("scroll", () => {
        if (XO(".homenav").size() > 0) {
            const h = this.innerHeight;
            const s = this.scrollY;
            if (s > h) {
                XO(".homenav")
                    .css({ "background-color": "" })
                    .parent()
                    .parent()
                    .css({ "z-index": 100 })
                    .addClass("position-fixed", "position-top-left")
                    .addClass("bg-primary");
                XO(".nav-container").css({ "background-color": "" });
                XO(".nav-menu").css({ "background-color": "" });
            } else {
                XO(".homenav")
                    .css({ "background-color": "transparent" })
                    .parent()
                    .parent()
                    .css({ "z-index": 100 })
                    .addClass("position-fixed", "position-top-left")
                    .removeClass("bg-primary", "position-absolute");
                XO(".nav-container").css({ "background-color": "transparent" });
                XO(".nav-menu").css({ "background-color": "transparent" });
            }
        }
    });
};

const getSession = async() => {
    const entries = new FormData();
    entries.append("action", "get");
    const req = await fetch("controllers/session.php", { method: "POST", body: entries });
    const res = await req.json();
    return res;
};

const clearSession = async() => {
    const entries = new FormData();
    entries.append("action", "clear");
    const req = await fetch("controllers/session.php", { method: "POST", body: entries });
    const res = await req.json();
    goTo("/auth/signin/");
};

const authNavBar = async() => {
    const valid = await getSession();
    const url = location.hash;
    if (url.includes("auth") && valid) {
        if (valid["type"] !== "-1") goTo("/a/profile/");
        else goTo("/m/profile/");
    } else {
        loadNavBar();
    }
};

const authSignUp = async() => {
    await authNavBar();
    await inputBlur();
    XO(":phone").on("blur", validPhone);
    XO(":email").on("blur", validEmail);
    XO(":password").on("blur", validPass);
    XO(":rePassword").on("blur", validRPass);
};

const authSignIn = async() => {
    await authNavBar();
    await inputBlur();
};

const loadSideBar = async() => {
    const valid = await getSession();
    if (!valid) {
        goTo("/auth/signin/");
        return false;
    }
    if (valid["type"] !== "1" && FORBIDEN.includes(location.hash.substr(1))) {
        goTo("/404/");
        return false;
    }
    if (valid["type"] === "-1" && location.hash.substr(1).includes("/a/")) {
        const url = location.hash.substr(1).replace("/a", "/m");
        goTo(url);
        return false;
    }
    if (valid["type"] !== "-1" && location.hash.substr(1).includes("/m/")) {
        const url = location.hash.substr(1).replace("/m", "/a");
        goTo(url);
        return false;
    }
    const req = await fetch("views/sidebar.html");
    const res = await req.text();
    XO("#sidebar").html(res);
    XO(".list-item").each((i) => {
        if (XO(i).hasAttr("data-url") && !XO(i).hasClass("cnt")) {
            if (valid["type"] === "1") {
                let url = XO(i).attr("data-url");
                url = "/a" + url;
                XO(i).attr("data-url", url);
            }
            if (valid["type"] === "0") {
                let url = XO(i).attr("data-url");
                url = "/a" + url;
                XO(i).attr("data-url", url);
                if (XO(i).hasClass("sdn")) {
                    XO(i).detach();
                }
            }
            if (valid["type"] === "-1") {
                let url = XO(i).attr("data-url");
                url = "/m" + url;
                XO(i).attr("data-url", url);
                if (XO(i).hasClass("adn")) {
                    XO(i).detach();
                }
            }
        }
        if (XO(i).attr("data-url") === location.hash.substr(1)) {
            XO(i).addClass("item-primary", "atv");
        }
        if (!XO(i).hasClass("atv")) {
            XO(i).hover(
                () => {
                    XO(i).addClass("item-primary");
                },
                () => {
                    XO(i).removeClass("item-primary");
                }
            );
        }
        XO(i).push(async(e) => {
            e.preventDefault();
            let url = XO(i).attr("data-url");
            goTo(url);
        });
    });
};

const getUser = async(id) => {
    const entries = new FormData();
    entries.append("id", id);
    entries.append("action", "get");
    const req = await fetch("controllers/users.php", { method: "POST", body: entries });
    const res = await req.json();
    if (XO(":id").size() > 0) {
        XO(":id").val(res["id"]);
        XO(":type")
            .find("option")
            .each((o) => {
                if (XO(o).val() === res["type"]) {
                    XO(o).attr("selected", "true");
                }
            });
    }
    XO(":username").val(res["username"]);
    XO(":firstname").val(res["firstname"]);
    XO(":lastname").val(res["lastname"]);
    XO(":phone").val(res["phone"]);
    XO(":email").val(res["email"]);
    XO(":cin").val(res["cin"]);
    XO(":address").val(res["address"]);
    XO(":city").val(res["city"]);
    XO(":country").val(res["country"]);
    await inputBlur();
    XO(":phone").on("blur", validPhone);
    XO(":email").on("blur", validEmail);
};

const getprofile = async() => {
    await loadSideBar();
    var ID = await getSession();
    ID = ID["id"];
    await getUser(ID);
    XO(":password").on("blur", validPass);
    XO(":rePassword").on("blur", validRPass);
};

const loadUser = async() => {
    await loadSideBar();
    var ID = await getUrlId();
    await getUser(ID);
};

const getUsers = async(status) => {
    await loadSideBar();
    const ID = await getSession();
    const entries = new FormData();
    entries.append("action", "getAll");
    const req = await fetch("controllers/users.php", { method: "POST", body: entries });
    const res = await req.json();
    XO("#display").html("");
    if (res.length <= 1) {
        XO("#display").html(NODATA);
    }
    res.forEach((r) => {
        if (typeof status !== "undefined") {
            if (r["status"] === status && ID["id"] !== r["id"]) {
                const user = userCard(r);
                XO("#display").attach(user);
            }
        } else {
            if (ID["id"] !== r["id"]) {
                const user = userCard(r);
                XO("#display").attach(user);
            }
        }
    });
};

const setUsers = async() => {
    await loadSideBar();
    await inputBlur();
    const pass = randPass();
    XO(":phone").on("blur", validPhone);
    XO(":email").on("blur", validEmail);
    XO(":username").val(pass);
    XO(":password").val(pass);
};

const randPass = () => {
    let lower = "qwertyuiopasdfghjklzxcvbnm".split("");
    let upper = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
    let numbr = "0123456789".split("");
    lower = lower.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6));
    upper = upper.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6));
    numbr = numbr.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6));
    let pass = lower
        .concat(upper, numbr)
        .sort(() => 0.5 - Math.random())
        .join("");
    if (pass.length < 8) {
        return randPass();
    }
    return pass;
};

const userCard = (user) => {
    var status;
    if (parseInt(user["status"])) status = `<a onclick="userStatus(${user["id"]}, 0)" class="icon icon-rounded icon-danger"><i class="XO-ban"></i></a>`;
    else status = `<a onclick="userStatus(${user["id"]}, 1)" class="icon icon-rounded icon-success"><i class="XO-check"></i></a>`;
    return `
		<div class="usrcrd col-4 md-6 sm-12 padding-six">
            <div class="padding-top-five padding-right-five position-relative">
                <span class="tag tag-lg tag-primary position-absolute position-top-left margin-left-six">${user["username"]}</span>
				<div class="position-absolute position-right-center" style="width:min-content; margin-top: -40px">
                        <a onclick="goTo('/a/users/edit/#${user["id"]}')" class="icon icon-rounded icon-warning"><i class="XO-edit"></i></a>
                        <div style="padding: 2px 0"></div>
                        ${status}
                        <div style="padding: 2px 0"></div>
                        <a onclick="deleteUser(${user["id"]})" class="icon icon-rounded icon-bold"><i class="XO-trash"></i></a>
				</div>
				<div class="block bg-light padding-top-five align-items-center">
					<div class="col-4 txt-right"><span class="tag tag-md tag-bold tag-blank">First Name</span></div>
					<div class="col-8">${user["firstname"]}</div>
					<div class="col-4 txt-right"><span class="tag tag-md tag-bold tag-blank">Last Name</span></div>
					<div class="col-8">${user["lastname"]}</div>
					<div class="col-4 txt-right"><span class="tag tag-md tag-bold tag-blank">Cin</span></div>
					<div class="col-8">${user["cin"]}</div>
					<div class="col-4 txt-right"><span class="tag tag-md tag-bold tag-blank">Phone</span></div>
					<div class="col-8">${user["phone"]}</div>
					<div class="col-4 txt-right"><span class="tag tag-md tag-bold tag-blank">Email</span></div>
					<div class="col-8">${user["email"]}</div>
					<div class="col-4 txt-right"><span class="tag tag-md tag-bold tag-blank">Address</span></div>
					<div class="col-8">${user["address"]}</div>
					<div class="col-4 txt-right"><span class="tag tag-md tag-bold tag-blank">City</span></div>
					<div class="col-8">${user["city"]}</div>
					<div class="col-4 txt-right"><span class="tag tag-md tag-bold tag-blank">Country</span></div>
					<div class="col-8">${user["country"]}</div>
				</div>
			</div>
		</div>
	`;
};

const userStatus = async(id, status) => {
    const entries = new FormData();
    entries.append("action", "updateStatus");
    entries.append("status", status);
    entries.append("id", id);
    const message = { head: "Error Message", text: "", type: "danger", ctrl: "true" };
    const req = await fetch("controllers/users.php", { method: "POST", body: entries });
    const res = await req.json();
    if (res["type"] === "success") message["head"] = "Success Message";
    else message["head"] = "Error Message";
    message["type"] = res["type"];
    message["text"] = res["message"];
    await getUsers();
    alert(message);
};

const editUser = async() => {
    await loadSideBar();
    const ID = await getUrlId();
    const entries = new FormData();
    entries.append("action", "getAll");
    const req = await fetch("controllers/users.php", { method: "POST", body: entries });
    const res = await req.json();
};

const userSearch = (e) => {
    if (XO(".usrcrd").size() === 0) return;
    const boxes = XO("#display").find(".col-4").collection;
    e.target.addEventListener("keyup", () => {
        Array.prototype.forEach.call(boxes, function(el) {
            if (el.textContent.trim().indexOf(e.target.value.trim()) > -1) el.style.display = "";
            else el.style.display = "none";
        });
    });
};

const deleteUser = async(id) => {
    const entries = new FormData();
    entries.append("action", "delete");
    entries.append("id", id);
    const message = { head: "Error Message", text: "", type: "danger", ctrl: "true" };
    const req = await fetch("controllers/users.php", { method: "POST", body: entries });
    const res = await req.json();
    if (res["type"] === "success") message["head"] = "Success Message";
    else message["head"] = "Error Message";
    message["type"] = res["type"];
    message["text"] = res["message"];
    await getUsers();
    alert(message);
};

const getUrlId = () => {
    return location.hash.split("#").slice(-1)[0];
};

const sideBarSystem = () => {
    XO("#sidebar").toggle(500);
};

const setTags = (e) => {
    if (XO(e.target).parent().prev().val().trim() !== "") {
        var tag = XO(e.target).parent().prev().val();
        XO(e.target).parent().prev().val("");
        tag = TAG(tag);
        XO(":pickups").attachElement(tag);
    }
};

const TAG = (tag) => {
    var icon = XO.create("i")
        .addClass("XO-times")
        .push((e) => {
            XO(e.target).parent().parent().detach();
        })
        .index(0);
    icon = XO.create("span")
        .addClass("icon", "icon-md", "icon-danger")
        .css({
            cursor: "pointer",
            "border-top-left-radius": 0,
            "border-bottom-left-radius": 0,
        })
        .attachElement(icon)
        .index(0);
    var span = XO.create("span").addClass("tag", "tag-lg", "tag-bold").text(tag).index(0);
    return XO.create("div").addClass("col-max", "pickup").attachElement(span).attachElement(icon).index(0);
};

const descField = () => {
    let buttons = document.getElementsByClassName("tool-btn");
    for (let btn of buttons) {
        btn.addEventListener("click", () => {
            let cmd = btn.dataset["command"];
            if (cmd === "seturl") {
                setUrl(btn);
            } else if (cmd === "setimg") {
                setImg(btn);
            } else if (cmd === "setsize") {
                setSize(btn);
            } else if (cmd === "setheading") {
                setHeading(btn);
            } else if (cmd === "setFont") {
                setFont(btn);
            } else {
                document.execCommand(cmd, false, null);
            }
        });
    }
};

const setUrl = (btn) => {
    var url = btn.nextElementSibling.value;
    var sText = document.getSelection();
    var res = `<a href="${url}" target="_blank">${sText}</a>`;
    document.execCommand("insertHTML", false, res);
};

const setImg = (btn) => {
    var url = btn.nextElementSibling.value;
    var res = `<img src="${url}"></img>`;
    document.execCommand("insertHTML", false, res);
};

const setSize = (btn) => {
    var size = btn.nextElementSibling.value;
    var sText = document.getSelection();
    var parent = document.getSelection().anchorNode.parentElement;
    var clone = parent.cloneNode(true);
    var granpa = parent.parentNode;
    if (parent.tagName !== "DIV") {
        var Font = document.createElement("font");
        Font.style.fontSize = size + "px";
        console.log(size);
        Font.appendChild(clone);
        granpa.insertBefore(Font, parent);
        parent.remove();
    } else {
        var res = `<font style="font-size:${size}px">${sText}</font>`;
        document.execCommand("insertHTML", false, res);
    }
};

const setHeading = (btn) => {
    var heading = btn.nextElementSibling.value;
    var sText = document.getSelection();
    var res = `<${heading}>${sText}</${heading}>`;
    document.execCommand("insertHTML", false, res);
};

const setFont = (btn) => {
    var font = btn.nextElementSibling.value;
    var sText = document.getSelection();
    var parent = document.getSelection().anchorNode.parentElement;
    var clone = parent.cloneNode(true);
    var granpa = parent.parentNode;
    if (parent.tagName !== "DIV") {
        var Font = document.createElement("font");
        Font.style.fontFamily = font;
        Font.appendChild(clone);
        granpa.insertBefore(Font, parent);
        parent.remove();
    } else {
        var res = `<font style="font-family:${font}">${sText}</font>`;
        document.execCommand("insertHTML", false, res);
    }
};

const setColor = (e) => {
    document.execCommand("foreColor", false, e.target.value);
};

const setBack = (e) => {
    document.execCommand("backColor", false, e.target.value);
};

const setTrips = async(e) => {
    await loadSideBar();
    await descField();
    await inputBlur();
    XO.uploadBox({ selector: ":images", type: "horizontal-fluid" });
};

const validDate = (e) => {
    if (new Date(XO(e.target).val()) > new Date() && XO(e.target).val().trim()) {
        return true;
    } else {
        XO(e.target).css({ border: "1px solid var(--danger_dark)", "background-color": "var(--danger_light)" });
        return false;
    }
};

const descBlur = (e) => {
    const description = XO(e.target).html();
    if (description) {
        XO(e.target).css({ "background-color": "var(--success_light)" }).parent().css({ border: "1px solid var(--success_dark)" });
    } else {
        XO(e.target).css({ "background-color": "var(--danger_light)" }).parent().css({ border: "1px solid var(--danger_dark)" });
        valid = false;
    }
};

const tagBlur = (e) => {
    const pickups = XO(".pickup").size();
    if (pickups) {
        XO(e.target).css({ "background-color": "var(--success_light)" }).css({ border: "1px solid var(--success_dark)" });
    } else {
        XO(e.target).css({ "background-color": "var(--danger_light)" }).css({ border: "1px solid var(--danger_dark)" });
        valid = false;
    }
};

const validTripForm = () => {
    var valid = true;
    const images = XO(":images").val().trim();
    const title = XO(":title").val().trim();
    const description = XO(":description").html();
    const destination = XO(":destination").val().trim();
    const hotel = XO(":hotel").val().trim();
    const price = XO(":price").val().trim();
    const sits = XO(":sits").val();
    const pickups = XO(".pickup").size();
    const date = XO(":date").val();
    const time = XO(":time").val();
    if (images) {
        XO(":images").parent().css({ border: "1px solid var(--success_dark)", "background-color": "var(--success_light)" });
    } else {
        XO(":images").parent().css({ border: "1px solid var(--danger_dark)", "background-color": "var(--danger_light)" });
        valid = false;
    }
    if (title) {
        XO(":title").css({ border: "1px solid var(--success_dark)", "background-color": "var(--success_light)" });
    } else {
        XO(":title").css({ border: "1px solid var(--danger_dark)", "background-color": "var(--danger_light)" });
        valid = false;
    }
    if (description) {
        XO(":description").css({ "background-color": "var(--success_light)" }).parent().css({ border: "1px solid var(--success_dark)" });
    } else {
        XO(":description").css({ "background-color": "var(--danger_light)" }).parent().css({ border: "1px solid var(--danger_dark)" });
        valid = false;
    }
    if (destination) {
        XO(":destination").css({ border: "1px solid var(--success_dark)", "background-color": "var(--success_light)" });
    } else {
        XO(":destination").css({ border: "1px solid var(--danger_dark)", "background-color": "var(--danger_light)" });
        valid = false;
    }
    if (hotel) {
        XO(":hotel").css({ border: "1px solid var(--success_dark)", "background-color": "var(--success_light)" });
    } else {
        XO(":hotel").css({ border: "1px solid var(--danger_dark)", "background-color": "var(--danger_light)" });
        valid = false;
    }
    if (price) {
        XO(":price").css({ border: "1px solid var(--success_dark)", "background-color": "var(--success_light)" });
    } else {
        XO(":price").css({ border: "1px solid var(--danger_dark)", "background-color": "var(--danger_light)" });
        valid = false;
    }
    if (sits) {
        XO(":sits").css({ border: "1px solid var(--success_dark)", "background-color": "var(--success_light)" });
    } else {
        XO(":sits").css({ border: "1px solid var(--danger_dark)", "background-color": "var(--danger_light)" });
        valid = false;
    }
    if (pickups) {
        XO(":tagfield").css({ border: "1px solid var(--success_dark)", "background-color": "var(--success_light)" });
    } else {
        XO(":tagfield").css({ border: "1px solid var(--danger_dark)", "background-color": "var(--danger_light)" });
        valid = false;
    }
    if (date) {
        XO(":date").css({ border: "1px solid var(--success_dark)", "background-color": "var(--success_light)" });
    } else {
        XO(":date").css({ border: "1px solid var(--danger_dark)", "background-color": "var(--danger_light)" });
        valid = false;
    }
    if (time) {
        XO(":time").css({ border: "1px solid var(--success_dark)", "background-color": "var(--success_light)" });
    } else {
        XO(":time").css({ border: "1px solid var(--danger_dark)", "background-color": "var(--danger_light)" });
        valid = false;
    }
    return valid;
};

const createTrips = async(e) => {
    e.preventDefault();
    const message = { head: "Error Message", text: "", type: "danger", ctrl: "true" };
    const entries = new FormData(e.target);
    const valid = validation(e.target);
};

const NODATA = `<div class="col-12 padding-six"><div class="col-12 bg-light"><h1 class="title-one sm-title-four txt-center">No Data Found</h1></div></div>`;

const URLS = {
    "/": { url: "views/home.html", title: "Home | Tripia", def: homeNavBar },
    "/auth/signin/": { url: "views/signin.html", title: "Sign In | Tripia", def: authSignIn },
    "/auth/signup/": { url: "views/signup.html", title: "Sign Up | Tripia", def: authSignUp },
    "/m/profile/": { url: "views/profile.html", title: "Profile | Tripia", def: getprofile },
    "/a/profile/": { url: "views/profile.html", title: "Profile | Tripia", def: getprofile },
    "/a/users/": { url: "views/users.html", title: "Users - List | Tripia", def: getUsers },
    "/a/users/new/": { url: "views/newUser.html", title: "Users - New | Tripia", def: setUsers },
    "/a/users/edit/": { url: "views/editUser.html", title: "Users - Edit | Tripia", def: loadUser },
    "/m/trips/": { url: "views/trips.html", title: "Trips - list | Tripia", def: loadSideBar },
    "/a/trips/": { url: "views/trips.html", title: "Trips - list | Tripia", def: loadSideBar },
    "/a/trips/new/": { url: "views/newTrip.html", title: "Trips - New | Tripia", def: setTrips },
    "/auth/signout/": { url: "views/signin.html", title: "Sign In | Tripia", def: clearSession },
    "/404/": { url: "views/404.html", title: "Not Found | Tripia", def: authNavBar },
};

const FORBIDEN = ["/a/users/", "/a/users/new/", "/a/users/edit/"];

const IDS = ["/a/users/edit/"];

(async() => {
    XO(window).on("load", async() => {
        var url = location.hash.substr(1);
        if (!url) url = "/";
        goTo(url);
    });

    XO(window).on("popstate", async() => {
        var url = location.hash.substr(1);
        if (!url) url = "/";
        goTo(url);
    });
})();