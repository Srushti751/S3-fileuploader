import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

function Fileupload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [files, setFiles] = useState([]);

  const chooseFile = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  //Upload using presigned url
  const UploadHandler = async (e) => {
    e.preventDefault();
    const file = document.querySelector('input[name="file"]');
    const resss = await axios.get("/get-signed-url", {
      headers: { filename: file.files[0].name },
    });
    const url = resss.data.url;
    const fields = resss.data.fields;
    console.log(file.files[0].name);
    const data = {
      bucket: "assessmentbucket57",
      ...fields,
      "Content-Type": file.files[0].type,

      file: file.files[0],
    };

    const formData = new FormData();
    for (const name in data) {
      console.log(data[name]);
      formData.append(name, data[name]);
    }

    await axios.post(url, formData);
  };

  //Function to fetch files
  const getFiles = async () => {
    axios
      .get("/getfiles")
      .then((res) => {
        setFiles([res.data]);
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
    <>
      <form className="container" encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Choose File to Upload
          </label>
          <input
            type="file"
            name="file"
            onChange={chooseFile}
            className="form-control"
          />
        </div>
        <button
          type="submit"
          onClick={(e) => UploadHandler(e)}
          className="btn btn-dark mb-5"
        >
          Upload
        </button>
      </form>

      <div className="list-group container ">
        {files[0] &&
          files[0].map((file, index) => {
            return (
              <button onClick={(e) => onDownload(file)} className="mb-2">
                <li className="list-group-item " key={index}>
                  {file}
                </li>
              </button>
            );
          })}
      </div>
    </>
  );
}

export default Fileupload;
