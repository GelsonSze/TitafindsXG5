const limit = 4,
    contentLimit = 170;
// const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

$(function () {
    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector("#sidebar-toggle");

    if (sidebar && sidebarBtn) {
        sidebarBtn.addEventListener("click", () => {
            sidebar.classList.toggle("close");
            menuBtnChange();

            setTimeout(() => {
                try {
                    w2ui["itemGrid"].refresh();
                } catch (err) {
                    console.log("Item grid not found");
                }
                try {
                    w2ui["transactionGrid"].refresh();
                } catch (err) {
                    console.log("Transaction grid not found");
                }
                try {
                    w2ui["detailsGrid"].refresh();
                } catch (err) {
                    console.log("Item details grid not found");
                }
            }, 510);
        });
    }

    $(document).on("click", (e) => {
        // console.log(e.target);
        if (
            e.target.closest(".icon-link") &&
            !e.target.closest(".sidebar").classList.contains("close")
        ) {
            e.target.closest(".icon-link").parentElement.classList.toggle("showMenu");

            // let arrow = document.querySelectorAll(".arrow");
            // for (var i = 0; i < arrow.length; i++) {
            //     arrow[i].addEventListener("click", (e) => {
            //         let arrowParent = e.target.parentElement.parentElement; //selecting main parent of arrow
            //         arrowParent.classList.toggle("showMenu");
            //     });
            // }
        } else if (e.target.closest("#logout")) {
            console.log(e.target);

            $.ajax({
                url: "/auth/logout",
                type: "DELETE",
                success: function (res) {
                    window.location.replace(window.location.origin + "/login");
                },
            });
        }
    });

    // following are the code to change sidebar button
    function menuBtnChange() {
        if (sidebar.classList.contains("close")) {
            sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu"); //replacing the icons class
        } else {
            sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right"); //replacing the icons class
        }
    }
});

// var arrowDown,
//     profileActive = 0,
//     profileDropdown;
// var hasNotif = 1,
//     notifContainer,
//     notifDropdown;
// var userId;

// document.addEventListener("DOMContentLoaded", function (e) {
//     if (document.querySelector("#profile-container")) userId = document.querySelector("#profile-container").getAttribute("data-id");

//     const searchForm = document.querySelector("#search-form");
//     const searchBar = document.querySelector("#search-bar");
//     const searchSubmit = document.querySelector("#search-submit");

//     notifContainer = document.querySelector("#notification-container");
//     notifDropdown = document.querySelector("#notification-dropdown");
//     profileDropdown = document.querySelector("#profile-dropdown");

//     if (searchForm && searchBar && searchSubmit) {
//         searchBar.addEventListener("focus", function () {
//             searchForm.classList.add("input-focus");
//         });
//         searchBar.addEventListener("blur", function () {
//             searchForm.classList.remove("input-focus");
//         });
//         searchSubmit.addEventListener("click", function (e) {
//             e.preventDefault();
//             if (searchBar.value.length > 0) {
//                 window.location.href = window.location.origin + "/search=" + searchBar.value;
//             }
//         });
//     }
// });

// window.addEventListener("load", function (e) {
//     const urls = ["/login", "/signup", "/forgotpassword"];
//     if (!urls.includes(window.location.pathname)) {
//         //clear(notifDropdown);
//         //loadNotifications(notifications);
//     }
// });

// document.addEventListener("click", function (e) {
//     if (e.target.closest("#icon-arrowdown")) {
//         profileActive = !profileActive;
//         if (!arrowDown) arrowDown = e.target.closest("#icon-arrowdown");
//         arrowDown.style.transform = profileActive ? "rotate(180deg)" : "rotate(0deg)";
//         profileDropdown.classList.toggle("active");
//     } else if (e.target.closest("#profile-btn") || e.target.id == "icon-user") {
//         window.location.href = window.location.origin + "/profile";
//     } else if (e.target.closest("#settings-btn")) {
//         window.location.href = window.location.origin + "/settings";
//     } else if (e.target.closest("#logout-btn")) {
//         fetch("/auth/logout", { method: "DELETE" }).then((res) => {
//             if (res.status == 200) {
//                 window.location.href = window.location.origin + "/login";
//             }
//         });
//     } else if (e.target.closest("#icon-notification")) {
//         notifDropdown.classList.toggle("active");

//         if (hasNotif) {
//             hasNotif = 0;
//             notifContainer.classList.remove("has-notification");
//         }
//     } else if (e.target.closest(".notif-item")) {
//         let notifItem = e.target.closest(".notif-item");
//         window.location.href = notifItem.getAttribute("data-link");
//     }
// });

// function loadNotifications(notificationArr) {
//     for (const notif of notificationArr) {
//         console.log(notif.commenter.comments[0]);
//         // logic for data-link is temporary for now (because of the first element)
//         let notifHTML = `<div class="notif-item" data-link="${notif.commenter.comments[0].discussion}">
//             <img src="${notif.commenter.imgSrc}" class="notif-commenter">
//             <div class="notif-body">
//                 <p class="notif-content"><span>${notif.commenter.username}</span> commented on your <span>discussion</span></p>
//                 <span class="notif-date">${calcDate(notif.commenter.comments[0].date)}</span>
//             </div>
//         </div>`;
//         notifDropdown.insertAdjacentHTML("afterbegin", notifHTML);
//     }
// }
