let navigationCount = 0;

window.addEventListener("popstate", event => {
  navigationCount -= 1;

  if (navigationCount) {
    selectTab(event.state.page);
    renderContent(event.state.page);
  } else {
    reset();
  }
});

// ==============================
// ======= PUBLIC METHODS =======

function push(page) {
  navigationCount += 1;
  document.title = page.charAt(0).toUpperCase() + page.slice(1);
  selectTab(page);
  renderContent(page);
  window.history.pushState({ page }, `${page}`, `${page}`);
}

function pop() {
  if (navigationCount !== 0) {
    window.history.back();
  } else {
    reset();
  }
}

// ===============================
// ======= PRIVATE METHODS =======

function renderContent(page) {
  fetch("./" + page + ".html")
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

  document
    .querySelectorAll("#" + page)
    .forEach(item => item.classList.add("selected"));
}

function reset() {
  document.getElementById("backBtn").disabled = true;
  document
    .querySelectorAll(".route")
    .forEach(item => item.classList.remove("selected"));
  document.querySelector("#app").innerHTML = "Home";
}
