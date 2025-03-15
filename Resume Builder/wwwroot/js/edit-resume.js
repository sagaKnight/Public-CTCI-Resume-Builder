let savedPersonalData = {};
let editingSectionData = null;
let dataCounter = 0;
let resumeInputs = {};

/* Personal Section */
$("#personal-wrapper").on('click', function () {
    savedPersonalData = getPersonalDetails();
})

$("#personal-input .form-group input").on('input', function () {
    let tempData = getPersonalDetails();
    writePersonalDetails(tempData);
});

$("#personal-discard").on('click', function (e) {
    writePersonalDetails(savedPersonalData);
    getPersonalDetails();
    togglePersonalSection();
    rewritePersonalDetails();
})

$("#personal-save").on('click', function (e) {
    let newData = getPersonalDetails();
    savePersonalData(newData);
    togglePersonalSection();
});

function savePersonalData(data) {
    writePersonalDetails(data);
    savedPersonalData = {};
    removePlaceholderClass();
    saveJSONInput("personal", data);
}

function getPersonalDetails() {
    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let address = $("#address").val();
    let pNumber = $("#pNumber").val();
    let email = $("#email").val();
    let linkedIn = $("#linkedIn").val();
    let extraLink = $("#extraLink").val();

    let data = {
        fName,
        lName,
        address,
        pNumber,
        email,
        linkedIn,
        extraLink,
    };
    return data;
}
function removePlaceholderClass() {
    const placeholders = ["Address", "Your Name", "Email", "Phone Number"];

    $('#personal-wrapper').children().each(function () {
        const textValue = $(this).text().trim();
        if (!placeholders.includes(textValue)) {
            $(this).removeClass('grey-text');
        } else {
            $(this).addClass('grey-text');
        }
    });
}

function writePersonalDetails(data) {
    $("#resume-page-heading h2").text(data.fName + " " + data.lName);
    $("#resume-page-heading div:nth-of-type(1)").html('<span>' + data.address + '</span>');
    $("#resume-page-heading div:nth-of-type(2)").addClass("contact-info");
    let contactHtml = '';

    contactHtml += '<span style="margin-right: 10px;">' + data.email + '</span>';
    contactHtml += '<span style="margin-right: 10px;">|</span>';
    contactHtml += '<span style="margin-right: 10px;">' + data.pNumber + '</span>';
    if (data.linkedIn && data.linkedIn.trim() !== "") {
        const linkedInUrl = data.linkedIn.startsWith('http') ? data.linkedIn : 'https://' + data.linkedIn;
        const linkedInDisplay = data.linkedIn.replace('https://', '').replace('www.', '');
        contactHtml += '<span style="margin-right: 10px;">|</span>';
        contactHtml += '<span><a href="' + linkedInUrl + '" target="_blank">' + linkedInDisplay + '</a></span>';
    }

    if (data.extraLink && data.extraLink.trim() !== "") {
        contactHtml += '<span style="margin-right: 10px; margin-left: 10px;">|</span>';
        if (!data.extraLink.includes("www.")) {
            contactHtml += '<span><a href="https://' + data.extraLink + '" target="_blank">' + data.extraLink + '</a></span>';
        } else {
            contactHtml += '<span>' + data.extraLink + '</span>';
        }
    }

    $("#resume-page-heading div:nth-of-type(2)").html(contactHtml);

    $("#personal-wrapper h5").text(
        data.fName || data.lName ? (data.fName || "") + " " + (data.lName || "") : "Your Name"
    );

    $("#personal-wrapper p:nth-of-type(1)").text(data.address || "Address");
    $("#personal-wrapper p:nth-of-type(2)").text(data.email || "Email");
    $("#personal-wrapper p:nth-of-type(3)").text(data.pNumber || "Phone Number");
}

function rewritePersonalDetails() {
    $("#fName").val(savedPersonalData.fName);
    $("#lName").val(savedPersonalData.lName);
    $("#address").val(savedPersonalData.address);
    $("#pNumber").val(savedPersonalData.pNumber);
    $("#email").val(savedPersonalData.email);
    $("#linkedIn").val(savedPersonalData.linkedIn);
    $("#extraLink").val(savedPersonalData.extraLink);
    savedPersonalData.contactText = savedPersonalData.email + " | " + savedPersonalData.pNumber;
    if (savedPersonalData.extraLink) {
        savedPersonalData.contactText += " | " + savedPersonalData.extraLink;
    }
    savedPersonalData = {};
}

