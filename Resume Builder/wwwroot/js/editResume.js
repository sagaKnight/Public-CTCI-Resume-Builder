let savedPersonalData = {};

/* Personal Section */
$("#personal-wrapper").on('click', function () {
    savedPersonalData = getPersonalDetails();
})

$("#personal-input .form-group input").on('input', function () {
    let tempData = getPersonalDetails();
    setPersonalDetails(tempData);
});

$("#personal-discard").on('click', function (e) {
    setPersonalDetails(savedPersonalData);
    getPersonalDetails();
    togglePersonalSection();
    resetPersonalDetails();
})

$("#personal-save").on('click', function (e) {
    let newData = getPersonalDetails();
    setPersonalDetails(newData);
    savedPersonalData = {};
    removePlaceholderClass();
    togglePersonalSection();
});

function getPersonalDetails() {
    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let address = $("#address").val();
    let pNumber = $("#pNumber").val();
    let email = $("#email").val();
    let extraInfo = $("#extraInfo").val();

    let data = {
        fName,
        lName,
        address,
        pNumber,
        email,
        extraInfo,
    };

    return data;
}
function removePlaceholderClass() {
    const placeholders = ["Address", "Your Name", "Email", "Phone Number"];

    $('#personal-wrapper').children().each(function () {
        const textValue = $(this).text().trim();
        console.log(textValue);
        console.log(!placeholders.includes(textValue));
        if (!placeholders.includes(textValue)) {
            $(this).removeClass('grey-text');
        } else {
            $(this).addClass('grey-text');
        }
    });
}

function setPersonalDetails(data) {
    $("#resume-page-heading h2").text(data.fName + " " + data.lName);
    $("#resume-page-heading p:nth-of-type(1)").text(data.address);
    let contactHtml = '';

    contactHtml += '<span style="margin-right: 10px;">' + data.email + '</span>';
    contactHtml += '<span style="margin-right: 10px;">|</span>';
    contactHtml += '<span style="margin-right: 10px;">' + data.pNumber + '</span>';

    if (data.extraInfo && data.extraInfo.trim() !== "") {
        contactHtml += '<span style="margin-right: 10px;">|</span>';
        if (!data.extraInfo.includes("www.")) {
            contactHtml += '<span><a href="https://' + data.extraInfo + '" target="_blank">' + data.extraInfo + '</a></span>';
        } else {
            contactHtml += '<span>' + data.extraInfo + '</span>';
        }
    }

    $("#resume-page-heading p:nth-of-type(2)").html(contactHtml);

    $("#personal-wrapper h5").text(
        data.fName || data.lName ? (data.fName || "") + " " + (data.lName || "") : "Your Name"
    );

    $("#personal-wrapper p:nth-of-type(1)").text(data.address || "Address");
    $("#personal-wrapper p:nth-of-type(2)").text(data.email || "Email");
    $("#personal-wrapper p:nth-of-type(3)").text(data.pNumber || "Phone Number");
}

function resetPersonalDetails() {
    $("#fName").val(savedPersonalData.fName);
    $("#lName").val(savedPersonalData.lName);
    $("#address").val(savedPersonalData.address);
    $("#pNumber").val(savedPersonalData.pNumber);
    $("#email").val(savedPersonalData.email);
    $("#extraInfo").val(savedPersonalData.extraInfo);

    savedPersonalData.contactText = savedPersonalData.email + " | " + savedPersonalData.pNumber;
    if (savedPersonalData.extraInfo) {
        savedPersonalData.contactText += " | " + savedPersonalData.extraInfo;
    }
    savedPersonalData = {};
}

/* Content Functions */
let editingSectionData = null;
let dataCounter = 1;
function toggleContentInput(section) {
    $(`#${section}-header`).toggleClass('hidden');
    $(`#${section}-input`).toggleClass('hidden');
}

