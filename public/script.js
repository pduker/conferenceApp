//const alert = require('alert');
let numAuthors = 1;
let numMaterials = 1;

/**
 * This validates that every input field is filled with proper values and returns a boolean value
 * @param {FormData} FormData 
 * @returns {boolean} Returns true if the validation passes, false otherwise
 */
function paperFormValidation(FormData) {
    let hasEverything = true;
    for (let [name, value] of FormData) {
        if (!name.includes("bio") && !name.includes("material")) {
            if (!isNotWhiteSpace(value)) {
                hasEverything = false;
                break;
            }
        }
    }
    return hasEverything;
}


/**
 * this function checks if the input is not just spaces, if it is undefined or null, and if it is the abstract is of size 0
 * @param {*} text this is the inputs from FormData feed in one at a time
 * @returns {boolean} returns true if not just spaces, not undefined or null , and is not of size 0 when it is a object
 */
function isNotWhiteSpace(text) {
    let hasEverything = /\S/.test(text) && isNotUndefinedOrNull(text)
    if (typeof text === "object") {
        if (text.size === 0) {
            hasEverything = false;
        }
    }
    return hasEverything;
}

/**
 * this returns true if it is not undefined and null
 * @param {*} text this is the input from FormData feed in one at a time
 * @returns {boolean} This reutrns true if the argument is not undefined or null
 */
function isNotUndefinedOrNull(text) {
    return text !== undefined && text !== null
}

/**
 * Sends the paper submission via POST request to /api/papers/
 */
async function sendPaper() {
    let formData = new FormData(document.querySelector('#submission'));
    let submissionResponse = await fetch('api/papers', {
        method: 'POST',
        body: formData
    });

    return submissionResponse;
}

/**
 * Sends the abstract via POST request to /api/papers/abstract
 */
async function sendAbstract(){
    const formData = new FormData(document.querySelector('#submission'))
    for (let i = 0; i < numMaterials; i++){
        formData.delete(`material-type-${i}`);
        formData.delete(`material-${i}`);
    }
    if(!formData.get("abstract").size == 0){
        const abstractResponse = await fetch('api/papers/abstract', {
            method: 'POST',
            body: formData
        });
        return await abstractResponse.json();
    }
}

/** 
 * Sends abstract to server
 */
$('#submit-abstract').on('click', async function (e) {
    e.preventDefault();

    const abstractHTML = await sendAbstract();
    if (isNotUndefinedOrNull(abstractHTML)) {
        $('#abstract-preview')[0].innerHTML = `<summary>Abstract</summary>${abstractHTML.html}`;
        $(`#uploadAbstract`)[0].classList.remove('is-invalid');
    }
});


/**
 * Sends all data to server
 */
$('#submit-paper').on('click', async function (e) {

    e.preventDefault();

    const form = $('#submission')[0]
    const alert = $("#Success-Alert")
    alert.hide()
    alert.removeClass("alert-success alert-warning alert-error")

    if (form.checkValidity() === false) {
        alert.addClass("alert-warning")
        alert.text("Please make sure all required fields are filled")
        alert.show()
    } else {
        //const formData = new FormData($('#submission')[0])
        const paperResponse = await sendPaper();
        if (paperResponse?.ok) {
            alert.addClass("alert-success")
            alert.text("Paper submission successful!")
            alert.show()
        } else {
            alert.addClass("alert-error")
            alert.text("Paper submission failed! Please try again")
            alert.show()
        }
    }

    let invalidGroup = $(':invalid');
    for (let i = 0; i < invalidGroup.length; i++) {
        invalidGroup[i].classList.add('is-invalid');
    }

    //form.classList.add('was-validated')

});


/**
 * Add inputs to paper form for entering information for an additional author 
 */
