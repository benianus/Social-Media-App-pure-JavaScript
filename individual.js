let currentPage = 1;
let lastPage = 1;

window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

  if (endOfPage && currentPage < lastPage) {
    currentPage++;
    getPosts(false, currentPage);
  }
});

async function getPosts(reload = true, page = 1) {
  if (reload) {
    document.getElementById("cards").innerHTML = "";
  }
  try {
    toggleLoader();
    let response = await axios.get(`${baseUrl}/posts?limit=5&page=${page}`);
    let posts = response.data.data;
    let postImage = "";
    let profileImage = "";

    // assigne the last page for pagination
    lastPage = response.data.meta.last_page;
    let editDeleteButtonConent = ``;
    let tags = "";
    for (post of posts) {
      //
      editDeleteButtonConent = checkIfIsItMyPost(post);
      profileImage = isProfileImageEmpty(post.author.profile_image);
      postImage = isPostImageEmpty(post.image);
      // fill out tags
      tags = addTags(post.tags);

      document.getElementById("cards").innerHTML += `
        <div class="card shadow bg-body-tertiary rounded"  >
            <div class="card-header">
              <span style="cursor: pointer" onclick="usernameImageClicked(${
                post.author.id
              })">
                <div style="height: 40px; display:inline;">
                    <img src="${profileImage}"
                        class="mh-100 rounded-5 border border-3" style="width: 40px; height: 40px;"
                        alt="usernamePicture">
                </div>
                <b>@${post.author.username}</b>
              </span>
              ${editDeleteButtonConent}
            </div>
            <div class="card-body" onclick="goToPostDetails(${post.id})">
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
              <hr >
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
              <hr style="margin-bottom: 0%">
            </div> 
            
        </div>
        `;
    }
  } catch (error) {
    console.log(error);
    showAlertMessage(error.response.data.message, "danger");
  } finally {
    toggleLoader(false);
  }
}

getPosts();

function usernameImageClicked(userid) {
  window.location = `./profile.html?userid=${userid}`;
}