function setSectionHeading(section, headingText) {
    if ($(`#resume-${section}`).length === 0) {
        let newDiv = $('<div>', {
            id: `resume-${section}`,
            class: 'resume-section-start',
            style: 'margin-top: 10px; padding-left: 15px'
        });

        let newH6 = $('<h6>', {
            html: '<strong>' + headingText + '</strong>',
            style: 'margin: 0px; padding: 0px;'
        });


        let newHr = $('<hr>', {
            style: 'margin-top: 2px; margin-bottom: 2px;'
        });

        newDiv.append(newH6);
        newDiv.append(newHr);

        $(`#resume-content`).append(newDiv);
    }
}

function createNewDetails(data, section) {
    if (section === "employment" || section === "education") {
        createDatedDetails(data, section);
    } else if (section === "technical" || section === "additional") {
        createUndatedDetails(data, section);
    } else {
        createLangDetails(data, section);
    }
}

function createLangDetails(data, section) {
    let newDiv = $('<div></div>').addClass('resume-section');
    let resumeSection = $(`#resume-${section}`);
    let ul = resumeSection.find('ul');
    if (ul.length === 0) {
        ul = $('<ul></ul>');
        newDiv.append(ul);
    }

    data.langTech.forEach(line => {
        let li = $(`<li>${line}</li>`);
        ul.append(li);
    });

    let newCardInfoDiv = $('<div></div>').addClass('content-card-info border-top border-bottom pt-3 pb-3');
    const value = dataCounter;
    newCardInfoDiv.on('click', function () {
        editingSectionData = value;
        toggleContentInput(section);
        preloadFormInputs(editingSectionData, section);
    });

    newCardInfoDiv.append(`
      <h5 class="d-inline">${data.langTech[0].length > 8 ? data.langTech[0].slice(0, 8) + '...' : data.langTech[0]}</h5>
    `);

    $(`#${section}-input`).data("storedContentInfo" + dataCounter, { newCard: newCardInfoDiv, div: newDiv, data: data });
    $(`#resume-${section}`).append(newDiv);
    $(`#${section}-card-box .text-center.mt-3`).before(newCardInfoDiv);
}

function createUndatedDetails(data, section) {
    let newDiv = $('<div></div>').addClass('resume-section');

    // Create the title, languages, and repo link section
    let titleDiv = $('<div></div>').addClass('undated-title-info');
    let languages = data.technologiesUsed || '';
    let repoLink = data.repoLink ? `<a href="${data.repoLink}" target="_blank">Project Repo</a>` : '';

    if (data.projectTitle) {
        titleDiv.append(`
            <h6 style="display:inline-block; margin: 0"><strong style="display:inline-block; margin: 0">${data.projectTitle || ''}</strong></h6>
            <p style="display:inline-block; margin: 0"> | </p>
            <p style="display:inline-block; margin: 0">${languages}</p>
            ${repoLink ? `<p style="display:inline-block; margin: 0"> | ${repoLink}</p>` : ''}
        `);
    } else {
        titleDiv.append(`
        <h6 class="d-inline"><strong>${data.additionalTitle || ''}</strong></h6>
    `);
    }

    newDiv.append(titleDiv);

    let projectDescriptionDiv = $('<div></div>').addClass('undated-description');
    let ul = $('<ul></ul>');
    let projectDescriptions = data.projectDescription || data.additionalDesc;
    if (projectDescriptions[0] != '') {
        projectDescriptions.forEach(description => {
            let li = $('<li></li>').text(description);
            ul.append(li);
        });
    }
    projectDescriptionDiv.append(ul);
    newDiv.append(projectDescriptionDiv);

    let newCardInfoDiv = $('<div></div>').addClass('content-card-info border-top border-bottom pt-3 pb-3');
    const value = dataCounter;
    newCardInfoDiv.on('click', function () {
        editingSectionData = value;
        toggleContentInput(section);
        preloadFormInputs(editingSectionData, section);
    });

    newCardInfoDiv.append(`
        <h5 class="d-inline">${data.projectTitle || data.additionalTitle || ''}</h5>
    `);

    $(`#${section}-input`).data("storedContentInfo" + dataCounter, { newCard: newCardInfoDiv, div: newDiv, data: data });
    $(`#resume-${section}`).append(newDiv);
    $(`#${section}-card-box .text-center.mt-3`).before(newCardInfoDiv);
    dataCounter++;
}

