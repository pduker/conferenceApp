
let numAuthors = 1;
let numMaterials = 1;

/**
 * Sends the paper submission via POST request to PAPER_API_LINK
 */
async function sendPaper(){
    const submissionResponse = await fetch('/test', {
        method: 'POST',
        body: new FormData(document.querySelector('#submission')),
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    })
}

/**
 * Sends the materials submission via POST request to MATERIALS_API_LINK
 */
async function sendMaterials(){
    const materialSubmissionResponse = await fetch('/test', {
        method: 'POST',
        body: new FormData(document.querySelector('#materials-submission')),
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    })
}

/**
 * Sends all data to server
 * Generates a preview of the submission (TODO) 
 */
$('#preview').on('click', function(e){
    e.preventDefault();

    sendPaper();
    sendMaterials();

    // TODO : generate preview html
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

});