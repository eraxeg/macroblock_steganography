// https://codepen.io/dcode-software/pen/xxwpLQo

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });

    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
    });

    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    });

    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });

    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }

        dropZoneElement.classList.remove("drop-zone--over");
    });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");
        thumbnailElement.classList.add("thumb");
        dropZoneElement.appendChild(thumbnailElement);
    }


    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        const updateImage = function(j, reader) {
            try {
                j.load(reader.result)
                thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
                thumbnailElement.dataset.label = file.name;
            }
            catch(err) {
                console.log(err)
                window.alert('Image is too large to process! Please resize it and try again.')
            }
        }

        reader.onload = () => {
            thumbnailElement.style.backgroundSize = "contain";
            thumbnailElement.style.backgroundRepeat = "no-repeat";
            thumbnailElement.style.backgroundPosition = "center";

            if (thumbnailElement.parentElement.id == "decode-drop-zone") {
                var j = new JpegImage();
                j.onload = function () {
                    var textElem = document.getElementById("decoded-text");
                    textElem.textContent = j.getMessage();
                };
                updateImage(j, reader)
            }
            else if (thumbnailElement.parentElement.id == "encode-drop-zone") {
                var j = new JpegImage();
                j.onload = function () {
                    readfile(file);
                    var textElem = document.getElementById("encoder-decoded-text");
                    textElem.textContent = j.getMessage();
                };
                updateImage(j, reader)
            }
        };
    } else {
        thumbnailElement.style.backgroundImage = null;
    }
}
