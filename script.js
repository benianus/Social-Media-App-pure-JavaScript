// set the base url
const baseUrl = "https://tarmeezacademy.com/api/v1";
// initialize current page and last page

// GET Posts
setupUi();

async function goToPostDetails(postId) {
  window.location = `./post.html?postId=${postId}`;
}

function getParamerterValueFromUrlQuery(parameterName) {
  return new URLSearchParams(window.location.search).get(parameterName);
}

async function createNewPost() {
  let token = "Bearer " + getTokenFromLocalStorage();
  let title = document.getElementById("postTitle").value;
  let body = document.getElementById("postBody").value;
  let image = document.getElementById("postImage").files[0];

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  let postId = document.getElementById("createEditPostBtn").value;
  let isCreateMode = postId == null || postId == "";

  try {
    if (isCreateMode) {
      toggleLoader();
      let response = await axios.post(`${baseUrl}/posts`, formData, {
        headers: {
          Authorization: token,
        },
      });
      showAlertMessage("Post Created Successfully");
    } else {
      toggleLoader();
      formData.append("_method", "put");
      let response = await axios.post(`${baseUrl}/posts/${postId}`, formData, {
        headers: {
          Authorization: token,
        },
      });
      showAlertMessage("Post Updated Successfully");
    }
    hideModal("createNewPostModal");
    getPostDependToTheActualPage();
  } catch (error) {
    const message = error.response.data.message;
    showAlertMessage(message, "danger");
    hideModal("createNewPostModal");
  } finally {
    toggleLoader(false);
  }
}
/**
 * This function is for detecting the current page
 * and call getposts according to it.
 * no parameter needed
 */
function getPostDependToTheActualPage() {
  if (window.location.pathname.split("/")[1] == "index.html") {
    getPosts();
  }

  if (window.location.pathname.split("/")[1] == "profile.html") {
    getUserPosts();
  }
}

function addTags(tags) {
  let content = "";
  for (tag of tags) {
    content += `
          <button class="btn btn-secondary">${tag}</button>
        `;
  }

  return content;
}

function isProfileImageEmpty(profileImage) {
  return JSON.stringify(profileImage) == "{}"
    ? "./profile_pics/profile_placeholder.jpg"
    : "./profile_pics/profile_placeholder.jpg";
}

function isUserProfileImageEmpty(profileImage) {
  return JSON.stringify(profileImage) == "{}"
    ? "./profile_pics/profile_placeholder.jpg"
    : "./profile_pics/profile_placeholder.jpg";
}

function isPostImageEmpty(postImage) {
  return JSON.stringify(postImage) == "{}"
    ? "./posts_placeholder/post_placeholder.png"
    : "./posts_placeholder/post_placeholder.png";
}

async function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let params = {
    username: username,
    password: password,
  };

  try {
    toggleLoader();
    let response = await axios.post(`${baseUrl}/login`, params);
    let user = response.data.user;
    let token = response.data.token;

    storeTokenInLocalStorage(token);
    storeUserInLocalStorage(user);

    hideModal("loginModal");

    showAlertMessage("Logged in success");
    setupUi();
  } catch (error) {
    console.log(error);
    const message = error.response.data.message;
    showAlertMessage(message, "danger");
    hideModal("loginModal");
  } finally {
    toggleLoader(false);
  }
  refreshPage(window.location);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlertMessage("Logged out succeed");
  setupUi();
  refreshPage(window.location, false);
}

/**
 * if the mode is logout and the page is profile, the code will redirect you to index page
 * @param {*} currentPage the current page your are in
 * @param {*} mode set the mode to login or logout, default login = true
 */
function refreshPage(currentPage, mode = true) {
  let reditectPage = currentPage.pathname.split("/")[1];

  if (mode == false && reditectPage == "profile.html") {
    window.location = "index.html";
  } else {
    window.location = `./${reditectPage}`;
  }
}

function showUsernameAndProfileImage(user) {
  let userProfileImage = isUserProfileImageEmpty(user.profile_image);

  document.getElementById("userInfo-div").innerHTML = "";
  document.getElementById("userInfo-div").innerHTML = `
    <img src="${userProfileImage}" class="rounded-5 border border-3" style="width: 40px;"
      alt="usernamePicture">
    <p class=" me-2" style="font-weight: bold;display: inline;">@${user.username}</p>
  `;
}
async function register() {
  let name = document.getElementById("register-name").value;
  let username = document.getElementById("register-username").value;
  let password = document.getElementById("register-password").value;
  let profileImage = document.getElementById("register-ProfileImage").files[0];

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", profileImage);

  try {
    toggleLoader();
    let response = await axios.post(`${baseUrl}/register`, formData);
    storeTokenInLocalStorage(response.data.token);
    storeUserInLocalStorage(response.data.user);

    hideModal("registerModal");

    showAlertMessage("User successfully registered");
    setupUi();
  } catch (error) {
    const message = error.response.data.message;
    showAlertMessage(message, "danger");
    hideModal("registerModal");
  } finally {
    toggleLoader(false);
  }
}

function hideModal(modalHided) {
  let modal = document.getElementById(modalHided);
  let modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
}

