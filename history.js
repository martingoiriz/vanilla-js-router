// You may have moved on by now, but... as far as I know there's no way to delete a history entry (or state).

// One option I've been looking into is to handle the history yourself in JavaScript and use the window.history object as a carrier of sorts.

// Basically, when the page first loads you create your custom history object (we'll go with an array here, but use whatever makes sense for your situation), then do your initial pushState. I would pass your custom history object as the state object, as it may come in handy if you also need to handle users navigating away from your app and coming back later.

var myHistory = [];

function pageLoad() {
  window.history.pushState(myHistory, "<name>", "<url>");

  //Load page data.
}
// Now when you navigate, you add to your own history object (or don't - the history is now in your hands!) and use replaceState to keep the browser out of the loop.

function nav_to_details() {
  myHistory.push("page_im_on_now");
  window.history.replaceState(myHistory, "<name>", "<url>");

  //Load page data.
}
// When the user navigates backwards, they'll be hitting your "base" state (your state object will be null) and you can handle the navigation according to your custom history object. Afterward, you do another pushState.

function on_popState() {
  // Note that some browsers fire popState on initial load,
  // so you should check your state object and handle things accordingly.
  // (I did not do that in these examples!)

  if (myHistory.length > 0) {
    var pg = myHistory.pop();
    window.history.pushState(myHistory, "<name>", "<url>");

    //Load page data for "pg".
  } else {
    //No "history" - let them exit or keep them in the app.
  }
}
// The user will never be able to navigate forward using their browser buttons because they are always on the newest page.

// From the browser's perspective, every time they go "back", they've immediately pushed forward again.

// From the user's perspective, they're able to navigate backwards through the pages but not forward (basically simulating the smartphone "page stack" model).

// From the developer's perspective, you now have a high level of control over how the user navigates through your application, while still allowing them to use the familiar navigation buttons on their browser. You can add/remove items from anywhere in the history chain as you please. If you use objects in your history array, you can track extra information about the pages as well (like field contents and whatnot).

// If you need to handle user-initiated navigation (like the user changing the URL in a hash-based navigation scheme), then you might use a slightly different approach like...

var myHistory = [];

function pageLoad() {
  // When the user first hits your page...
  // Check the state to see what's going on.

  if (window.history.state === null) {
    // If the state is null, this is a NEW navigation,
    //    the user has navigated to your page directly (not using back/forward).

    // First we establish a "back" page to catch backward navigation.
    window.history.replaceState({ isBackPage: true }, "<back>", "<back>");

    // Then push an "app" page on top of that - this is where the user will sit.
    // (As browsers vary, it might be safer to put this in a short setTimeout).
    window.history.pushState({ isBackPage: false }, "<name>", "<url>");

    // We also need to start our history tracking.
    myHistory.push("<whatever>");

    return;
  }

  // If the state is NOT null, then the user is returning to our app via history navigation.

  // (Load up the page based on the last entry of myHistory here)

  if (window.history.state.isBackPage) {
    // If the user came into our app via the back page,
    //     you can either push them forward one more step or just use pushState as above.

    window.history.go(1);
    // or window.history.pushState({ isBackPage: false }, "<name>", "<url>");
  }

  setTimeout(function() {
    // Add our popstate event listener - doing it here should remove
    //     the issue of dealing with the browser firing it on initial page load.
    window.addEventListener("popstate", on_popstate);
  }, 100);
}

function on_popstate(e) {
  if (e.state === null) {
    // If there's no state at all, then the user must have navigated to a new hash.

    // <Look at what they've done, maybe by reading the hash from the URL>
    // <Change/load the new page and push it onto the myHistory stack>
    // <Alternatively, ignore their navigation attempt by NOT loading anything new or adding to myHistory>

    // Undo what they've done (as far as navigation) by kicking them backwards to the "app" page
    window.history.go(-1);

    // Optionally, you can throw another replaceState in here, e.g. if you want to change the visible URL.
    // This would also prevent them from using the "forward" button to return to the new hash.
    window.history.replaceState(
      { isBackPage: false },
      "<new name>",
      "<new url>"
    );
  } else {
    if (e.state.isBackPage) {
      // If there is state and it's the 'back' page...

      if (myHistory.length > 0) {
        // Pull/load the page from our custom history...
        var pg = myHistory.pop();
        // <load/render/whatever>

        // And push them to our "app" page again
        window.history.pushState({ isBackPage: false }, "<name>", "<url>");
      } else {
        // No more history - let them exit or keep them in the app.
      }
    }

    // Implied 'else' here - if there is state and it's NOT the 'back' page
    //     then we can ignore it since we're already on the page we want.
    //     (This is the case when we push the user back with window.history.go(-1) above)
  }
}
