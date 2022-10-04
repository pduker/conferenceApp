
let numAuthors = 1;
let numMaterials = 1;

/**
 * Sends the paper submission via POST request to /api/papers/
 */
async function sendPaper(){
    const submissionResponse = await fetch('/api/papers', {
        method: 'POST',
        body: new FormData(document.querySelector('#submission'))
    });

    return await submissionResponse.json(); 
}

/**
 * Sends the materials submission via POST request to /api/papers/materials/
 */
async function sendPaperMaterials(){
    const materialSubmissionResponse = await fetch('/api/papers/materials', {
        method: 'POST',
        body: new FormData(document.querySelector('#materials-submission'))
    })
}

/*
 * Generates HTML to preview paper submission
 */
function generatePreview(paper, materials){

    let content = `<p class="title">${paper.title}</p>`;
    for(let author of Object.values(paper.authors)){
        content += `<div>
            <p class="author">${author.author}</p>
            <details><summary>bio for ${author.author}</summary><p>${author.bio}</p></details>
        </div>`;
    }

    content += `<details class="root"><summary>Abstract</summary>${paper.html}</details>`
    
    // MATERIALS NOT IMPLEMENTED YET
    // content += `<details class="root"><summary>Supplementary Material(s)</summary>
    //     <ul class="handouts">`;
    // for(let material of Object.values(materials)){
    //     content += `<li><a href="">${materials[i].type}</a></li>`;
    // }
    // content += `
    //     </ul>
    //     </details>`;

    $('#preview')[0].innerHTML = content;
    
}

/**
 * Sends all data to server
 * Generates a preview of the submission (TODO) 
 */
$('#submit-preview').on('click', async function(e){
    e.preventDefault();

    const paperResponse = await sendPaper();
    //const materialsResponse = await sendPaperMaterials();

    // TODO : generate preview html
    generatePreview(paperResponse, '');
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