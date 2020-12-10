const getTrips = async(status) => {
    await loadSideBar();
    const entries = new FormData();
    entries.append("action", "getAll");
    const req = await fetch("controllers/trips.php", { method: "POST", body: entries });
    var res = await req.json();
    XO("#display").html("");
    if (res.length === 0) {
        XO("#display").html(NODATA);
    }
    if (location.hash.includes("/m/")) {
        res = res.filter((r) => {
            if (new Date() < new Date(r["date"])) return r;
        });
    }
    res.forEach((r) => {
        var trip;
        if (location.hash.includes("/a/")) {
            trip = tripCard(r, false);
        } else {
            trip = tripCard(r, true);
            XO(".usrtrp").detach();
        }
        if (typeof status !== "undefined") {
            if (r["status"] === status) {
                XO("#display").attach(trip);
            }
        } else {
            XO("#display").attach(trip);
        }
    });
    setTimeout(() => {
        XO.slider(".slider", 3000);
        XO(".slider-controll").detach();
    }, 10);
};

const getTrip = async(id) => {
    const entries = new FormData();
    entries.append("action", "get");
    entries.append("id", id);
    const req = await fetch("controllers/trips.php", { method: "POST", body: entries });
    const res = await req.json();
    return res;
};

const createTrip = async(e) => {
    e.preventDefault();
    XO(".vldbtn").addClass("btn-disabled").attr("disabled", "true");
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    const valid = createTripValidation();
    if (!valid[0]) {
        message["message"] = valid[1];
        alert(message);
    } else {
        const entries = new FormData(e.target);
        entries.append("action", "create");
        entries.append("description", XO(":description").html());
        XO(IMAGES).each((img) => {
            const key = Object.keys(img)[0];
            entries.append("images[]", img[key]);
        });
        XO(".pickup").each((pick) => {
            entries.append("pickups[]", XO(pick).text());
        });
        const req = await fetch("controllers/trips.php", { method: "POST", body: entries });
        const res = await req.json();
        if (res["type"] === "success") {
            message["header"] = "Success Message";
            e.target.reset();
            XO("input").css({ "border-color": "", "background-color": "", "background-color": "" });
            XO(":description").html("").css({ "border-color": "", "background-color": "", "background-color": "" });
            XO(":images").html("");
            XO(":pickups").html("");
            IMAGES = [];
        } else {
            message["header"] = "Error Message";
        }
        message["type"] = res["type"];
        message["message"] = res["message"];
        alert(message);
    }
    XO(".vldbtn").removeClass("btn-disabled").removeAttr("disabled");
};

const updateTrip = async(e) => {
    e.preventDefault();
    XO(".vldbtn").addClass("btn-disabled").attr("disabled", "true");
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    const valid = createTripValidation();
    if (!valid[0]) {
        message["message"] = valid[1];
        alert(message);
    } else {
        const entries = new FormData(e.target);
        entries.append("action", "update");
        entries.append("description", XO(":description").html());
        if (IMAGES.length > 0) {
            XO(IMAGES).each((img) => {
                const key = Object.keys(img)[0];
                entries.append("images[]", img[key]);
            });
        }
        XO(".pickup").each((pick) => {
            if (!XO(pick).hasAttr("data-stored")) {
                entries.append("pickups[]", XO(pick).text());
            }
        });
        const req = await fetch("controllers/trips.php", { method: "POST", body: entries });
        const res = await req.json();
        if (res["type"] === "success") {
            message["header"] = "Success Message";
            XO("input").css({ "border-color": "", "background-color": "", "background-color": "" });
            XO(":description").css({ "border-color": "", "background-color": "", "background-color": "" });
            IMAGES = [];
        } else {
            message["header"] = "Error Message";
        }
        message["type"] = res["type"];
        message["message"] = res["message"];
        alert(message);
        await deleteImages();
        await statusTrip();
    }
    XO(".vldbtn").removeClass("btn-disabled").removeAttr("disabled");
};

const deleteTrip = async(id) => {
    const entries = new FormData();
    entries.append("action", "delete");
    entries.append("id", id);
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    const req = await fetch("controllers/trips.php", { method: "POST", body: entries });
    const res = await req.json();
    if (res["type"] === "success") message["header"] = "Success Message";
    else message["header"] = "Error Message";
    message["type"] = res["type"];
    message["message"] = res["message"];
    await getTrips();
    alert(message);
};

const statusTrip = async() => {
    const entries = new FormData();
    entries.append("action", "status");
    const req = await fetch("controllers/trips.php", { method: "POST", body: entries });
};

const deleteImages = async() => {
    const entries = new FormData();
    entries.append("action", "deleteAll");
    await fetch("controllers/galleries.php", { method: "POST", body: entries });
};

