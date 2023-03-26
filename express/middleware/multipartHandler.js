const busboy = require("busboy");
const { v4: uuidv4 } = require("uuid");
const appendField = require("append-field");
const fs = require("fs");

function logFileInfo(info) {
    console.log("all file info", info);
    const { filename, encoding, mimeType } = info;
    console.log(`File []: filename: %j, encoding: %j, mimeType: %j`, filename, encoding, mimeType);
}

const acceptedImageFormats = ["image/gif", "image/jpeg", "image/jpg", "image/png", "image/webp"];
const acceptedVideoFormats = [];
const acceptedAudioFormats = [];

const getFileExtension = (info) => info.mimeType.match(/(?<=\/).+/)[0];
const isImage = (mimeType) => acceptedImageFormats.includes(mimeType);
const isVideo = (mimeType) => acceptedVideoFormats.includes(mimeType);
const isAudio = (mimeType) => acceptedAudioFormats.includes(mimeType);

//Determine in which folder/dir to save the file
function determineSaveTo(formData, fileExtension) {
    const { context, assignedEntryId } = formData;
    let saveTo = "./media";
    let fileName = `${assignedEntryId}.${fileExtension}`;

    switch (context)
    {
        case "post":
            saveTo += `/posts/${fileName}`;
            break;   
            
        case "comment":
            saveTo += `/comments/${fileName}`;
            break;  

        case "avatar":
            saveTo += `/avatars/${fileName}`;
            break;         
        
        case "ad":
            saveTo += `/ads/${fileName}`;
            break;   
            
        default:
            break;
    }

    return { saveTo, fileName };
}

const contextExists = (formData) => formData?.context;
const isValidContext = (formData) => ["avatar", "post", "comment", "ad"].includes(formData.context);

//If field value is "true" or "false"
//then transform string value to boolean value
//if not, return the original value
function formatVal(val) {
    if (val === "true") {
        return true;
    }

    if (val === "false") {
        return false;
    }

    return val;
}

//Extract the fields from the multipart form, from the request, using the busboy package.
//Esentially converting the multipart form to a JSON format and attaching it to the request body
async function multipartHandler(req, res, next) {
    try {
        const bb = busboy({ headers: req.headers });
        const formData = Object.create(null);
        formData.assignedEntryId = uuidv4();

        //Keep track if the formdata includes a text or/and a file.
        let fileExists = false;
        let textExists = false;

        //the 'field' event is triggered for each field in the multipart form.
        bb.on("field", (name, val, info) => {
            console.log("field name", name);
            console.log("field value", val);
            //append the name of the field and it's value to the formData
            appendField(formData, name, formatVal(val));
        }).on("close", () => {
            console.log("formdata on close", formData);
            if (formData.hasOwnProperty('text_content') && formData.text_content) {
                textExists = true;
            }
        });

        bb.on("file", (name, file, info) => {
            fileExists = true;
            const fileExtension = getFileExtension(info);
            const { saveTo, fileName } = determineSaveTo(formData, fileExtension);
            formData.fileName = fileName;
            file.pipe(fs.createWriteStream(saveTo));
        });

        //the 'close' event is triggered when all fields in the multipart form have been parsed from the request.
        bb.on("close", () => {
            console.log("and ndext 1");
            if (!textExists && !fileExists) {
                return res.json({ success: false, message: "Post must include content" });
            }

            console.log("and ndext 2");
            if (!contextExists(formData)) {
                return res.json({
                    success: false,
                    message: "Context must be provided in form data. Available contexts are [avatar, comment, post, ad]"
                });
            }

            console.log("and ndext 3");
            if (!isValidContext(formData)) {
                return res.json({
                    success: false,
                    message: "Not a valid context. Available contexts are [avatar, comment, post, ad]"
                });
            }
            console.log("and ndext");
            //Attach the formData to the request body in a nice JSON format
            req.body = formData;
            next();
        });

        bb.on("error", (err) => {
            throw new Error(err.message);
        })

        req.pipe(bb);
    } catch (error) {
        console.log(error);
        //Should we add a return res.json({success: "false", message: error}) here?
    }
}

module.exports = { multipartHandler };
