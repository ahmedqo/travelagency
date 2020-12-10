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
};

const createUser = async(e) => {
    e.preventDefault();
    XO(".vldbtn").addClass("btn-disabled").attr("disabled", "true");
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    const valid = createUserValidation(e.target);
    if (!valid[0]) {
        message["message"] = valid[1];
        alert(message);
    } else {
        const entries = new FormData(e.target);
        entries.append("action", "create");
        const req = await fetch("controllers/users.php", { method: "POST", body: entries });
        const res = await req.json();
        if (res["type"] === "success") {
            message["header"] = "Success Message";
            e.target.reset();
            XO("input").css({ "border-color": "", "background-color": "", "background-color": "" });
        } else {
            message["header"] = "Error Message";
        }
        message["type"] = res["type"];
        message["message"] = res["message"];
        alert(message);
    }
    XO(".vldbtn").removeClass("btn-disabled").removeAttr("disabled");
};

const loginUser = async(e) => {
    e.preventDefault();
    XO(".vldbtn").addClass("btn-disabled").attr("disabled", "true");
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    if (!formValidation(e.target)[0]) {
        message["message"] = formValidation(e.target)[1];
        alert(message);
    } else {
        const entries = new FormData(e.target);
        entries.append("action", "login");
        const req = await fetch("controllers/users.php", { method: "POST", body: entries });
        const res = await req.json();
        if (res["type"] === "success") message["header"] = "Success Message";
        else message["header"] = "Error Message";

        message["type"] = res["type"];
        message["message"] = res["message"];
        alert(message);
        if (res.status === 200) {
            const valid = await getSession();
            if (valid["type"] !== "-1") goTo("/a/profile/");
            else goTo("/m/profile/");
        }
    }
    XO(".vldbtn").removeClass("btn-disabled").removeAttr("disabled");
};

const updateUser = async(e) => {
    e.preventDefault();
    XO(".vldbtn").addClass("btn-disabled").attr("disabled", "true");
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    if (!formValidation(e.target)[0]) {
        message["message"] = formValidation(e.target)[1];
        alert(message);
    } else {
        const entries = new FormData(e.target);
        entries.append("action", "update");
        const req = await fetch("controllers/users.php", { method: "POST", body: entries });
        const res = await req.json();
        if (res["type"] === "success") {
            message["header"] = "Success Message";
            XO("input").css({ "border-color": "", "background-color": "", "background-color": "" });
        } else {
            message["header"] = "Error Message";
        }
        message["type"] = res["type"];
        message["message"] = res["message"];
        alert(message);
    }
    XO(".vldbtn").removeClass("btn-disabled").removeAttr("disabled");
};

const updatePassword = async(e) => {
    e.preventDefault();
    XO(".vldbtn").addClass("btn-disabled").attr("disabled", "true");
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    if (!formValidation(e.target)[0]) {
        message["message"] = formValidation(e.target)[1];
        alert(message);
    } else {
        const entries = new FormData(e.target);
        entries.append("action", "updatePassword");
        const req = await fetch("controllers/users.php", { method: "POST", body: entries });
        const res = await req.json();
        if (res["type"] === "success") {
            message["header"] = "Success Message";
            e.target.reset();
            XO("input").css({ "border-color": "", "background-color": "", "background-color": "" });
        } else {
            message["header"] = "Error Message";
        }
        message["type"] = res["type"];
        message["message"] = res["message"];
        alert(message);
    }
    XO(".vldbtn").removeClass("btn-disabled").removeAttr("disabled");
};

const deleteUser = async(id) => {
    const entries = new FormData();
    entries.append("action", "delete");
    entries.append("id", id);
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    const req = await fetch("controllers/users.php", { method: "POST", body: entries });
    const res = await req.json();
    if (res["type"] === "success") message["header"] = "Success Message";
    else message["header"] = "Error Message";
    message["type"] = res["type"];
    message["message"] = res["message"];
    await getUsers();
    alert(message);
};

const userStatus = async(id, status) => {
    const entries = new FormData();
    entries.append("action", "updateStatus");
    entries.append("status", status);
    entries.append("id", id);
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    const req = await fetch("controllers/users.php", { method: "POST", body: entries });
    const res = await req.json();
    if (res["type"] === "success") message["header"] = "Success Message";
    else message["header"] = "Error Message";
    message["type"] = res["type"];
    message["message"] = res["message"];
    await getUsers();
    alert(message);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    goTo("/auth/signin/");
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loadProfile = async() => {
    await loadSideBar();
    var ID = await getSession();
    ID = ID["id"];
    await getUser(ID);
};

const loadUser = async() => {
    await loadSideBar();
    var ID = await getUrlId();
    await getUser(ID);
};

const setUser = async() => {
    await loadSideBar();
    const pass = randPass();
    XO(":username").val(pass);
    XO(":password").val(pass);
};

const userSearch = (e) => {
    if (XO(".usrcrd").size() === 0) return;
    const boxes = XO("#display").find(".usrcrd").collection;
    e.target.addEventListener("keyup", () => {
        Array.prototype.forEach.call(boxes, function(el) {
            if (el.textContent.trim().toLowerCase().indexOf(e.target.value.trim().toLowerCase()) > -1) el.style.display = "";
            else el.style.display = "none";
        });
    });
};

const userCard = (user) => {
    const colors = [
        "#DBE095",
        "#50424B",
        "#45E3FF",
        "#E096B8",
        "#B1CD30",
        "#6A013F",
        "#1BB09C",
        "#361FED",
        "#FE8D85",
        "#6355D1",
        "#7E8DBB",
        "#F3A737",
        "#0E798C",
        "#58A003",
        "#D605E4",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const first = user["username"][0].toUpperCase();
    var status, type;
    if (user["type"] === "1") type = "Super Admin";
    else if (user["type"] === "0") type = "Admin";
    else type = "User";
    if (parseInt(user["status"]))
        status = `<a onclick="userStatus(${user["id"]}, 0)" class="icon icon-md icon-rounded icon-danger"><i class="XO-ban"></i></a>`;
    else status = `<a onclick="userStatus(${user["id"]}, 1)" class="icon icon-md icon-rounded icon-success"><i class="XO-check"></i></a>`;
    return `
        <div class="usrcrd col-3 lg-4 md-6 sm-12 padding-six sm-padding-none padding-bottom-five md-padding-bottom-five sm-padding-bottom-five">
            <div class="block col-12 justify-content-center align-items-center bg-light position-relative padding-bottom-five">
                <div class="col-max">
                    <div class="block txt-light justify-content-center align-items-center" style="width: 60px; height: 60px; border-radius: 50%; background-color: ${color}">
                        <span style="font-size: 2rem; font-weight: bolder">${first}</span>
                    </div>
                </div>
                <div class="col txt-center">
                    <div class="title-three">${user["username"]}</div>
                    <div class="subtitle-five">${type}</div>
                </div>
                <div class="col-max position-absolute position-bottom-center" style="margin-bottom: -22px;">
                    <a onclick="goTo('/a/users/edit/#${user["id"]}')" class="icon icon-md icon-rounded icon-warning"><i class="XO-edit"></i></a>
                    ${status}
                    <a onclick="deleteUser(${user["id"]})" class="icon icon-md icon-rounded icon-bold"><i class="XO-trash"></i></a>
                </div>
            </div>
            <div class="col-12 hidden md-visible sm-visible"></div>
        </div>
	`;
};