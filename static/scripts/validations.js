const formValidation = (form) => {
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
                "border-color": "var(--danger_dark)",
                "background-color": "var(--danger_light)",
            });
        } else {
            valid.push(true);
            XO(child).css({
                "border-color": "var(--success_dark)",
                "background-color": "var(--success_light)",
            });
        }
    });
    if (valid.includes(false)) return [false, "All Fields Required."];
    else return [true];
};

const phoneValidation = (e) => {
    fieldValidation(e);
    if (!XO(e).valid("phone")) {
        XO(e).css({
            "border-color": "var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "Phone number Not valid."];
    }
    return [true];
};

const emailValidation = (e) => {
    fieldValidation(e);
    if (!XO(e).valid("email")) {
        XO(e).css({
            "border-color": "var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "Email Not valid."];
    }
    return [true];
};

const passwordValidation = (e) => {
    fieldValidation(e);
    if (!XO(e).valid("lower", "upper", "numeric")) {
        XO(e).css({
            "border-color": "var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "Password Must Contain (uppercase letters, lowercase letters and numbers)."];
    }
    return [true];
};

const compareValidation = (e, s) => {
    fieldValidation(e);
    if (XO(e).val() !== XO(s).val()) {
        XO(e).css({
            "border-color": "var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "Passwords Do Not Match."];
    }
    return [true];
};

const imagesValidation = (e, s) => {
    if (!XO(s).html().trim()) {
        XO(e).css({
            "border-color": "var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "All Fields Required."];
    }
    XO(e).css({
        "border-color": "var(--success_dark)",
        "background-color": "var(--success_light)",
    });
    return [true];
};

const descriptionValidation = (e) => {
    if (!XO(e).html()) {
        XO(e).css({
            "border-color": "var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "All Fields Required."];
    }
    XO(e).css({
        "border-color": "var(--success_dark)",
        "background-color": "var(--success_light)",
    });
    return [true];
};

const pickupsValidation = (e, s) => {
    if (!XO(s).html()) {
        XO(e).css({
            "border-color": "var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "All Fields Required."];
    }
    XO(e).css({
        "border-color": "var(--success_dark)",
        "background-color": "var(--success_light)",
    });
    return [true];
};

const dateValidation = (e) => {
    const valid = fieldValidation(e);
    if (!valid[0]) return valid;
    if (new Date(XO(e).val()) < new Date()) {
        XO(e).css({
            "border-color": "var(--danger_dark)",
            "background-color": "var(--danger_light)",
        });
        return [false, "Date Is Out Of Date."];
    }
    XO(e).css({
        "border-color": "var(--success_dark)",
        "background-color": "var(--success_light)",
    });
    return [true];
};

const fieldValidation = (...fields) => {
    var valid = true;
    fields.forEach((field) => {
        if (!XO(field).val().trim()) {
            XO(field).css({
                "border-color": "var(--danger_dark)",
                "background-color": "var(--danger_light)",
            });
            valid = false;
        } else {
            XO(field).css({
                "border-color": "var(--success_dark)",
                "background-color": "var(--success_light)",
            });
        }
    });
    if (valid) return [true];
    else return [false, "All Fields Required."];
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const createUserValidation = (e) => {
    const form = formValidation(e);
    const phone = phoneValidation(":phone");
    const email = emailValidation(":email");
    const pass = passwordValidation(":password");
    const compare = compareValidation(":confirmPassword", ":password");
    if (!form[0]) return form;
    if (!phone[0]) return phone;
    if (!email[0]) return email;
    if (!pass[0]) return pass;
    if (!compare[0]) return compare;
    return [true];
};

const createTripValidation = () => {
    var fields = fieldValidation(":title", ":destination", ":hotel", ":price", ":sits", ":date", ":time");
    var images = imagesValidation(":image", ":images");
    var description = descriptionValidation(":description");
    var pickups = pickupsValidation(":tags", ":pickups");
    if (!fields[0]) return fields;
    if (!images[0]) return images;
    if (!description[0]) return description;
    if (!pickups[0]) return pickups;
    return [true];
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////