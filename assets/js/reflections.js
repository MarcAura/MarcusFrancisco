document.addEventListener("DOMContentLoaded", function () {
    function updateBodyBackground() {
        let activeItem = document.querySelector(".reflection-item.active");

        if (activeItem) {
            let bgImage = activeItem.getAttribute("data-bg");
            if (bgImage) {
                // document.body.style.backgroundSize = "cover";
                // document.body.style.background = "";
                // document.body.classList.remove("active-bg"); // Remove overlay when inactive

                document.body.style.background = `url('${bgImage}') no-repeat center center fixed`;
                document.body.style.backgroundSize = "cover";
                document.body.classList.add("active-bg"); // Add the overlay effect
            }
        } else {
            document.body.style.background = "";
            // document.body.style.background = `url('assets/images/default.PNG') no-repeat center center fixed`;
            document.body.classList.remove("active-bg"); // Remove overlay when inactive
        }
    }

    document.querySelectorAll(".reflection-item").forEach(item => {
        item.addEventListener("click", updateBodyBackground);
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".reflection-item")) {
            document.body.style.background = "";
            document.body.classList.remove("active-bg");
        }
    });
    
});

