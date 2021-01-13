let firstInternalRoute = false;

(function init() {
  if (window.location.hash.length > 0) {
    push(window.location.hash.substring(1));
    firstInternalRoute = true;
  } else {
    reset();
  }
})();

window.addEventListener("popstate", function(e) {
  if (window.location.hash !== "" && !firstInternalRoute) {
    let page = window.location.hash.substring(1);
    selectTab(page);
    renderContent(page);
  } else {
    reset();
  }
});

// ==============================
// ======= PUBLIC METHODS =======

function push(page) {
  window.location.hash = page;
  document.title = page.charAt(0).toUpperCase() + page.slice(1);
  selectTab(page);
  renderContent(page);
}

function pop() {
  if (window.location.hash !== "" && !firstInternalRoute) {
    window.history.back();
  } else {
    reset();
  }
}

// ===============================
// ======= PRIVATE METHODS =======

function renderContent(page) {
  if (page === "") {
    reset();
    return;
  }
  fetch("/" + page + ".html")
    .then(response => {
      return response.text();
    })
    .then(htmlContent => {
      document.querySelector("#app").innerHTML = htmlContent;
    });
}

function selectTab(page) {
  document.getElementById("backBtn").disabled = false;
  document
    .querySelectorAll(".route")
    .forEach(item => item.classList.remove("selected"));

  if (page !== "") {
    document
      .querySelectorAll("#" + page)
      .forEach(item => item.classList.add("selected"));
  }
}

function reset() {
  document.getElementById("backBtn").disabled = true;
  document
    .querySelectorAll(".route")
    .forEach(item => item.classList.remove("selected"));
  document.querySelector("#app").innerHTML = "Home";
  window.location.hash = "#";
  firstInternalRoute = false;
}