$('#add-author').on('click', function (e) {
    e.preventDefault();
    numAuthors++;
    $('#remove-author')[0].style = '';


    $('#authors').append(
        `<label class="form-label">Author ${numAuthors}</label>
        <div class="input-group mb-3">
            <span class="input-group-text">Name</span>
            <input type="text" class="form-control validate-me" id="name-${numAuthors - 1}" name="name-${numAuthors - 1}" required>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Institution</span>
            <input type="text" class="form-control validate-me" id="institution-${numAuthors - 1}" name="institution-${numAuthors - 1}" required>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Bio</span>
            <textarea class="form-control" id="bio-${numAuthors - 1}" name="bio-${numAuthors - 1}" ></textarea>
        </div>`
    );

    $('#authors-preview').prepend(`<p class="author" id="author-${numAuthors - 1}-preview">AUTHOR NAME (Institution)</p>`);
    $(`#author-${numAuthors - 1}-preview`).insertAfter($(`#author-${numAuthors - 2}-preview`));
    authorPreviewListeners(numAuthors - 1);

});


/**
 * Add inputs to materials form for uploading an additional document 
 */
$('#add-document').on('click', function (e) {
    e.preventDefault();
    numMaterials++;
    $('#remove-document')[0].style = '';

    $('#materials').append(
        `<div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Material Type (e.g Handout, Slides, Script)" id="materialType-${numMaterials - 1}" name="material-type-${numMaterials - 1}">
        <input type="file" class="form-control" id="uploadMaterial-${numMaterials - 1}" name="material-${numMaterials - 1}">
    </div>`
    );

    materialPreviewListeners(numMaterials - 1);
});

/**
 * Remove the last supplementary material input
 */
$('#remove-document').on('click', function (e) {
    e.preventDefault();
    numMaterials--;
    $('#materials')[0].children[numMaterials].remove();

    if (numMaterials == 1)
        $('#remove-document')[0].style = 'display:none';
});

/**
 * Remove the last author input
 */
$('#remove-author').on('click', function (e) {
    e.preventDefault();
    numAuthors--;

    $(`#author-${numAuthors}-preview`)[0].remove()

    // remove all 4 elements of author
    // (header, name, institution, bio)
    for (let i = 0; i < 4; i++)
        $('#authors')[0].children[numAuthors * 4].remove();

    if (numAuthors == 1)
        $('#remove-author')[0].style = 'display:none';
});

/** 
 * Listener for live updating preview with title
 */
$('#title').on('input', function (e) {
    $(`#title`)[0].classList.remove('is-invalid');
    $('#title-preview')[0].innerHTML = e.currentTarget.value;
});

/** 
 * Listeners for live updating preview with material information
 */
function materialPreviewListeners(num) {
    $(`#materialType-${num}`).on('input', function (e) {
        $('#materials-preview')[0].style.display = '';
        if ($(`#material-${num}-preview`).length)
            $(`#material-${num}-preview`)[0].innerHTML = `<a href="#">${e.currentTarget.value}</a>`;
        else
            $('#materials-list-preview').append(`<li id="material-${num}-preview"><a href="#">${e.currentTarget.value}</a></li>`);
    });

} materialPreviewListeners(0);

/** 
 * Listeners for live updating preview with author information
 */
function authorPreviewListeners(num) {
    $(`#name-${num}`).on('input', function (e) {
        $(`#name-${num}`)[0].classList.remove('is-invalid');

        let institution = $(`#author-${num}-preview`)[0].innerHTML.split('(')[1];
        $(`#author-${num}-preview`)[0].innerHTML = `${e.currentTarget.value} (${institution}`;
    });

    $(`#institution-${num}`).on('input', function (e) {
        $(`#institution-${num}`)[0].classList.remove('is-invalid');

        let name = $(`#author-${num}-preview`)[0].innerHTML.split('(')[0];
        $(`#author-${num}-preview`)[0].innerHTML = `${name}(${e.currentTarget.value})`;
    });

    $(`#bio-${num}`).on('input', function (e) {
        // if bio element already exists, edit data in element
        if ($(`#bio-${num}-preview`).length) {
            // remove element if bio is empty
            if (!e.currentTarget.value)
                $(`#bio-${num}-preview`).remove();
            else
                $(`#bio-${num}-preview`)[0].innerHTML = `<summary>bio for ${$(`#name-${num}`)[0].value}</summary><p>${e.currentTarget.value}</p>`
        } else {
            // create bio element if it does not exist  
            $('#bios-preview').prepend(`
                <details id="bio-${num}-preview"><summary>bio for ${$(`#name-${num}`)[0].value}</summary><p>${e.currentTarget.value}</p></details>
            `);
        }
    });
} authorPreviewListeners(0);