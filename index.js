const BASE_URL = "http://localhost:3000/posts";

document.addEventListener("DOMContentLoaded", main);

function main() {
  displayPosts();
  addNewPostListener();
  addEditFormListener();
}

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";

      posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.textContent = post.title;
        postDiv.style.cursor = "pointer";
        postDiv.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(postDiv);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0].id); // Show first post by default
      }
    });
}

function handlePostClick(postId) {
  fetch(`${BASE_URL}/${postId}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById("post-detail");
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author}</p>
        <p>${post.content}</p>
        <img src="${post.image}" alt="Post image" style="max-width: 200px;">
        <br><br>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      document.getElementById("edit-btn").addEventListener("click", () => {
        document.getElementById("edit-title").value = post.title;
        document.getElementById("edit-content").value = post.content;
        document.getElementById("edit-post-form").classList.remove("hidden");
        document.getElementById("edit-post-form").dataset.id = post.id;
      });

      document.getElementById("delete-btn").addEventListener("click", () => {
        deletePost(post.id);
      });
    });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("new-title").value;
    const author = document.getElementById("new-author").value;
    const content = document.getElementById("new-content").value;

    const newPost = {
      title,
      author,
      content,
      image: "https://via.placeholder.com/150"
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(() => {
      displayPosts(); // refresh list
      form.reset();
    });
  });
}

function addEditFormListener() {
  const editForm = document.getElementById("edit-post-form");

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = editForm.dataset.id;
    const updatedTitle = document.getElementById("edit-title").value;
    const updatedContent = document.getElementById("edit-content").value;

    fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: updatedTitle,
        content: updatedContent
      })
    })
    .then(res => res.json())
    .then(() => {
      editForm.classList.add("hidden");
      displayPosts();
      handlePostClick(id);
    });
  });

  document.getElementById("cancel-edit").addEventListener("click", () => {
    editForm.classList.add("hidden");
  });
}

function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    displayPosts();
    document.getElementById("post-detail").innerHTML = "<p>Select a post to view its details.</p>";
  });
}
 