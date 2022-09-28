
let abstractFile;
let numAuthors = 1;
let authors = [];
let title;
let handouts = [];

$('#preview').on('click', function(e){
    e.preventDefault();

    for(let i = 0; i < numAuthors; i++){
        let name = $(`#name-${i}`)[0].value;
        let institution = $(`#institution-${i}`)[0].value;
        let bio = $(`#bio-${i}`)[0].value;
        authors.push({
            name: name,
            institution: institution,
            bio: bio
        });
    }

    title = $('#title')[0].value;
    abstractFile = $('#uploadAbstract')[0].files[0];

    console.log(authors);

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