const deleteImage = async(e, id, name) => {
    const entries = new FormData();
    entries.append("action", "delete");
    entries.append("id", id);
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    const req = await fetch("controllers/galleries.php", { method: "POST", body: entries });
    const res = await req.json();
    if (res["type"] === "success") {
        message["header"] = "Success Message";
        delImage(e, name);
    } else {
        message["header"] = "Error Message";
    }
    message["type"] = res["type"];
    message["message"] = res["message"];
    alert(message);
};

const deletePickup = async(e, id) => {
    const entries = new FormData();
    entries.append("action", "delete");
    entries.append("id", id);
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    const req = await fetch("controllers/pickups.php", { method: "POST", body: entries });
    const res = await req.json();
    if (res["type"] === "success") {
        message["header"] = "Success Message";
        XO(e).parent().parent().parent().detach();
    } else {
        message["header"] = "Error Message";
    }
    message["type"] = res["type"];
    message["message"] = res["message"];
    alert(message);
};

const galleriesTrips = async() => {
    const entries = new FormData();
    entries.append("action", "getAll");
    const req = await fetch("controllers/trips.php", { method: "POST", body: entries });
    var res = await req.json();
    var images = "",
        dots = "<a class='arrow prev'>&#10094;</a>";
    res = res.filter((t) => new Date() <= new Date(t["date"]));
    res.forEach((t) => {
        images += `
                <div class="slider-slide">
                    <img src="static/storage/${t["images"][t["images"].length - 1]["image"]}" alt="" />
                </div>
            `;
        dots += "<span class='dot'></span>";
    });
    dots += " <a class='arrow next'>&#10095;</a>";
    XO(".slider").pretach(images);
    XO(".slider-controll").attach(dots);
};