function setupUi() {
  let token = getTokenFromLocalStorage();
  let user = getUserFromLocalStorage();

  let loginDiv = document.getElementById("login-div");
  let logoutDiv = document.getElementById("logout-div");
  let userInfoDiv = document.getElementById("userInfo-div");
  let addPostDiv = document.getElementById("addPost-btn");
  let addCommentDiv = document.getElementById("addNewComment");
  let editPostBtn = document.getElementById("edit-post-btn");
  let deletePostBtn = document.getElementById("delete-post-btn");
  let profilePageLink = document.getElementById("profile-page-link");

  if (token == null) {
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
    userInfoDiv.style.setProperty("display", "none", "important");
    if (addPostDiv != null) {
      addPostDiv.style.setProperty("display", "none", "important");
    }
    if (addCommentDiv != null) {
      addCommentDiv.style.setProperty("display", "none", "important");
    }
    if (editPostBtn != null) {
      editPostBtn.style.setProperty("display", "none", "important");
    }
    if (deletePostBtn != null) {
      deletePostBtn.style.setProperty("display", "none", "important");
    }
    profilePageLink.style.setProperty("display", "none", "important");
  } else {
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    userInfoDiv.style.setProperty("display", "block", "important");
    if (addPostDiv != null) {
      addPostDiv.style.setProperty("display", "block", "important");
    }
    if (addCommentDiv != null) {
      addCommentDiv.style.setProperty("display", "flex", "important");
    }
    if (editPostBtn != null) {
      editPostBtn.style.setProperty("display", "block", "important");
    }
    if (deletePostBtn != null) {
      deletePostBtn.style.setProperty("display", "block", "important");
    }
    profilePageLink.style.setProperty("display", "flex", "important");
    showUsernameAndProfileImage(user);
  }
}

function showAlertMessage(message, alertType = "success") {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  appendAlert(message, alertType);

  hideAlert();
}

function hideAlert() {
  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance("#liveAlertPlaceholder");
    alert.close();
    document.getElementById("alertContainer").innerHTML = `
      <div id="liveAlertPlaceholder" class="show fade"></div>
    `;
  }, 2000);
}

function storeTokenInLocalStorage(token) {
  localStorage.setItem("token", token);
}

function storeUserInLocalStorage(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function getTokenFromLocalStorage() {
  return localStorage.getItem("token");
}

function getUserFromLocalStorage() {
  let user = null;
  let storedUser = localStorage.getItem("user");

  if (storedUser != null) {
    user = JSON.parse(storedUser);
  }

  return user;
}

function showCreatePostModal() {
  //
  document.getElementById("CreateEditPostTitle").innerHTML =
    "Create A New Post";
  document.getElementById("createEditPostBtn").innerHTML = "Create";
  document.getElementById("postTitle").value = "";
  document.getElementById("postBody").innerHTML = "";
  document.getElementById("createEditPostBtn").value = "";

  // Toggle the edit/Create post
  toggleEditOrCreatePostModal("createNewPostModal");
}

function toggleEditOrCreatePostModal(modalId) {
  let addPostModal = new bootstrap.Modal(document.getElementById(modalId));
  addPostModal.toggle();
}

function showEditPostModal(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));

  document.getElementById("CreateEditPostTitle").innerHTML = "Edit Post";
  document.getElementById("createEditPostBtn").innerHTML = "Update";
  // fill in the information of post to edit
  document.getElementById("postTitle").value = post.title;
  document.getElementById("postBody").innerHTML = post.body;
  // change to edit mode
  document.getElementById("createEditPostBtn").value = `${post.id}`;

  // toggle the edit post Modal
  toggleEditOrCreatePostModal("createNewPostModal");
}

function showDeletePostDialogue(postId) {
  // add onclick attribute to confirme button
  // send the postId with
  document
    .getElementById("confirme-delete-btn")
    .setAttribute("onclick", `deletePost(${postId})`);

  // show confirme delete Modal
  toggleEditOrCreatePostModal("delete-dialogue");
}

async function deletePost(postId) {
  let token = getTokenFromLocalStorage();
  try {
    toggleLoader();
    let response = await axios.delete(`${baseUrl}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    showAlertMessage("Post successfully deleted");
    hideModal("delete-dialogue");
    getPostDependToTheActualPage();
  } catch (error) {
    let message = error.response.data.message;
    showAlertMessage(message, "danger");
  } finally {
    toggleLoader(false);
  }
}

function checkIfIsItMyPost(post) {
  // get user from local storage
  let postString = encodeURIComponent(JSON.stringify(post));
  let user = getUserFromLocalStorage();
  let editButtonConent = ``;

  if (user == null) {
    return editButtonConent;
  }
  // verfify if the user own this post
  let isItMyPost = post.author.id == user.id;
  if (isItMyPost) {
    editButtonConent = `<button class="btn btn-success" style="float: right;" onclick="showEditPostModal('${postString}')" id="edit-post-btn">Edit</button>
    <button class="btn btn-danger me-1" style="float: right" onclick="showDeletePostDialogue(${post.id})" id="delete-post-btn">Delete</button>`;
  } else {
    editButtonConent = ``;
  }
  return editButtonConent;
}

function profilePageClicked() {
  const user = getUserFromLocalStorage();
  const userid = user.id;
  window.location = `./profile.html?userid=${userid}`;
}

function toggleLoader(show = true) {
  console.log("done");
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