/* Content Functions */
function toggleContentInput(section) {
    $(`#${section}-header`).addClass('hidden');
    $(`#${section}-input`).removeClass('hidden');
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
    updateDataCounter(section);
    if (section === "employment" || section === "education") {
        createDatedDetails(data, section);
    } else if (section === "technical" || section === "additional") {
        createUndatedDetails(data, section);
    } else {
        createLangDetails(data, section);
    }
}

function updateDataCounter(section) {
    if (!resumeInputs[section]) {
        dataCounter = 0;
    } else {
        dataCounter = resumeInputs[section].length;
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
    editingSectionData = value;
}

function createUndatedDetails(data, section) {
    let newDiv = $('<div></div>').addClass('resume-section');
    // Create the title, languages, and repo link section
    let titleDiv = $('<div></div>').addClass('undated-title-info');
    let languages = data.technologiesUsed || '';
    let repoLink = data.repoLink ? `<a href="${data.repoLink}" target="_blank">Link</a>` : '';

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
    editingSectionData = value;
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
        <h6 style="margin: 0px; width: 27%; text-align: right;"><strong>${data.dateText || ""}</strong></h6>
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
    editingSectionData = value;
}

function editContentDetails(overwriteData, section, isSave) {
    let storedData = $(`#${section}-input`).data("storedContentInfo" + editingSectionData);
    if (section === "employment" || section === "education") {
        editDatedDetails(overwriteData, section, storedData, isSave);
    } else if (section === "technical" || section === "additional") {
        editUndatedDetails(overwriteData, section, storedData, isSave);
    } else {
        editLangDetails(overwriteData, section, storedData, isSave);
    }
}

function editLangDetails(newData, section, storedData, isSave) {
    let resumeDotpoints = storedData.div;
    let newCardDiv = storedData.newCard;
    resumeDotpoints.empty();
    let ul = $('<ul></ul>');
    newData.langTech.forEach(line => {
        let li = $(`<li>${line}</li>`);
        ul.append(li);
    });
    resumeDotpoints.append(ul);
    newCardDiv.find('h5').text(newData.langTech[0].length > 20 ? newData.langTech[0].slice(0, 20) + '...' : newData.langTech[0]);
    if (isSave) {
        $(`#${section}-input`).data("storedContentInfo" + editingSectionData, { newCard: newCardDiv, div: resumeDotpoints, data: newData });
    }
    if (isSave && (resumeDotpoints.length === 0 || newData.langTech[0].length <= 1)) {
        deleteContentBox(section);
    }
}

function editUndatedDetails(newData, section, storedData, isSave) {
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
            ${newData.repoLink ? `<p style="display:inline-block; margin: 0"> | <a href="${newData.repoLink}" target="_blank">Link</a></p>` : ''}
        `);
        descDiv.html(ul);
    } else {
        titleDiv.html(`
            <h6 class="d-inline"><strong>${newData.additionalTitle || ''}</strong></h6>
        `);
        descDiv.html(ul);
    }
    newCardDiv.find('h5').text(newData.projectTitle || newData.additionalTitle);
    if (isSave) {
        $(`#${section}-input`).data("storedContentInfo" + editingSectionData, { newCard: newCardDiv, div: storedData.div, data: newData });
    }
    if (descriptions[0].length <= 1 && isSave) {
        if ((section === "technical" && (!newData.projectTitle || newData.projectTitle.length === 1 || !newData.technologiesUsed
            || newData.technologiesUsed === 1 || newData.repoLink === 1 || !newData.repoLink)) ||
            (section === "additional" && (!newData.additionalTitle || newData.additionalTitle.length === 1))) {
            deleteContentBox(section);
        }
    }
}

