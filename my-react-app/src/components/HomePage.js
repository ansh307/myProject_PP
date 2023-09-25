import React, { Component } from "react";

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // Initialize as an empty array
    };
  }

  componentDidMount() {
    // Replace this with your actual API endpoint.
    fetch("http://localhost:3001/api/getData")
      .then((response) => {
        // console.log(response); // Log the response object
        return response.json();
      })
      .then((data) => {
        // console.log(data); // Log the parsed JSON data
        this.setState({ data });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const requestOptions = {
      method: "POST",
      body: formData,
    };

    try {
      const response = await fetch("http://localhost:3001/api/submit", requestOptions);
      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();

        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Open the Excel file in a new browser window
        window.open(url);

        // Release the URL object
        window.URL.revokeObjectURL(url);
      } else {
        // Handle an error response, such as displaying an error message
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  render() {
    const { data } = this.state;

    return (
      <div className="Container mt-5">
        <h1>Data Table with Checkboxes</h1>
        <form
          action="http://localhost:3001/api/submit"
          method="post"
          onSubmit={this.handleSubmit}
        >
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Select</th>
                <th>ID</th>
                <th>Name</th>
                <th>Enrollment No.</th>
                <th>Roll no.</th>
                <th>College</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Contact No.</th>
                <th>E Mail ID</th>
                
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      name="selectedNames"
                      value={JSON.stringify(item)}
                    />
                  </td>
                  <td>{item["ID"]}</td>
                  <td>{item["Name"]}</td>
                  <td>{item["Enrollment No."]}</td>
                  <td>{item["Roll no."]}</td>
                  <td>{item["College"]}</td>
                  <td>{item["Branch"]}</td>
                  <td>{item["Year"]}</td>
                  <td>{item["Contact No."]}</td>
                  <td>{item["E Mail ID"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <input
            type="submit"
            className="btn btn-primary"
            value="Download Excel"
          />
        </form>
      </div>
    );
  }
}

export default DataTable;
