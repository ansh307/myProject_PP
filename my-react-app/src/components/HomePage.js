import React, { Component } from "react";

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      searchQuery: "",
      columns: [],  // Store the search query
    };
  }

  componentDidMount() {
    this.fetchData();
    this.extractColumns();

    console.log('filteredData:', this.state.filteredData);
    console.log('columns:', this.state.columns);
  }

  fetchData = () => {
    const { searchQuery } = this.state;
    const apiUrl = searchQuery
      ? `https://backendprojectpp-production.up.railway.app/api/getData?search=${searchQuery}`
      : "https://backendprojectpp-production.up.railway.app/api/getData";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data, filteredData: data });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  extractColumns() {
    const { filteredData } = this.state;
    const columns = [];

    if (filteredData.length > 0) {
      const firstItem = filteredData[0];
      for (const key in firstItem) {
        if (firstItem.hasOwnProperty(key)) {
          columns.push(key);
        }
      }
    }

    // Set the 'columns' in your component's state
    this.setState({ columns: columns });
  }

  handleSearch = (e) => {
    const searchQuery = e.target.value;
    this.setState({ searchQuery }, () => {
      this.fetchData();
    });
  };

  filterData() {
    const { data, searchQuery } = this.state;
    const filteredData = data.filter((item) => {
      const contactNo = item["Contact No."];
      console.log(contactNo)
      return contactNo && contactNo.includes(searchQuery);
    });
    this.setState({ filteredData });

    
  }

  
  

  handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const requestOptions = {
      method: "POST",
      body: formData,
    };

    try {
      const response = await fetch(
        "https://backendprojectpp-production.up.railway.app/api/submit",
        requestOptions
      );
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
  // searchQuery
  render() {
    const { filteredData, columns } = this.state;
    console.log(filteredData , columns) // Assume 'columns' contains the list of column names
   

    return (
      <div className="Container mt-5">
        <h1>List of students</h1>
        <input
          type="text"
          placeholder="Search"
          onChange={this.handleSearch}
        />
        <form
          action="https://backendprojectpp-production.up.railway.app/api/submit"
          method="post"
          onSubmit={this.handleSubmit}
        >
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Select</th>
                {columns.map((columnName) => (
                  <th key={columnName}>{columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      name="selectedNames"
                      value={JSON.stringify(item)}
                    />
                  </td>
                  {columns.map((columnName) => (
                    <td key={columnName}>{item[columnName]}</td>
                  ))}
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
