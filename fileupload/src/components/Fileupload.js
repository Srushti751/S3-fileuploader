import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

function Fileupload() {
  const [uploadedFile, setUploadedFile] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();

  const chooseFile = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  //Upload using presigned url
  const UploadHandler = async (e) => {
    e.preventDefault();

    const resss = await axios.get("/get-signed-url", {
      headers: { filename: uploadedFile.name, fileType: uploadedFile.type },
    });
    const url = resss.data.url;
    const fields = resss.data.fields;
    const data = {
      bucket: "assessmentbucket57",
      ...fields,
      "Content-Type": uploadedFile.type,

      file: uploadedFile,
    };
    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }

    await axios.post(url, formData);
    alert("File uploaded successfully");
    setFiles([...files, uploadedFile.name]);

    fileInputRef.current.value = "";
    setUploadedFile(null);
  };

  //Function to fetch files
  const getFiles = async () => {
    axios
      .get("/getfiles")
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => console.log(err));
  };

  //Function to download a particular file
  const onDownload = (name) => {
    axios
      .get(`/download/${name}`, { responseType: "blob" })
      .then((res) => {
        var file = new Blob([res.data], { type: res.headers["content-type"] });
        saveAs(file, `${name}`);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div className="container mt-3">
      <h4>Choose file to Upload</h4>

      <form className=" formStyle " encType="multipart/form-data">
        <div className="mb-5 formInput">
          <input
            type="file"
            name="file"
            onChange={chooseFile}
            className="form-control"
            ref={fileInputRef}
          />
        </div>
        <div className="formButton">
          <button
            type="submit"
            onClick={(e) => UploadHandler(e)}
            className="btn btn-dark mb-5"
          >
            Upload
          </button>
        </div>
      </form>
      <div className="list-group container ">
        <h5>Uploaded files </h5>
        {files &&
          files.map((file, index) => {
            return (
              <button
                key={index.toString()}
                onClick={(e) => onDownload(file)}
                className="mb-2"
              >
                <li className="list-group-item " key={index}>
                  {file}
                </li>
              </button>
            );
          })}
      </div>
    </div>
  );
}

export default Fileupload;
