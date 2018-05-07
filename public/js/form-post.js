$("#form-submit").on("submit", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    console.log(req.body);
    var newForm = req.body;
    console.log(newForm);
    // Send the POST request.
    $.post("/api/posts", post, function() {
        type: "POST";
        data: req.body;
    }).then(
        function () {
            //!!!REMOVE AFTER DEBUGGING
            console.log("Created new form");
            // Reload the page to get the updated list
            location.reload();
        }
    );
});



$(document).ready(function () {
    /* global moment */
    // Click events for the submit button
    $(document).on("click", "form-submit", handlePostDelete);
    
    // Variable to hold form data
    var posts;

    // This function grabs posts from the database and updates the view
    function getPosts(author) {
        authorId = author || "";
        if (authorId) {
            authorId = "/?author_id=" + authorId;
        }
        $.get("/api/posts" + authorId, function (data) {
            console.log("Posts", data);
            posts = data;
            if (!posts || !posts.length) {
                displayEmpty(author);
            }
            else {
                initializeRows();
            }
        });
    }

    // This function does an API call to delete posts
    function deletePost(id) {
        $.ajax({
            method: "DELETE",
            url: "/api/posts/" + id
        })
            .then(function () {
                getPosts(postCategorySelect.val());
            });
    }

    // InitializeRows handles appending all of our constructed post HTML inside blogContainer
    function initializeRows() {
        blogContainer.empty();
        var postsToAdd = [];
        for (var i = 0; i < posts.length; i++) {
            postsToAdd.push(createNewRow(posts[i]));
        }
        blogContainer.append(postsToAdd);
    }

    // This function constructs a post's HTML
    function createNewRow(post) {
        var formattedDate = new Date(post.createdAt);
        formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
        var newPostCard = $("<div>");
        newPostCard.addClass("card");
        var newPostCardHeading = $("<div>");
        newPostCardHeading.addClass("card-header");
        var deleteBtn = $("<button>");
        deleteBtn.text("x");
        deleteBtn.addClass("delete btn btn-danger");
        var editBtn = $("<button>");
        editBtn.text("EDIT");
        editBtn.addClass("edit btn btn-info");
        var newPostTitle = $("<h2>");
        var newPostDate = $("<small>");
        var newPostAuthor = $("<h5>");
        newPostAuthor.text("Written by: " + post.Author.name);
        newPostAuthor.css({
            float: "right",
            color: "blue",
            "margin-top":
                "-10px"
        });
        var newPostCardBody = $("<div>");
        newPostCardBody.addClass("card-body");
        var newPostBody = $("<p>");
        newPostTitle.text(post.title + " ");
        newPostBody.text(post.body);
        newPostDate.text(formattedDate);
        newPostTitle.append(newPostDate);
        newPostCardHeading.append(deleteBtn);
        newPostCardHeading.append(editBtn);
        newPostCardHeading.append(newPostTitle);
        newPostCardHeading.append(newPostAuthor);
        newPostCardBody.append(newPostBody);
        newPostCard.append(newPostCardHeading);
        newPostCard.append(newPostCardBody);
        newPostCard.data("post", post);
        return newPostCard;
    }

    // This function figures out which post we want to delete and then calls deletePost
    function handlePostDelete() {
        var currentPost = $(this)
            .parent()
            .parent()
            .data("post");
        deletePost(currentPost.id);
    }

    // This function figures out which post we want to edit and takes it to the appropriate url
    function handlePostEdit() {
        var currentPost = $(this)
            .parent()
            .parent()
            .data("post");
        window.location.href = "/cms?post_id=" + currentPost.id;
    }

    // This function displays a message when there are no posts
    function displayEmpty(id) {
        var query = window.location.search;
        var partial = "";
        if (id) {
            partial = " for Author #" + id;
        }
        blogContainer.empty();
        var messageH2 = $("<h2>");
        messageH2.css({ "text-align": "center", "margin-top": "50px" });
        messageH2.html("No posts yet" + partial + ", navigate <a href='/cms" + query +
            "'>here</a> in order to get started.");
        blogContainer.append(messageH2);
    }

});
