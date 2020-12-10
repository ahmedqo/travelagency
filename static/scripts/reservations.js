const getResrevations = async() => {
    const entries = new FormData();
    entries.append("action", "getAll");
    const req = await fetch("controllers/reservations.php", { method: "POST", body: entries });
    const res = await req.json();
    XO("#display").html("");
    if (res.length === 0) {
        XO("#display").html(`
            <tr>
                <td colspan="7">${NODATA}</td>
            </tr>
        `);
    }
    res.forEach((r) => {
        const row = reservationCard(r, true);
        XO("#display").attach(row);
    });
};

const getResrevation = async() => {
    const entries = new FormData();
    entries.append("action", "get");
    const req = await fetch("controllers/reservations.php", { method: "POST", body: entries });
    const res = await req.json();
    XO(".usrrsv").detach();
    XO("#display").html("");
    if (res.length === 0) {
        XO("#display").html(`
            <tr>
                <td colspan="6">${NODATA}</td>
            </tr>
        `);
    }
    res.forEach((r) => {
        const row = reservationCard(r, false);
        XO("#display").attach(row);
    });
};

const createReservation = async(e) => {
    e.preventDefault();
    XO(".vldbtn").addClass("btn-disabled").attr("disabled", "true");
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    const valid = fieldValidation(":pickups", ":sit");
    if (!valid[0]) {
        message["message"] = valid[1];
        alert(message);
    } else {
        const entries = new FormData(e.target);
        entries.append("action", "create");
        const req = await fetch("controllers/reservations.php", { method: "POST", body: entries });
        const res = await req.json();
        if (res["type"] === "success") {
            message["header"] = "Success Message";
            XO(":sit").css({ "background-color": "", "border-color": "" }).val("");
            XO(":pickups").css({ "background-color": "", "border-color": "" });
        } else {
            message["header"] = "Error Message";
        }
        message["type"] = res["type"];
        message["message"] = res["message"];
        alert(message);
    }
    XO(".vldbtn").removeClass("btn-disabled").removeAttr("disabled");
};

const deleteReservation = async(id, trip, sits, usr) => {
    const message = { header: "Error Message", message: "", type: "danger", trigger: "true" };
    const entries = new FormData();
    entries.append("action", "delete");
    entries.append("id", id);
    entries.append("trip", trip);
    entries.append("sits", sits);
    const req = await fetch("controllers/reservations.php", { method: "POST", body: entries });
    const res = await req.json();
    if (res["type"] === "success") message["header"] = "Success Message";
    else message["header"] = "Error Message";
    message["type"] = res["type"];
    message["message"] = res["message"];
    console.log(usr);
    if (usr) getResrevations();
    else getResrevation();
    alert(message);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loadReservations = async() => {
    await loadSideBar();
    await getResrevations();
};

const loadReservation = async() => {
    await loadSideBar();
    await getResrevation();
};

const reservationSearch = (e) => {
    if (XO("tr").size() === 0) return;
    const boxes = XO("#display").find("tr").collection;
    e.target.addEventListener("keyup", () => {
        Array.prototype.forEach.call(boxes, function(el) {
            if (el.textContent.trim().toLowerCase().indexOf(e.target.value.trim().toLowerCase()) > -1) el.style.display = "";
            else el.style.display = "none";
        });
    });
};

const reservationCard = (row, usr) => {
    const price = parseFloat(row["sits"]) * parseFloat(row["price"]);
    var s, cnl;
    if (usr) {
        usr = `<td data-title="Client">${row["username"]}</td>`;
        s = true;
    } else {
        usr = "";
        s = false;
    }
    if (new Date() < new Date(row["tripdate"])) {
        cnl = `<a style="color:blue;text-decoration:underline" onclick="deleteReservation(${row["id"]},${row["trip"]},${row["sits"]},${s})">Cancel</a>`;
    } else {
        cnl = "<span style='text-decoration:underline'>None</span>";
    }
    return `
        <tr>
            ${usr}
            <td data-title="Trip">${row["title"]}</td>
            <td data-title="Pickup">${row["location"]}</td>
            <td data-title="Sits">${row["sits"]}</td>
            <td data-title="Price">${price} DH</td>
            <td data-title="Date">${row["date"]}</td>
            <td data-title="Action">
                ${cnl}
            </td>
        </tr>
    `;
};