var DropdownContent;

$(function () {
    setTimeout(function () {
        var error = $(".profile-details").data("error");
        if (error) {
            SnackBar({
                message: error,
                status: "error",
                icon: "exclamation",
                position: "br",
                timeout: 5000,
                fixed: true,
            });
        }
    }, 500);

    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector("#sidebar-toggle");

    if (sidebar && sidebarBtn) {
        sidebarBtn.addEventListener("click", () => {
            sidebar.classList.toggle("close");
            menuBtnChange();

            setTimeout(() => {
                try {
                    w2ui["item-grid"].refresh();
                } catch (err) {
                    console.log("Item grid not found");
                }
                try {
                    w2ui["transaction-grid"].refresh();
                } catch (err) {
                    console.log("Transaction grid not found");
                }
                try {
                    w2ui["details-grid"].refresh();
                } catch (err) {
                    console.log("Item details grid not found");
                }
            }, 510);
        });
    }

    let dropdownBtn = $(".dropdown-button");
    if (dropdownBtn.length) {
        dropdownBtn.each(function () {
            $(this).click(function () {
                if (
                    DropdownContent &&
                    DropdownContent.data("attribute") !== $(this).next().data("attribute")
                ) {
                    DropdownContent.removeClass("show");
                }
                $(this).next().toggleClass("show");
                DropdownContent = $(this).next();
            });
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
