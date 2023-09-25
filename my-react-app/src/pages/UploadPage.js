import React, { Component } from "react";

class FileUploadForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }

  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.setState({ file });
  };

  handleUpload = async (e) => {
    e.preventDefault();
    const { file } = this.state;

    if (file) {
      const formData = new FormData();
      formData.append("excelFile", file);

      try {
        const response = await fetch("http://localhost:3001/api/upload", {
          method: "POST",
          body: formData,
        });
        // console.log(response);

        if (response.ok) {
          // Handle a successful response, e.g., show a success message
          console.log("File uploaded successfully.");
        } else {
          // Handle an error response, e.g., display an error message
          console.error("Error uploading file." );
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
      }
    }
  };

  render() {
    return (
      <div className="container upload-container">
        <div className="box">
          <h1>Upload Excel Sheet</h1>
          <form encType="multipart/form-data">
            <input
              type="file"
              name="excelFile"
              accept=".xls, .xlsx, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.ms-excel.sheet.macroenabled.12, application/vnd.ms-excel.template.macroenabled.12, application/vnd.ms-excel.sheet.binary.macroenabled.12, application/vnd.ms-excel.template, application/vnd.ms-excel.sheet.binary.macroenabled.12"
              onChange={this.handleFileChange}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleUpload}
            >
              Upload
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default FileUploadForm;