function createDatedDetails(data, section) {
    let newDiv = $('<div></div>').addClass('resume-section');
    let primaryTitle = section === "employment" ? data.jobTitle : data.universityLocation || "";
    let secondaryTitle = section === "employment" ? data.companyName : data.universityName || "";

    //For both jobs and education
    let detailsList = (data.jobDetails || data.educationDetails || [])
        .filter(detail => detail?.trim())  // Remove empty/whitespace-only details
        .map(detail => `<li>${detail}</li>`)
        .join("");

    newDiv.append(`
    <div class="resume-section-header" style="display: flex; align-items: center; justify-content: space-between; padding-left: 15px; padding-right: 15px">
        <h6 style="margin: 0px; width: 27%;"><strong>${primaryTitle}</strong></h6>
        <h6 style="margin: 0px; width: 46%; text-align: center;"><strong>${secondaryTitle}</strong></h6>
        <h6 style="margin: 0px; width: 27%; text-align: right;"><strong>${data.dateText}</strong></h6>
    </div>
    <ul>
        ${detailsList}
    </ul>
`);

    let newCardInfoDiv = $('<div></div>').addClass('content-card-info border-top border-bottom pt-3 pb-3')

    $(`#${section}-input`).data("storedContentInfo" + dataCounter, { newCard: newCardInfoDiv, div: newDiv, data: data });

    const value = dataCounter;
    newCardInfoDiv.on('click', function () {
        editingSectionData = value;
        toggleContentInput(section);
        preloadFormInputs(editingSectionData, section);
    });
    newCardInfoDiv.append(`
    <h5 class="d-inline">${primaryTitle}${secondaryTitle ? "," : ""}</h5>
    <h6 class="d-inline">${secondaryTitle ? secondaryTitle : ""}</h6>
    <p class="m-0">${data.dateText ? data.dateText : ""}</p>
    `);
    $(`#resume-${section}`).append(newDiv);
    $(`#${section}-card-box .text-center.mt-3`).before(newCardInfoDiv);
    dataCounter++;
}

function editContentDetails(newData, section) {
    let storedData = $(`#${section}-input`).data("storedContentInfo" + editingSectionData);
    if (section === "employment" || section === "education") {
        editDatedDetails(newData, section, storedData);
    } else if (section === "technical" || section === "additional") {
        editUndatedDetails(newData, section, storedData);
    } else {
        editLangDetails(newData, section, storedData);
    }
}

function editLangDetails(newData, section, storedData) {
    let resumeDotpoints = storedData.div;
    let newCardDiv = storedData.newCard;
    resumeDotpoints.empty();
    newData.langTech.forEach(line => {
        let li = $(`<li>${line}</li>`);
        resumeDotpoints.append(li);
    });
    newCardDiv.find('h5').text(newData.langTech[0].length > 8 ? newData.langTech[0].slice(0, 8) + '...' : newData.langTech[0]);
    $(`#${section}-input`).data("storedContentInfo" + editingSectionData, { newCard: newCardDiv, div: resumeDotpoints, data: newData });
    editingSectionData = null;
}

function editUndatedDetails(newData, section, storedData) {
    let titleDiv = storedData.div.find('.undated-title-info');
    let descDiv = storedData.div.find('.undated-description');
    let newCardDiv = storedData.newCard;
    let descriptions = newData.projectDescription || newData.additionalDesc || [];
    let ul = $('<ul></ul>');
    descriptions.forEach(description => {
        ul.append(`<li>${description}</li>`);
    });
    if (newData.projectTitle) {
        titleDiv.html(`
            <h6 style="display:inline-block; margin: 0">
                <strong style="display:inline-block; margin: 0">${newData.projectTitle || ''}</strong>
            </h6>
            <p style="display:inline-block; margin: 0"> | </p>
            <p style="display:inline-block; margin: 0">${newData.technologiesUsed || ''}</p>
            ${newData.repoLink ? `<p style="display:inline-block; margin: 0"> | <a href="${newData.repoLink}" target="_blank">Project Repo</a></p>` : ''}
        `);
        descDiv.html(ul);
    } else {
        titleDiv.html(`
            <h6 class="d-inline"><strong>${newData.additionalTitle || ''}</strong></h6>
        `);
        descDiv.html(ul);
    }
    newCardDiv.find('h5').text(newData.projectTitle || newData.additionalTitle);
    $(`#${section}-input`).data("storedContentInfo" + editingSectionData, { newCard: newCardDiv, div: storedData.div, data: newData });
    editingSectionData = null;
}

