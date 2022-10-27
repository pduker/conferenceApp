//const alert = require('alert');
let numAuthors = 1;
let numMaterials = 1;

/**
 * This validates that every input field is filled with proper values and returns a boolean value
 * @param {FormData} FormData 
 * @returns {boolean} Returns true if the validation passes, false otherwise
 */
function paperFormValidation(FormData){
    let hasEverything = true;
    for(let [name, value] of FormData) {   
        if(!name.includes("bio") && !name.includes("material") ){
            if(!isNotWhiteSpace(value)){
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
function isNotWhiteSpace (text) {
    let hasEverything = /\S/.test(text) && isNotUndefinedOrNull(text)
    if(typeof text === "object"){
        if(text.size === 0){
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
function isNotUndefinedOrNull (text) {
  return text !== undefined && text !== null
}

/**
 * Sends the paper submission via POST request to /api/papers/
 */
async function sendPaper(formData){
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
    let tempFormData = new FormData(document.querySelector('#submission'))
    if(!tempFormData.get("abstract").size == 0){
        const abstractResponse = await fetch('api/papers/abstract', {
            method: 'POST',
            body: tempFormData
        });
        return await abstractResponse.json();
    }
}

/**
 * Sends the materials submission via POST request to /api/papers/materials/
 */
async function sendPaperMaterials(){
    let tempFormData = new FormData(document.querySelector('#materials-submission'))
    if(paperFormValidation(tempFormData)){
        const materialSubmissionResponse = await fetch('/api/papers/materials', {
            method: 'POST',
            body: tempFormData
        })
    }
}

/** 
 * Sends abstract to server
 */
$('#submit-abstract').on('click', async function(e){
    e.preventDefault();
    
    const abstractHTML = await sendAbstract();
    if(isNotUndefinedOrNull(abstractHTML)){
        $('#abstract-preview')[0].innerHTML = `<summary>Abstract</summary>${abstractHTML.html}`;
    }
});


/**
 * Sends all data to server
 */
 $('#submit-paper').on('click', async function(e){
    e.preventDefault();

    const alert = $("#Success-Alert")
    alert.hide()
    alert.removeClass("alert-success alert-warning alert-error")

    const formData = new FormData(document.querySelector('#submission'))
    if(paperFormValidation(formData)){
        const paperResponse = await sendPaper(formData);
        //const materialsResponse = await sendPaperMaterials();
        if(paperResponse?.ok){
            alert.addClass("alert-success")
            alert.text("Paper submission successful!")
            alert.show()
        } else {
            alert.addClass("alert-error")
            alert.text("Paper submission failed! Please try again")
            alert.show()
        }
    } else {
        alert.addClass("alert-warning")
        alert.text("Please make sure all required fields are filled")
        alert.show()
    }
});


/**
 * Add inputs to paper form for entering information for an additional author 
 */
$('#add-author').on('click', function(e){
    e.preventDefault();
    numAuthors++;

    $('#authors').append(
        `<label class="form-label">Author ${numAuthors}</label>
        <div class="input-group mb-3">
            <span class="input-group-text">Name</span>
            <input type="text" class="form-control" id="name-${numAuthors-1}" name="name-${numAuthors-1}">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Institution</span>
            <input type="text" class="form-control" id="institution-${numAuthors-1}" name="institution-${numAuthors-1}">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Bio</span>
            <textarea class="form-control" id="bio-${numAuthors-1}" name="bio-${numAuthors-1}" ></textarea>
        </div>`
    );

    $('#authors-preview').prepend(`<p class="author" id="author-${numAuthors-1}-preview">AUTHOR NAME (Institution)</p>`);
    $(`#author-${numAuthors-1}-preview`).insertAfter($(`#author-${numAuthors-2}-preview`));
    authorPreviewListeners(numAuthors-1);

});


/**
 * Add inputs to materials form for uploading an additional document 
 */
$('#add-document').on('click', function(e){
    e.preventDefault();
    numMaterials++;

    $('#materials').append(
    `<div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Material Type (e.g Handout, Slides, Script)" id="materialType-${numMaterials-1}" name="material-type-${numMaterials-1}">
        <input type="file" class="form-control" id="uploadMaterial-${numMaterials-1}" name="material-${numMaterials-1}">
    </div>`
    );

    materialPreviewListeners(numMaterials - 1);

});

/** 
 * Listener for live updating preview with title
 */
$('#title').on('input', function(e){
    $('#title-preview')[0].innerHTML = e.currentTarget.value;
});

/** 
 * Listeners for live updating preview with material information
 */
function materialPreviewListeners(num){
    $(`#materialType-${num}`).on('input', function(e){
        $('#materials-preview')[0].style.display = '';
        if ($(`#material-${num}-preview`).length)
            $(`#material-${num}-preview`)[0].innerHTML = `<a href="">${e.currentTarget.value}</a>`;
        else
            $('#materials-list-preview').append(`<li id="material-${num}-preview"><a href="">${e.currentTarget.value}</a></li>`);
    });

} materialPreviewListeners(0);

/** 
 * Listeners for live updating preview with author information
 */
function authorPreviewListeners(num){
    $(`#name-${num}`).on('input', function(e){
        let institution = $(`#author-${num}-preview`)[0].innerHTML.split('(')[1];
        $(`#author-${num}-preview`)[0].innerHTML = `${e.currentTarget.value} (${institution}`;
    });
    
    $(`#institution-${num}`).on('input', function(e){
        let name = $(`#author-${num}-preview`)[0].innerHTML.split('(')[0];
        $(`#author-${num}-preview`)[0].innerHTML = `${name}(${e.currentTarget.value})`;
    });
    
    $(`#bio-${num}`).on('input', function(e){
        // if bio element already exists, edit data in element
        if($(`#bio-${num}-preview`).length){
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