const gridTrips = async() => {
    const entries = new FormData();
    entries.append("action", "getAll");
    const req = await fetch("controllers/trips.php", { method: "POST", body: entries });
    var res = await req.json();
    res = res.filter((t) => new Date() <= new Date(t["date"]));
    res = res.slice(0, 6);
    res.forEach((t) => {
        const l = "/m/trips/display/#" + t["id"];
        const s = `
                <div class="col-4 md-6 sm-12" onclick="goTo('${l}')">
                    <div class="col-12 position-relative" style="height: 100%;">
                        <img src="static/assets/new.png" width="120" class="position-absolute position-top-left">
                        <div class="bg-light">
                            <img src="static/storage/${t["images"][0]["image"]}" style="width: 100%; height: 260px; object-fit: cover;" />
                            <h1 class="title-five txt-center">${t["title"]}</h1>
                        </div>
                    </div>
                </div>
            `;
        XO(":cards").attach(s);
    });
    var link = "";
    var ses = await getSession();
    if (!ses) {
        link = `<a onclick="goTo('/auth/signin/')" class="icon icon-lg icon-rounded icon-bold">
            <i class="XO-more"></i>
        </a>`;
    } else if (ses["type"] !== "-1") {
        link = `<a onclick="goTo('/a/trips/')" class="icon icon-lg icon-rounded icon-bold">
            <i class="XO-more"></i>
        </a>`;
    } else {
        link = `<a onclick="goTo('/m/trips/')" class="icon icon-lg icon-rounded icon-bold">
            <i class="XO-more"></i>
        </a>`;
    }
    XO(":cards").attach("<div class='col-12 txt-center'>" + link + "</div>");
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const setTrip = async() => {
    await loadSideBar();
    IMAGES = [];
};

const loadTrip = async() => {
    await loadSideBar();
    var ID = await getUrlId();
    const res = await getTrip(ID);
    XO(":id").val(res["id"]);
    XO(":title").val(res["title"]);
    XO(":description").html(res["description"]);
    XO(":destination").val(res["destination"]);
    XO(":hotel").val(res["hotel"]);
    XO(":price").val(res["price"]);
    XO(":sits").val(res["sits"]);
    XO(":date").val(res["date"]);
    XO(":time").val(res["time"]);
    res["pickups"].forEach((pickup) => {
        const tag = tagCard(pickup["location"], pickup["id"]);
        XO(":pickups").attach(tag);
    });
    res["images"].forEach((image) => {
        const file = new File([], "static/storage/" + image["image"], { type: "image/" + image["image"].split(".")[1] });
        const img = imageCard(file, image["id"]);
        XO(":images").attach(img);
    });
};

const loadTrips = async() => {
    await getTrips("1");
};

const displayTrip = async() => {
    await loadSideBar();
    var ID = await getUrlId();
    const res = await getTrip(ID);
    var images = "",
        dots = "<a class='arrow prev'>&#10094;</a>";
    res["images"].forEach((img) => {
        images += `
            <div class="slider-slide">
                <img src="static/storage/${img["image"]}" alt="" />
            </div>
        `;
        dots += "<span class='dot'></span>";
    });
    dots += " <a class='arrow next'>&#10095;</a>";
    XO(".slider").pretach(images);
    XO(".slider-controll").html("").attach(dots);
    XO(":title").text(res["title"]);
    XO(":destination").text(res["destination"]);
    XO(":hotel").text(res["hotel"]);
    XO(":price").text(res["price"] + " DH");
    XO(":sits").text(res["reserved"] + " / " + res["sits"]);
    XO(":date").text(res["date"]);
    var time = res["time"];
    time = time.split(":");
    time = (time[0] >= 12 && (time[0] - 12 || 12) + ":" + time[1] + " PM") || (Number(time[0]) || 12) + ":" + time[1] + " AM";
    XO(":time").html(time);
    XO(":desc").html(res["description"]);
    XO(":trip").val(res["id"]);
    res["pickups"].forEach((pick) => {
        const pk = `<option value="${pick["id"]}">${pick["location"]}</option>`;
        XO(":pickups").pretach(pk);
    });
    const ses = await getSession();
    setTimeout(() => {
        XO.slider(".slider", 5000);
        if (ses["type"] !== "-1") XO(".resadm").detach();
    }, 50);
};

const tripSearch = (e) => {
    if (XO(".trpcrd").size() === 0) return;
    const boxes = XO("#display").find(".trpcrd").collection;
    e.target.addEventListener("keyup", () => {
        Array.prototype.forEach.call(boxes, function(el) {
            if (el.textContent.trim().toLowerCase().indexOf(e.target.value.trim().toLowerCase()) > -1) el.style.display = "";
            else el.style.display = "none";
        });
    });
};

const tripCard = (trip, usr) => {
    var slides = "",
        dots = "",
        links = "";
    trip["images"].forEach((image) => {
        slides += `
            <div class="slider-slide">
                <img src="static/storage/${image["image"]}" alt="" />
            </div>
        `;
        dots += `
            <span class="dot"></span>
        `;
    });
    if (usr) {
        links = `
            <a onclick="goTo('/m/trips/display/#${trip["id"]}')" class="icon icon-md icon-rounded icon-bold">
                <i class="XO-eye"></i>
            </a>
        `;
    } else {
        links = `
            <a onclick="goTo('/a/trips/display/#${trip["id"]}')" class="icon icon-md icon-rounded icon-bold">
                <i class="XO-eye"></i>
            </a>
            <a onclick="goTo('/a/trips/edit/#${trip["id"]}')" class="icon icon-md icon-rounded icon-warning">
                <i class="XO-edit"></i>
            </a>
            <a onclick="deleteTrip(${trip["id"]})" class="icon icon-md icon-rounded icon-danger">
                <i class="XO-trash"></i>
            </a>
        `;
    }
    var time = trip["time"];
    time = time.split(":"); // here the time is like "16:14"
    time = (time[0] >= 12 && (time[0] - 12 || 12) + ":" + time[1] + " PM") || (Number(time[0]) || 12) + ":" + time[1] + " AM";
    return `
        <div class="trpcrd col-4 lg-6 md-6 sm-12 padding-six sm-padding-none">
            <div class="slider horizontal-fluid" style="height: 260px;">
                ${slides}
                <div class="slider-controll">
                    <a class="arrow prev">&#10094;</a>
                    ${dots}
                    <a class="arrow next">&#10095;</a>
                </div>
            </div>
            <div class="block col-12 bg-light align-items-center">
                <div class="col-12 title-five padding-vertical-none">${trip["title"]}</div>
                <div class="col-12 padding-top-none">
                    <span class="padding-none tag tag-sm tag-primary" style="padding: 0 5px !important">
                        ${trip["destination"]}
                    </span>
                    <span class="padding-none tag tag-sm tag-secondary" style="padding: 0 5px !important">
                        ${trip["reserved"]} / ${trip["sits"]} Sits
                    </span>
                    <span class="padding-none tag tag-sm tag-bold" style="padding: 0 5px !important">
                        ${trip["date"]}
                    </span>
                    <span class="padding-none tag tag-sm tag-info" style="padding: 0 5px !important">
                        ${time}
                    </span>
                </div>
                <div class="col">
                    <span class="tag tag-md tag-success tag-hollow">
                        ${trip["price"]} DH
                    </span>
                </div>
                <div class="col-max">
                   ${links}
                </div>
            </div>
            <div class="col-12 hidden md-visible sm-visible"></div>
        </div>
    `;
};