function editDatedDetails(newData, section, storedData) {
    let resumeDiv = storedData.div;
    let newCardDiv = storedData.newCard;
    let primaryTitle = section === "employment" ? newData.jobTitle : newData.universityName || "";
    let secondaryTitle = section === "employment" ? newData.companyName : newData.universityLocation || "";
    let dateText = newData.dateText || "";
    resumeDiv.find('.resume-section-header h6:nth-child(1) strong').text(primaryTitle);
    resumeDiv.find('.resume-section-header h6:nth-child(2) strong').text(secondaryTitle);
    resumeDiv.find('.resume-section-header h6:nth-child(3) strong').text(dateText);
    resumeDiv.find('ul').empty();
    (newData[section === "employment" ? "jobDetails" : "educationDetails"] || []).forEach(detail => {
        if (detail?.trim()) {
            resumeDiv.find('ul').append(`<li>${detail}</li>`);
        }
    });
    newCardDiv.find('h5').text(primaryTitle + ",");
    newCardDiv.find('h6').text(secondaryTitle);
    newCardDiv.find('p').text(dateText);
    $(`#${section}-input`).data("storedContentInfo" + editingSectionData, { newCard: newCardDiv, div: resumeDiv, data: newData });
    editingSectionData = null;
}

function preloadFormInputs(editingSectionData, section) {
    let storedData = $(`#${section}-input`).data("storedContentInfo" + editingSectionData);
    if (!storedData || !storedData.data) return;
    $('input, textarea').each(function () {
        let fieldName = $(this).attr('name');

        if (fieldName && storedData.data.hasOwnProperty(fieldName)) {
            let value = storedData.data[fieldName];
            if (Array.isArray(value)) {
                value = value.join('\n');
            }
            $(this).val(value);
        }
    });
}

function discardContentBox(section) {
    let heading = $(`#resume-${section}`);
    if (heading.children().length < 3) {
        heading.remove();
    }
    editingSectionData = null;
}

function deleteContentBox(section) {
    if (editingSectionData) {
        let storedData = $(`#${section}-input`).data("storedContentInfo" + editingSectionData);
        let foundDiv = $(`#resume-${section}`).find(storedData.div);
        if (foundDiv.length) {
            foundDiv.remove();
        }
        let foundCard = $(`#${section}-card-box`).find(storedData.newCard);
        if (foundCard.length) {
            foundCard.remove();
        }
        editingSectionData = null;
    }
}

function getInputDetails(section) {
    let data = {};
    $(`#${section}-container .form-group`).each(function () {
        $(this).find('input, textarea').each(function () {
            let inputElement = $(this);
            if (inputElement.attr('name')) {
                let name = inputElement.attr('name');
                let value = inputElement.is('textarea') ? inputElement.val().split('\n').map(line => line.trim()) : inputElement.val();
                data[name] = value;
            }
        });
    });
    let dateText = "";

    if ((data.startMonth && data.startYear) || (data.jobEndMonth && data.jobEndYear)) {
        dateText = data.startMonth && data.startYear
            ? `${data.startMonth} ${data.startYear}`
            : data.jobEndMonth && data.jobEndYear
                ? `${data.jobEndMonth} ${data.jobEndYear}`
                : "";

        if (data.startMonth && data.startYear && data.endMonth) {
            dateText += ` - ${data.endMonth} ${data.endYear || ''}`;
        }
    }

    if (data["jobTitle"] || data["universityName"]) {
        data["dateText"] = dateText;
    }
    return data;
}

