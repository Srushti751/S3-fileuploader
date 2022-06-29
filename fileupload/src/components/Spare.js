const UpdateHandler = (e) => {
    e.preventDefault();
    //create object of form data
    const formData = new FormData();
    formData.append("file", uploadedFile);

    axios.post("/upload", formData).then(res => {
        console.log(res);
    }).catch(err => console.log(err))
}

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         acl: "public-read",
//         bucket: BUCKET,
//         key: function (req, file, cb) {
//             console.log(file);
//             cb(null, file.originalname)
//         }
//     })
// })


// app.post('/upload', upload.single('file'), async function (req, res, next) {
//     res.send('Successfully uploaded')

// })
    const UploadHandler = async(e) => {
        e.preventDefault()
        const file = document.querySelector('input[name="file"]');
        // const resss = await axios.get("/signurl")
        const resss = await axios.get("/get-signed-url")
        console.log(resss.data.uploadURL)
        const url = resss.data.url
        const fields = resss.data.fields
        console.log(file.files[0].name)
        const data = {
            bucket: "assessmentbucket57",
            ...fields,
            'Content-Type': file.files[0].type,
            
            file:  file.files[0]
        };
       
       // const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         acl: "public-read",
//         bucket: BUCKET,
//         key: function (req, file, cb) {
//             console.log(file);
//             cb(null, file.originalname)
//         }
//     })
// })
    
          const formData  = new FormData();
          for (const name in data) {
              console.log(data[name])
            formData.append(name, data[name]);
          }
        // const formData = new FormData();
        // formData.append("file", file.files[0]);

        var options={
            headers:{'Content-type':file.files[0].type, 'x-amz-acl':'public-read'},  

        }

        const response= await fetch(url,{
            method:'PUT',
            body:formData,
            options
        })

        console.log(response)
          
     
    }