function editDatedDetails(newData, section, storedData, isSave) {
    let resumeDiv = storedData.div;
    let newCardDiv = storedData.newCard;
    let primaryTitle = section === "employment" ? newData.jobTitle : newData.universityLocation || "";
    let secondaryTitle = section === "employment" ? newData.companyName : newData.universityName || "";
    let dateText = newData.dateText || "";
    resumeDiv.find('.resume-section-header h6:nth-child(1) strong').text(primaryTitle || "");
    resumeDiv.find('.resume-section-header h6:nth-child(2) strong').text(secondaryTitle || "");
    resumeDiv.find('.resume-section-header h6:nth-child(3) strong').text(dateText || "");
    resumeDiv.find('ul').empty();
    let dotpointData = newData[section === "employment" ? "jobDetails" : "educationDetails"] || [];
    dotpointData.forEach(detail => {
        if (detail?.trim()) {
            resumeDiv.find('ul').append(`<li>${detail}</li>`);
        }
    });
    newCardDiv.find('h5').text(primaryTitle || "" + ",");
    newCardDiv.find('h6').text(secondaryTitle || "");
    newCardDiv.find('p').text(dateText || "");
    if (isSave) {
        $(`#${section}-input`).data("storedContentInfo" + editingSectionData, { newCard: newCardDiv, div: resumeDiv, data: newData });
    }
    if (dotpointData && dotpointData[0] && dotpointData[0].length <= 1 && isSave || dotpointData.length === 1 && dotpointData[0].length <= 1 && isSave) {
        if ((!primaryTitle || primaryTitle.length <= 1) &&
            (!secondaryTitle || secondaryTitle.length <= 1) &&
            (!dateText || dateText.length <= 1)) {
            deleteContentBox(section);
        }
    }
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
    if (editingSectionData !== null && editingSectionData >= 0) {
        let oldData = $(`#${section}-input`).data("storedContentInfo" + editingSectionData);
        clearContentInput(section);
        editContentDetails(oldData.data, section, true);
    }
    removeHeading(section)
    editingSectionData = null;
}

function removeHeading(section) {
    let heading = $(`#resume-${section}`);
    if (heading.children().length < 3) {
        heading.remove();
    }
}

