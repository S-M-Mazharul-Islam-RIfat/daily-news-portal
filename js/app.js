// load all categories
const loadCategories = () => {
    const categoriesAPI = `https://openapi.programming-hero.com/api/news/categories`;
    fetch(categoriesAPI)
        .then(response => response.json())
        .then(data =>
            showCategories(data.data.news_category)
        )
        .catch(error => console.log(error));
}
loadCategories();


// show all categories
const showCategories = categories => {
    const categoryContainer = document.getElementById("categories");

    for (const category of categories) {
        const individualCategory = document.createElement("li");
        individualCategory.setAttribute("class", "fw-700 p-3 p-lg-0")
        individualCategory.innerText = category.category_name;
        individualCategory.setAttribute("onclick", `loadNews('${category.category_id}')`);
        individualCategory.setAttribute("id", category.category_id)
        categoryContainer.appendChild(individualCategory);
        // start spinner event
        document.getElementById(category.category_id).addEventListener("click", () => {
            toggleSpinner(true);
        })
    }

}


// load news when onclick event is triggered on category
const loadNews = newsCategoryId => {
    const individualNewsCategoryDetalisAPI = `https://openapi.programming-hero.com/api/news/category/${newsCategoryId}`;
    fetch(individualNewsCategoryDetalisAPI)
        .then(response => response.json())
        .then(data =>
            showNews(data.data)
        )
        .catch(error => console.log(error));

}


// show all the news of individual category
const showNews = allNews => {

    // Check the edge case ..whether data found or not
    if (allNews.length === 0) {
        const noDataFoundMsg = document.getElementById("no-data-found-msg");
        noDataFoundMsg.setAttribute("class", "text-center text-danger");
    }
    else {
        const noDataFoundMsg = document.getElementById("no-data-found-msg");
        noDataFoundMsg.setAttribute("class", "d-none");
    }
    const totalNewsCount = document.getElementById("total-news-count");
    totalNewsCount.value = `${allNews.length} items found`;

    // Sort the news in descending order
    allNews.sort((a, b) => {
        if (a.total_view > b.total_view) {
            return -1;
        }
        else if (a.total_view < b.total_view) {
            return 1;
        }
        else if (a.total_view === b.total_view) {
            return 0;
        }
    });


    const allNewsContainer = document.getElementById("all-news");
    allNewsContainer.textContent = "";
    allNews.forEach(news => {

        let newsDetails =
            `
            <div class="col-12 col-md-6 col-lg-4 mt-3 mt-lg-0 mt-4 mb-0 mb-lg-4">
                <div class="shadow card border-0">
                <div class="news-img-wrapper">
                    <img src="${news.thumbnail_url}" class="card-img-top img-fluid h-350 p-3 w-100" alt="thumbnail image not found">
                </div>
                <div class="card-body">
                <h5 class="news-title card-title text-center fw-bold">${news.title ? news.title : "news title not found"}</h5>
                <p class="news-info card-text text-center text-muted mx-auto">${news.details.slice(0, Math.min(300, news.details.length)) ? news.details.slice(0, Math.min(300, news.details.length)) : "news info not found"}...</p>
                <div
                    class="news-author-info-and-show-details-btn d-flex justify-content-between mt-4">
                    <div class="d-flex align-items-center">
                        <div>
                            <img class="img-fluid author-img-style w-100" src="${news.author.img}" alt="author image not found">
                        </div>
                        <div class="ms-2">
                            <h6 class="mb-0">${news.author.name ? news.author.name : "news author name not found"}</h6>
                            <small class="mb-0">Jan 10, 2022 </small>
                        </div>
                    </div>
                    <div>
                        <img class="img-fluid" src="../img/view-img.png" alt="">
                        <small>${news.total_view ? news.total_view + "M" : "news total view not found"}</small>
                    </div>
                </div>
                <div class="d-flex justify-content-center mt-4 mb-2">
                    <a onclick="loadNewsDetails('${news._id ? news._id : "news id not found"}')" href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newsDetailsModal">See details</a>
                </div>
                </div>
                </div>
            </div>
        `
        allNewsContainer.innerHTML += newsDetails;
    });
    // stop spinner event
    toggleSpinner(false);

    // Display the footer on the basis of a condition
    if (allNews.length >= 1) {
        const footer = document.getElementById("footer");
        footer.removeAttribute("class");
    }
    else {
        const footer = document.getElementById("footer");
        footer.setAttribute("class", "d-none");
    }
}


// load news details
const loadNewsDetails = newsId => {
    const newsDetailsAPI = `https://openapi.programming-hero.com/api/news/${newsId}`
    fetch(newsDetailsAPI)
        .then(response => response.json())
        .then(data => showNewsDetails(data.data))
        .catch(error => console.log(error));
}


// show news details using a modal
const showNewsDetails = news => {
    const thumbnailUrlImg = document.getElementById("thumbnail_url-img");
    thumbnailUrlImg.setAttribute("src", news[0].thumbnail_url);
    thumbnailUrlImg.setAttribute("alt", "thumbnail image not found");

    const newsTitle = document.getElementById("news-title");
    newsTitle.innerText = (news[0].title ? news[0].title : "news title not found");

    const newsInfo = document.getElementById("news-info");
    newsInfo.innerText = `${news[0].details.slice(0, Math.min(300, news[0].details.length)) ? news[0].details.slice(0, Math.min(300, news[0].details.length)) : "news info not found"}...`;

    const newsAuthorName = document.getElementById("news-author-name");
    newsAuthorName.innerHTML = (news[0].author.name ? news[0].author.name : "news author name not found");

    const newsTotalView = document.getElementById("news-total-view");
    newsTotalView.innerHTML = (news[0].total_view ? news[0].total_view + "M" : "news total view not found");

    const newsAuthorImg = document.getElementById("news-author-img");
    newsAuthorImg.setAttribute("src", news[0].author.img);
    newsAuthorImg.setAttribute("alt", "author image not found");

    const ratingNumber = document.getElementById("rating-number");
    ratingNumber.innerHTML = (news[0].rating.number ? news[0].rating.number : "rating number not found");

    const ratingBadge = document.getElementById("rating-badge");
    ratingBadge.innerHTML = (news[0].rating.badge ? news[0].rating.badge : "rating badge not found");

    const todaysPick = document.getElementById("todays-pick");
    todaysPick.innerHTML = (news[0].others_info.is_todays_pick ? news[0].others_info.is_todays_pick : "todays pick not found");

    const todaysTrending = document.getElementById("todays-trending");
    todaysTrending.innerHTML = (news[0].others_info.is_trending ? news[0].others_info.is_trending : "todays trending not found");
}


// toggle spinner
const toggleSpinner = isLoading => {
    const loaderSection = document.getElementById("loader");
    if (isLoading) {
        loaderSection.classList.remove("d-none");
    }
    else {
        loaderSection.classList.add("d-none");
    }
}
