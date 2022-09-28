let data = {
    authors: [],
    title: '',
    handouts: [],
    abstractFile: ''
}

let numAuthors = 1;
let numMaterials = 1;

$('#preview').on('click', function(e){
    e.preventDefault();

    for(let i = 0; i < numAuthors; i++){
        let name = $(`#name-${i}`)[0].value;
        let institution = $(`#institution-${i}`)[0].value;
        let bio = $(`#bio-${i}`)[0].value;
        data.authors.push({
            name: name,
            institution: institution,
            bio: bio
        });
    }

    for(let i = 0; i < numMaterials; i++){
        let materialType = $(`#materialType-${i}`)[0].value;
        let materialFile = $(`#uploadHandout-${i}`)[0].files[0];
        if(materialType && materialFile){
            data.handouts.push({
                type: materialType,
                file: materialFile
            });
        }
    }

    data.title = $('#title')[0].value;
    data.abstractFile = $('#uploadAbstract')[0].files[0];

    console.log(data);

});


$('#add-author').on('click', function(e){
    e.preventDefault();
    numAuthors++;

    $('#authors').append(
        `<label class="form-label">Author ${numAuthors}</label>
        <div class="input-group mb-3">
            <span class="input-group-text">Name</span>
            <input type="text" class="form-control" id="name-${numAuthors-1}">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Institution</span>
            <input type="text" class="form-control" id="institution-${numAuthors-1}">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Bio</span>
            <textarea class="form-control" id="bio-${numAuthors-1}" ></textarea>
        </div>`
    );

});


$('#add-document').on('click', function(e){
    e.preventDefault();
    numMaterials++;

    $('#materials').append(
        `<div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Material Type (e.g Handout, Slides, Script)" id="materialType-${numMaterials-1}">
        <input type="file" class="form-control" id="uploadHandout-${numMaterials-1}">
    </div>`
    );

});