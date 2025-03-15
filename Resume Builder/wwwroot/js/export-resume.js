function exportResume() {
    const data = prepareResume();
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: '/Index?handler=ExportPdf',
        contentType: "application/json",
        headers: {
            "RequestVerificationToken": $("input:hidden[name='__RequestVerificationToken']").val()
        },
        success: function (response) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Generated.pdf';
            link.click();
        },
        error: function (error) {
            console.error("Error:", error);
        },
        xhrFields: {
            responseType: 'blob'
        }
    })
}

function prepareResume() {
    const resumeContent = document.getElementById("resume-content");
    const resumeCopy = resumeContent.cloneNode(true);
    resumeCopy.querySelectorAll("h6, li").forEach(el => {
        el.style.fontSize = "1.5em";
    })
    resumeCopy.querySelectorAll("span").forEach(el => {
        el.style.fontSize = "1.45em";
    })
    resumeCopy.querySelectorAll("p").forEach(el => {
        el.style.fontSize = "1.5em";
    })
    resumeCopy.querySelectorAll("h2").forEach(el => {
        el.style.fontSize = "2.6em";
    })
    resumeCopy.querySelectorAll("hr").forEach(el => {
        el.style.height = '1px';
        el.style.border = '0';
        el.style.backgroundColor = '#000';
    })
    resumeCopy.querySelectorAll("ul").forEach(el => {
        el.style.margin = "0px";
    })
    resumeCopy.querySelectorAll(".resume-section").forEach(el => {
        el.style.marginBottom = "20px";
    });
    resumeCopy.querySelectorAll("h6, li, p, h2").forEach(el => {
        el.style.fontFamily = "'Calibri', 'Arial', serif";
        el.style.fontWeight = "300";
    });
    return resumeCopy.outerHTML;
}

const exportButton = document.getElementById("export-btn");

exportButton.addEventListener("click", () => {
    exportResume();
});