function clearContentInput(section) {
    $(`#${section}-container .form-group`).find("input, textarea, select").val("");
}

/* Add Buttons */

$("#add-experience").on('click', function () {
    let section = "employment";
    clearContentInput(section);
    toggleContentInput(section);
    setSectionHeading(section, "Experience");
})

$("#add-education").on('click', function () {
    let section = "education";
    clearContentInput(section);
    toggleContentInput(section);
    setSectionHeading(section, "Education");
})

$("#add-technical").on('click', function () {
    let section = "technical";
    clearContentInput(section);
    toggleContentInput(section);
    setSectionHeading(section, "Projects");
})

$("#add-additional").on('click', function () {
    let section = "additional";
    clearContentInput(section);
    toggleContentInput(section);
    setSectionHeading(section, "Additional Experience and Awards");
})

$("#add-lang").on('click', function () {
    let section = "lang";
    clearContentInput(section);
    toggleContentInput(section);
    setSectionHeading(section, "Languages and Technologies");
})

/* Save Buttons */

$("#employment-input .input-btns div .save-btn").on('click', function () {
    let section = "employment";
    if (editingSectionData) {
        let newData = getInputDetails(section);
        editContentDetails(newData, section);
        clearContentInput(section);
    } else {
        let newData = getInputDetails(section);
        createNewDetails(newData, section);
        clearContentInput(section);
    }
})

$("#education-input .input-btns div .save-btn").on('click', function () {
    let section = "education";
    if (editingSectionData) {
        let newData = getInputDetails(section);
        editContentDetails(newData, section);
        clearContentInput(section);
    } else {
        let newData = getInputDetails(section);
        createNewDetails(newData, section);
        clearContentInput(section);
    }
})

$("#technical-input .input-btns div .save-btn").on('click', function () {
    let section = "technical";
    if (editingSectionData) {
        let newData = getInputDetails(section);
        editContentDetails(newData, section);
        clearContentInput(section);
    } else {
        let newData = getInputDetails(section);
        createNewDetails(newData, section);
        clearContentInput(section);
    }
})

$("#additional-input .input-btns div .save-btn").on('click', function () {
    let section = "additional";
    if (editingSectionData) {
        let newData = getInputDetails(section);
        editContentDetails(newData, section);
        clearContentInput(section);
    } else {
        let newData = getInputDetails(section);
        createNewDetails(newData, section);
        clearContentInput(section);
    }
})

$("#lang-input .input-btns div .save-btn").on('click', function () {
    let section = "lang";
    if (editingSectionData) {
        let newData = getInputDetails(section);
        editContentDetails(newData, section);
        clearContentInput(section);
    } else {
        let newData = getInputDetails(section);
        createNewDetails(newData, section);
        clearContentInput(section);
    }
})

/* Discard & Delete Buttons */

$("#employment-input .input-btns div .discard-btn").on('click', function (e) {
    discardContentBox("employment");
})

$("#employment-input .input-btns div .del-btn").on('click', function (e) {
    deleteContentBox("employment");
})

$("#education-input .input-btns div .discard-btn").on('click', function (e) {
    discardContentBox("education");
});

$("#education-input .input-btns div .del-btn").on('click', function (e) {
    deleteContentBox("education");
});

$("#technical-input .input-btns div .discard-btn").on('click', function (e) {
    discardContentBox("technical");
});

$("#technical-input .input-btns div .del-btn").on('click', function (e) {
    deleteContentBox("technical");
});

$("#additional-input .input-btns div .discard-btn").on('click', function (e) {
    discardContentBox("additional");
});

$("#additional-input .input-btns div .del-btn").on('click', function (e) {
    deleteContentBox("additional");
});

$("#lang-input .input-btns div .discard-btn").on('click', function (e) {
    discardContentBox("lang");
});

$("#lang-input .input-btns div .del-btn").on('click', function (e) {
    deleteContentBox("lang");
});