function deleteContentBox(section) {
    if (editingSectionData !== null && editingSectionData >= 0) {
        let storedData = $(`#${section}-input`).data("storedContentInfo" + editingSectionData);
        deleteJSONInput(section, storedData.data);
        let foundDiv = $(`#resume-${section}`).find(storedData.div);
        if (foundDiv.length) {
            foundDiv.remove();
        }
        let foundCard = $(`#${section}-card-box`).find(storedData.newCard);
        if (foundCard.length) {
            foundCard.remove();
        }
        removeHeading(section);
        clearContentInput(section);
        toggleContentInput(section);
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
function saveDataDetails(data, section, isSave) {
    if (editingSectionData !== null && editingSectionData >= 0) {
        editContentDetails(data, section, isSave);
    } else {
        createNewDetails(data, section);
    }
    if (isSave) {
        saveJSONInput(section, data);
        editingSectionData = null;
        clearContentInput(section);
    }
}

$("#employment-input .input-btns div .save-btn").on('click', function () {
    let section = "employment";
    let newData = getInputDetails(section);
    saveDataDetails(newData, section, true);
})

$("#education-input .input-btns div .save-btn").on('click', function () {
    let section = "education";
    let newData = getInputDetails(section);
    saveDataDetails(newData, section, true);
})

$("#technical-input .input-btns div .save-btn").on('click', function () {
    let section = "technical";
    let newData = getInputDetails(section);
    saveDataDetails(newData, section, true);
})

$("#additional-input .input-btns div .save-btn").on('click', function () {
    let section = "additional";
    let newData = getInputDetails(section);
    saveDataDetails(newData, section, true);
})

$("#lang-input .input-btns div .save-btn").on('click', function () {
    let section = "lang";
    let newData = getInputDetails(section);
    saveDataDetails(newData, section, true);
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

/* Live Preview Event Listeners */

$("#employment-input .form-group input, #employment-input .form-group textarea").on('input', function () {
    let section = "employment";
    let newData = getInputDetails(section);
    saveDataDetails(newData, section);
});

$("#education-input .form-group input, #education-input .form-group textarea").on('input', function () {
    let section = "education";
    let newData = getInputDetails(section);
    saveDataDetails(newData, section);
});

$("#technical-input .form-group input, #technical-input .form-group textarea").on('input', function () {
    let section = "technical";
    let newData = getInputDetails(section);
    saveDataDetails(newData, section);
});

$("#additional-input .form-group input, #additional-input .form-group textarea").on('input', function () {
    let section = "additional";
    let newData = getInputDetails(section);
    saveDataDetails(newData, section);
});

$("#lang-input .form-group textarea").on('input', function () {
    let section = "lang";
    let newData = getInputDetails(section);
    saveDataDetails(newData, section);
});

/* JSON Functions */

function saveJSONInput(section, data) {
    if (section === "personal") {
        resumeInputs[section][0] = data;
        return;
    }
    let isOverwrite = resumeInputs[section]?.[editingSectionData] != null;
    if (!resumeInputs[section]) {
        resumeInputs[section] = [];
    }
    if (isOverwrite) {
        resumeInputs[section][editingSectionData] = data;
    } else {
        const shouldPush = Object.values(data).some(value => value.length > 1) && !resumeInputs[section].find(existingData => existingData === data);
        if (shouldPush) {
            resumeInputs[section].push(data);
        }
    }
}

function deleteJSONInput(section, data) {
    if (!resumeInputs[section]) {
        return
    }
    const indexFound = resumeInputs[section].findIndex(item =>
        Object.entries(data).every(([key, value]) => item[key] === value)
    );
    if (indexFound >= 0) {
        resumeInputs[section].splice(indexFound, 1);
    }
}

function importJSONInput() {
    $.each(resumeInputs, function (section, data) {
        if (section === "personal") {
            $.each(data, function (i, personalData) {
                savedPersonalData = personalData;
                rewritePersonalDetails();
                savePersonalData(personalData);
            });
        } else if (section === "employment" || section === "education") {
            $.each(data, function (i, datedData) {
                if (section === "employment") {
                    setSectionHeading(section, "Experience");
                } else {
                    setSectionHeading(section, "Education");
                }
                saveDataDetails(datedData, section, true);

            });
        } else if (section === "technical" || section === "additional") {
            $.each(data, function (i, undatedData) {
                if (section === "technical") {
                    setSectionHeading(section, "Projects");
                } else {
                    setSectionHeading(section, "Additional Experience and Awards");
                }
                saveDataDetails(undatedData, section, true);
            });
        } else if (section === "lang") {
            setSectionHeading(section, "Languages and Technologies");
            $.each(data, function (i, langData) {
                saveDataDetails(langData, section, true);
            });
        };
    });
}

function clearAllData() {
    document.getElementById("resume-view").innerHTML = `
        <div id="resume-page" style="box-shadow: 0px 3px 15px rgba(0,0,0,0.2); border: 1px #d3d3d3 solid; background: white; width: 210mm; height: 297mm; overflow: auto; position: absolute; padding: 20px; font-family: 'Garamond'; padding: 1.2cm;">
            <div id="resume-content">
                <div id="resume-page-heading" style="display: flex; align-items: center; justify-content: space-between; flex-direction: column;">
                    <h2 style="width: 100%; text-align: center; margin: 0;"></h2>
                    <div style="margin: 3px; text-align: center;"></div>
                    <div style="margin: 3px; text-align: center; margin-bottom: 5px;"></div>
                </div>
            </div>
        </div>
    `;
    const contentCards = document.querySelectorAll(".content-card-info");
    contentCards.forEach(card => card.remove());
    dataCounter = 0;
    editingSectionData = null;
    savedPersonalData = {};
    resumeInputs = {};
}

$("#exportJSON-btn").on("click", function () {
    const jsonData = JSON.stringify(resumeInputs);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.json';
    $('body').append(link);
    link.click();
    $(link).remove();
})

$("#importJSON-btn").on("click", function () {
    $('#jsonInput').slideDown("slow");
    $('#jsonInput').parent().toggleClass("hidden");
})

$("#jsonInput").on("change", function (e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                clearAllData();
                resumeInputs = JSON.parse(e.target.result);  // Parse the JSON 
                $("#jsonInput").val('');
                $('#jsonInput').parent().toggleClass("hidden");
                importJSONInput();
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);  // Read the file as text
    } else {
        console.error('Please select a valid JSON file.');
    }
})

