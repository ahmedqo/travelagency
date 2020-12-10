const loadNavBar = async() => {
    const req = await fetch("views/navbar.html");
    const res = await req.text();
    XO("#menu").html(res);

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
    navSystem();
};

const loadAccordion = () => {
    XO.accordion(".accordion");
    XO.slider(".slider", 3000);
};

const loadSideBar = async() => {
    const valid = await getSession();
    if (!valid) {
        goTo("/auth/signin/");
        return false;
    }
    if (valid["type"] !== "1" && BANS.includes(location.hash.substr(1))) {
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
    sideSystem();
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
    sideSystem();
};

const changeNavBar = async() => {
    const valid = await getSession();
    if (valid) {
        let url = "/profile/";
        if (valid["type"] !== "-1") url = "/a" + url;
        else url = "/a" + url;
        const link = document.createElement("a");
        XO(link).attr("data-url", url).addClass("menu-item").text("Compte");
        XO(".nav-menu").html("").attachElement(link);
        XO(link).push(async() => {
            goTo(url);
        });
    }
};

const homeNavBar = async() => {
    await loadNavBar();
    await galleriesTrips();
    await gridTrips();
    XO(".nav")
        .addClass("homenav")
        .css({ "background-color": "transparent" })
        .parent()
        .parent()
        .addClass("position-absolute", "position-top-left")
        .removeClass("bg-bold");
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
                    .addClass("bg-bold");
                XO(".nav-container").css({ "background-color": "" });
                XO(".nav-menu").css({ "background-color": "" });
            } else {
                XO(".homenav")
                    .css({ "background-color": "transparent" })
                    .parent()
                    .parent()
                    .css({ "z-index": 100 })
                    .addClass("position-fixed", "position-top-left")
                    .removeClass("bg-bold", "position-absolute");
                XO(".nav-container").css({ "background-color": "transparent" });
                XO(".nav-menu").css({ "background-color": "transparent" });
            }
        }
    });
    setTimeout(() => {
        loadAccordion();
    }, 100);
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

const navSystem = () => {
    const w = window.innerWidth;
    if (w > 770) {
        XO(".nav-menu").slideDown(100);
    } else {
        XO(".nav-menu").slideUp(100);
    }
    XO(window).on("resize", () => {
        const w = window.innerWidth;
        if (w > 770) {
            XO(".nav-menu").slideDown(100);
        } else {
            XO(".nav-menu").slideUp(100);
        }
    });
};

const sideSystem = () => {
    const w = window.innerWidth;
    if (w > 770) {
        XO("#sidebar").show(50);
    } else {
        XO("#sidebar").hide(50);
    }
    XO(window).on("resize", () => {
        const w = window.innerWidth;
        if (w > 770) {
            XO("#sidebar").show(50);
        } else {
            XO("#sidebar").hide(50);
        }
    });
};

const sideBarSystem = () => {
    XO("#sidebar").toggle(50);
};

const signUp = async() => {
    await authNavBar();
    await wizard();
};