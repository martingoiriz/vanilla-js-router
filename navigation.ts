import { Injectable } from "@angular/core";
import { BusManagerService } from "../bus";

@Injectable({
  providedIn: "root"
})
export class NavigationService {
  constructor(private busManager: BusManagerService) {
    this.init();
  }

  init() {
    if (!window["popListener"]) {
      window["popListener"] = true;
      window.addEventListener("popstate", e => {
        this.navigationListener();
      });
    }
  }

  navigationListener() {
    if (window["actionHistory"]) {
      window["actionHistory"] = false;
    } else {
      if (window["navHistory"] < 1) {
        return;
      }

      // PAGINA DE LA QUE VENIS O A LA QUE VAS
      let page = window["navHistory"].find(x => x.current === true);
      let pageIndex = window["navHistory"].findIndex(x => x.current === true);

      // PAGINA ACTUAL
      let hashArray = window.location.hash.split("/");
      var currentRoute = hashArray[hashArray.length - 1];
      var currentRouteIndex = window["navHistory"].findIndex(
        x => x.page === currentRoute
      );

      for (let e of window["navHistory"]) {
        e.current = false;
      }

      if (currentRoute === "login-mf") {
        // reload o estrategia de reset
        window.location.reload();
      } else if (
        window["navHistory"][currentRouteIndex] &&
        page.count > window["navHistory"][currentRouteIndex].count
      ) {
        if (page.state !== "root") {
          window["navHistory"].pop();
          window["navHistory"][currentRouteIndex].current = true;
        } else window.location.reload();
        console.log("atras");
        //  if (page.count <= window['navHistory'][currentRouteIndex].count)
      } else {
        window["navHistory"].push({
          page: currentRoute,
          state: "child",
          count: window["navHistory"][pageIndex].count + 1,
          current: true
        });
        console.log("adelante");
      }

      console.log(currentRoute, page.page);
    }

    this.canGoBack();
    console.log("NAV state: ", window["navHistory"]);
  }

  push(page: string, isSubRoot?: boolean) {
    // Prevent default para el listener del popstate
    window["actionHistory"] = true;
    let i = this.getCurrentPageIndex();

    // Nuevo registro para el historial custom
    let newRegistry = {
      page: page,
      state: "child",
      count: window["navHistory"][i].count + 1,
      current: true
    };

    window["navHistory"].push(newRegistry);
    window["navHistory"][i].current = false;
    window.location.hash = window.location.hash.substring(1) + "/" + page;
    // console.log('NAV push: ', window['navHistory']);
  }

  pop() {
    window["actionHistory"] = true;

    let currentPage = window["navHistory"][window["navHistory"].length - 1];
    let i = this.getCurrentPageIndex();

    if (currentPage.state !== "root") {
      window.history.back();
      window["navHistory"][i].current = false;
      window["navHistory"][i - 1].current = true;
      window["navHistory"].pop();
    } else {
      // is root
    }
    // console.log('NAV pop: ', window['navHistory']);
  }

  setRoot(page: string) {
    // Prevent default para el listener del popstate
    window["actionHistory"] = true;
    window["navCounter"] = window["navCounter"] + 1;
    // Nuevo registro para el historial custom
    let newRegistry = {
      page: page,
      state: "root",
      count: 1,
      current: true
    };

    let hashedPage = "/#/" + page;
    window["navHistory"] = [];
    window["navHistory"].push(newRegistry);
    // window.location.hash = '/' + page;
    window.history.pushState({ hashedPage }, `${page}`, `${hashedPage}`);
  }

  setSubRoot(page: string) {
    let i = this.getCurrentPageIndex();

    for (let e of window["navHistory"]) {
      e.current = false;
    }
    // Prevent default para el listener del popstate
    window["actionHistory"] = true;
    // Nuevo registro para el historial custom
    let newRegistry = {
      page: page,
      state: "subRoot",
      count: window["navHistory"][i].count + 1,
      current: true
    };

    let hashedPage = "/#/" + page;
    window["navHistory"].push(newRegistry);
    window.location.hash = "/" + page;
    // window.history.pushState({ hashedPage }, `${page}`, `${hashedPage}`);
  }

  private getCurrentPageIndex() {
    return window["navHistory"].findIndex(x => x.current === true);
  }

  private canGoBack() {
    let i = this.getCurrentPageIndex();

    if (window["navHistory"][i].state === "root") {
      this.busManager.setBus("showBackButton", false);
    } else {
      this.busManager.setBus("showBackButton", true);
    }
  }
}
