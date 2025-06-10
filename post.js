let globalPostId = 0;

async function getPost(parameterName = "postId") {
  // get the post id from the url using this methode
  let postId = getParamerterValueFromUrlQuery(parameterName);
  document.getElementById("cards").innerHTML = "";
  try {
    toggleLoader();
    const response = await axios.get(`${baseUrl}/posts/${postId}`);
    let post = response.data.data;
    let postImage = "";
    let profileImage = "";

    let tags = "";
    let comments = "";
    let user = null;

    let editDeleteButtonConent = checkIfIsItMyPost(post);

    profileImage = isProfileImageEmpty(post.author.profile_image);
    postImage = isPostImageEmpty(post.image);

    // show post user owner
    showPostOwnerUsername(post.author.username);
    // fill out tags
    tags = addTags(post.tags);
    user = getUserFromLocalStorage();
    comments = addComments(post.comments);
    document.getElementById("cards").innerHTML = `
        <div class="card unClickedCard shadow bg-body-tertiary rounded" >
            <div class="card-header">
              <div style="height: 40px; display: inline;">
                  <img src="${profileImage}"
                      class="mh-100 rounded-5 border border-3" style="width: 40px; height: 40px;"
                      alt="usernamePicture">
              </div>
              <b>@${post.author.username}</b>
              ${editDeleteButtonConent}
            </div>
            <div class="card-body">
              <img
                src="${postImage}"
                alt="placeholder"
                class="w-100 rounded-3"
              />
              <h6 class="card-title mt-2 text-secondary">${post.created_at}</h6>
              <h3 class="card-title mt-2 text-dark">${post.title ?? ""}</h3>
              <p class="card-text">
                ${post.body}
              </p>
              <hr>
              <div id="tags">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                  />
                </svg>
                <span class="me-1"> (${post.comments_count}) Comments </span>
                <div style="display: inline;" id="tags">
                  ${tags}
              </div>
              <hr class="mb-0">
            </div>
        </div>
        <div class="cardComments bg-info-subtle rounded-3 mx-1 my-2 me-2 ms-2" id="cardComments">
          ${comments}
        </div>
        <div class="addNewComment d-flex me-2 ms-2 mt-2 mb-2" id="addNewComment" >
          <input type="text" class="form-control " style="border-radius: 8px 0px 0px 8px" id="commentInput">
          <button class="btn btn-primary  border-black border-1" style="border-radius: 0% 8px 8px 0%" id="addCommentBtn" onclick="createNewComment(${postId})">Comment</button>
        </div>
      `;
    setupUi();
  } catch (error) {
    // alert(error.response.data.message);
    showAlertMessage(error.response.data.message, "danger");
  } finally {
    toggleLoader(false);
  }
}

async function createNewComment(postId) {
  let token = "Bearer " + getTokenFromLocalStorage();
  let comment = document.getElementById("commentInput").value;
  let params = {
    body: comment,
  };

  try {
    toggleLoader();
    await axios.post(`${baseUrl}/posts/${postId}/comments`, params, {
      headers: {
        Authorization: token,
      },
    });

    showAlertMessage("Comment added successfully", "success");
    getPost();
  } catch (error) {
    let message = error.response.data.message;
    showAlertMessage(message, "danger");
  } finally {
    toggleLoader(false);
  }
}

function addComments(comments) {
  let content = "";
  if (JSON.stringify(comments) == "[]") {
    content = `
          <div class="comment m-3 " id="comment">
            <div class="commentUser" id="commentUser">
              <img src="/profile_pics/profile_placeholder.jpg" alt="profile image" class="rounded-5 border border-3"
                style="width: 40px;height: 40px;">
              <b>@username</b>
            </div>
            <div class="commentText" id="commentText">
              <p class="m-0">There is no comments in this post, you can add one</p>
            </div>
          </div>
        `;
  } else {
    for (comment of comments) {
      content += `
          <div class="comment m-3 " id="comment">
            <div class="commentUser" id="commentUser">
              <img src="${isProfileImageEmpty(
                comment.author.profile_image
              )}" alt="profile image" class="rounded-5 border border-3"
                style="width: 40px; height: 40px;">
              <b>@${comment.author.username}</b>
            </div>
            <div class="commentText" id="commentText">
              <p class="m-0">${comment.body}</p>
            </div>
          </div>
        `;
    }
  }
  return content;
}

function showPostOwnerUsername(username) {
  document.getElementById("postUser").innerHTML = `@${username} Post`;
}

getPost();
