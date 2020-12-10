const NODATA = `<div class="col-12 padding-six"><div class="col-12 bg-light"><h1 class="title-one sm-title-four txt-center">No Data Found</h1></div></div>`;
const BANS = ["/a/users/", "/a/users/new/", "/a/users/edit/"];
const MARK = ["/a/users/edit/", "/a/trips/edit/", "/a/trips/display/", "/m/trips/display/"];
const URLS = {
    "/": { url: "views/home.html", title: "Accuiel | Pack'n'Go", def: homeNavBar },
    "/auth/signin/": { url: "views/signin.html", title: "Authentification | Pack'n'Go", def: authNavBar },
    "/auth/signup/": { url: "views/signup.html", title: "Inscription | Pack'n'Go", def: signUp },
    "/m/profile/": { url: "views/profile.html", title: "Profile | Pack'n'Go", def: loadProfile },
    "/a/profile/": { url: "views/profile.html", title: "Profile | Pack'n'Go", def: loadProfile },
    "/a/users/": { url: "views/users.html", title: "Utilisateurs - Liste | Pack'n'Go", def: getUsers },
    "/a/users/new/": { url: "views/newUser.html", title: "Utilisateurs - Nouveau | Pack'n'Go", def: setUser },
    "/a/users/edit/": { url: "views/editUser.html", title: "Utilisateurs - Editer | Pack'n'Go", def: loadUser },
    "/a/trips/": { url: "views/trips.html", title: "Voyages - Liste | Pack'n'Go", def: getTrips },
    "/m/trips/": { url: "views/trips.html", title: "Voyages - Liste | Pack'n'Go", def: loadTrips },
    "/a/trips/new/": { url: "views/newTrip.html", title: "Voyages - Nouveau | Pack'n'Go", def: setTrip },
    "/a/trips/edit/": { url: "views/editTrip.html", title: "Voyages - Editer | Pack'n'Go", def: loadTrip },
    "/a/trips/display/": { url: "views/displayTrip.html", title: "Voyages - Afficher | Pack'n'Go", def: displayTrip },
    "/m/trips/display/": { url: "views/displayTrip.html", title: "Voyages - Afficher | Pack'n'Go", def: displayTrip },
    "/a/reservations/": { url: "views/reservations.html", title: "Reservations - Liste | Pack'n'Go", def: loadReservations },
    "/m/reservations/": { url: "views/reservations.html", title: "Reservations - Liste | Pack'n'Go", def: loadReservation },
    "/auth/signout/": { url: "views/signin.html", title: "Authentification | Pack'n'Go", def: clearSession },
    "/404/": { url: "views/404.html", title: "Page Introuvable | Pack'n'Go", def: authNavBar },
};

const getUrlId = () => location.hash.split("#").slice(-1)[0];

const goTo = async(url) => {
    XO("#root").html("<div class='loading'></div>");
    lnk = url.split("#");
    if (!Object.keys(URLS).includes(lnk[0])) {
        goTo("/404/");
        return false;
    }
    if (MARK.includes(lnk[0]) && lnk[1] === undefined) {
        goTo("/404/");
        return false;
    }
    if (!MARK.includes(lnk[0]) && lnk[1] !== undefined) {
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