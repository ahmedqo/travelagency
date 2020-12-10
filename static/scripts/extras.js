var IMAGES = [];

const alert = (data) => {
    var box = XO.create("xo-box").attr(data).index(0);
    var wrapper = XO.create("div")
        .addClass("boxWrapper", "col-4", "lg-8", "md-10", "sm-12", "position-fixed", "position-bottom-center", "padding-none")
        .attachElement(box)
        .index(0);
    XO(document.body).attachElement(wrapper);
    setTimeout(() => {
        if (XO(".boxWrapper").size() > 0) XO(wrapper).detach();
    }, 5000);
};

const passToText = (e) => {
    const t = XO(e.target).next();
    if (t.attr("type") === "text") {
        t.attr("type", "password");
    } else {
        t.attr("type", "text");
    }
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

const copyText = (e) => {
    XO(e.target).next().index(0).select();
    alert({ header: "Information", message: "Copied!", type: "success", trigger: "true" });
    document.execCommand("copy");
};

const tagCard = (tag, id) => {
    var stored = "",
        def = "XO(this).parent().parent().parent().detach();";
    if (id) {
        stored = "true";
        def = `deletePickup(this, ${id})`;
    }
    return `
        <div class="col-max pickup position-relative" data-stored="${stored}" style="margin-right:5px">
            <div class="col-12 bg-bold txt-light title-six" style="border-radius:5px;padding-left:10px;padding-right:20px">
                <a class="icon icon-sm icon-rounded icon-danger position-absolute position-right-center" style="margin-right:-5px">
                    <i class="XO-times" onclick="${def}"></i>
                </a>
                ${tag}
            </div>
        </div>
    `;
};

const setTag = (e) => {
    if (XO(e).val().trim() !== "") {
        var tag = XO(e).val();
        XO(e).val("");
        tag = tagCard(tag);
        XO(":pickups").pretach(tag);
        pickupsValidation(":tags", ":pickups");
    }
};

const richText = (btn) => {
    let cmd = btn.dataset["command"];
    let cmds = ["foreColor", "backColor"];
    document.execCommand("styleWithCSS", false, true);
    if (cmds.includes(cmd)) {
        document.execCommand(cmd, false, btn.value);
    } else {
        document.execCommand(cmd, false, null);
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
    var size = btn.value;
    var node = document.getSelection().anchorNode.parentElement;
    if (node.getAttribute("name") === "description") {
        document.execCommand("fontName", false, size);
    } else {
        console.log(node);
        node.style.fontSize = size;
    }
};

const setHeading = (btn) => {
    var head = btn.value;
    var node = document.getSelection().anchorNode.parentElement;
    if (node.getAttribute("name") === "description") {
        document.execCommand("heading", false, "h1");
    } else {
        node.classList.add(head);
    }
};

const setFont = (btn) => {
    var font = btn.value;
    var node = document.getSelection().anchorNode.parentElement;
    if (node.getAttribute("name") === "description") {
        document.execCommand("fontName", false, font);
    } else {
        node.style.fontFamily = font;
    }
};

const delImage = (e, name) => {
    XO(e).parent().parent().parent().detach();
    IMAGES = IMAGES.filter((img) => Object.keys(img)[0] !== name);
};

const imageCard = (file, id) => {
    var image,
        stored = "",
        def = "";
    if (file.name.includes("static/storage/")) {
        image = `<img src="${file.name}" style="max-height:100px;max-width:100%;display:block" />`;
        stored = true;
        def = `deleteImage(this, ${id}, '${file.name}')`;
    } else {
        image = `<img src="${URL.createObjectURL(file)}" style="max-height:100px;max-width:100%;display:block" />`;
        def = `delImage(this,'${file.name}');`;
    }
    const card = `
        <div class="col-max img position-relative" style="margin-top:5px" data-name="${file.name}" data-type="${file.type}" data-stored="${stored}">
            <div class="col-12 bg-bold" style="border-radius:5px">
                <a class="icon icon-sm icon-rounded icon-danger position-absolute position-top-right">
                    <i class="XO-times" onclick="${def}"></i>
                </a>
                ${image}
            </div>
        </div>
    `;
    return card;
};

const loadImages = (e) => {
    for (var i = 0; i < e.length; i++) {
        const obj = {};
        obj[e[i].name] = e[i];
        const img = imageCard(e[i]);
        IMAGES.push(obj);
        XO(":images").pretach(img);
    }
    XO(":image").val("");
};

const hideWizard = (wizards, bubbles) => {
    wizards.forEach((wiz) => {
        wiz.style.display = "none";
    });
    bubbles.forEach((bbl) => {
        bbl.classList.remove("icon-warning");
        bbl.classList.add("icon-bold");
    });
};

const wizard = () => {
    var wizards = document.querySelectorAll(".wizard");
    var bubbles = document.querySelectorAll(".bubble");
    var left = document.querySelector(".left");
    var right = document.querySelector(".right");
    var btn = document.querySelector(".sbt");
    var INDEX = 0;
    hideWizard(wizards, bubbles);
    wizards[INDEX].style.display = "";
    bubbles[INDEX].classList.add("icon-warning");
    bubbles[INDEX].classList.remove("icon-bold");
    left.style.display = "none";
    btn.style.display = "none";
    right.addEventListener("click", () => {
        INDEX++;
        if (INDEX < wizards.length) {
            hideWizard(wizards, bubbles);
            wizards[INDEX].style.display = "";
            bubbles[INDEX].classList.add("icon-warning");
            bubbles[INDEX].classList.remove("icon-bold");
            left.style.display = "";
        }
        if (INDEX === wizards.length - 1) {
            right.style.display = "none";
            btn.style.display = "";
        }
    });
    left.addEventListener("click", () => {
        INDEX--;
        if (INDEX >= 0) {
            hideWizard(wizards, bubbles);
            wizards[INDEX].style.display = "";
            bubbles[INDEX].classList.add("icon-warning");
            bubbles[INDEX].classList.remove("icon-bold");
            right.style.display = "";
            btn.style.display = "none";
        }
        if (INDEX === 0) {
            left.style.display = "none";
        }
    });
};