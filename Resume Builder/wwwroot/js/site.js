/* Selects wrappers */
const personalSection = document.getElementById("personal-section");
const contentSections = document.getElementsByClassName("content-section");
const arrows = document.getElementsByClassName("arrow");

$("#personal-wrapper").on("click", togglePersonalSection);

$(".content-card-info").on("click", function () {
    toggleContentSection(this);
});

for (let i = 2; i < contentSections.length; i++) {
    contentSections[i].addEventListener("click", (e) => {
        const isCardHeader = "content-card-header";
        const isBtn = e.target.nodeName === 'BUTTON' && e.target.id == '';
        let cardHeader = e.target.closest(`.${isCardHeader}`) || e.target.parentElement.parentElement;
        //Fix this below.
        console.log(cardHeader);
        if (cardHeader.classList.contains(isCardHeader)) {
            toggleContentSection(cardHeader, isBtn);
            toggleArrow(cardHeader);
        }
        if (isBtn) {
            toggleContentSection(cardHeader, isBtn);
        }
    })
}

/* Toggling functions to toggle between wrappers and inputs */
function togglePersonalSection() {
    $("#personal-wrapper").toggleClass("hidden");
    $("#personal-input").toggleClass("hidden");
}
function toggleAnimation(cardBox) {
    if (cardBox.classList.contains("hidden")) {
        $(cardBox).slideDown("fast");
    } else {
        $(cardBox).slideUp("fast");
    }
}

function toggleContentSection(button) {
    let contentSection = $(button).closest('.content-section');
    contentSection.find('.content-section-header').toggleClass('hidden');
    contentSection.find('.content-section-input').toggleClass('hidden');
}

function toggleContentSection(cardHeader, isBtn) {
    const selectedContentHeader = cardHeader.parentElement;
    const selectedContentSection = selectedContentHeader.parentElement;
    if (!cardHeader.classList.contains("hidden") && !isBtn) {
        for (const child of selectedContentHeader.children) {
            if (child.classList.contains("content-card-box")) {
                let cardBox = child;
                toggleAnimation(cardBox);
                cardBox.classList.toggle("hidden");
                let cardInfos = cardBox.getElementsByClassName("content-card-info");
                for (const cardInfo of cardInfos) {
                    cardInfo.addEventListener("click", () => {
                        for (const child of selectedContentSection.children) {
                            child.classList.toggle("hidden");
                        }
                    });
                }
            }
        }
    } else {
        for (const child of selectedContentSection.children) {
            child.classList.toggle("hidden");
        }
    }
}
function toggleArrow(cardHeader) {
    let arrow = cardHeader.querySelector(".arrow");
    if (arrow) {
        arrow.classList.toggle("rotated");
    }
}
