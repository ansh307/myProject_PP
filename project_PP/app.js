const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const ExcelJS = require("exceljs");
const XLSX = require("xlsx");
const fileUpload = require("express-fileupload");

dotenv.config({ path: "./config.env" });

async function connectToDatabase() {
  try {
    await mongoose.connect(
      process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
    );
    console.log("DB connection successful");
  } catch (error) {
    console.error("DB connection error:", error);
  }
}
connectToDatabase();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(fileUpload());

let uploadedData = []; // Store the data from the uploaded Excel file

app.post("/api/upload", (req, res) => {
  if (!req.files || !req.files.excelFile) {
    return res.status(400).send("No file was uploaded.");
  }

  const excelFile = req.files.excelFile;

  // Check the file extension to determine if it's XLS
  const extension = excelFile.name.split(".").pop().toLowerCase();

  if (extension === "xls") {
    try {
      // Convert XLS to XLSX
      const xlsData = excelFile.data;
      const xlsWorkbook = XLSX.read(xlsData, { type: "buffer" });
      const xlsxData = XLSX.write(xlsWorkbook, {
        bookType: "xlsx",
        type: "buffer",
      });

      // Replace the original file with the XLSX version
      excelFile.data = xlsxData;
      excelFile.name = "converted.xlsx";
    } catch (error) {
      console.error("Error converting XLS to XLSX:", error);
      return res.status(500).send("Error converting XLS to XLSX.");
    }
  }

  // Now excelFile should contain XLSX format, continue processing

  const workbook = new ExcelJS.Workbook();
  workbook.xlsx
    .load(excelFile.data)
    .then((workbook) => {
      const worksheet = workbook.worksheets[0];
      const data = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          // Skip the header row
          const rowData = {};
          row.eachCell((cell, colNumber) => {
            const headerCell = worksheet.getRow(1).getCell(colNumber);
            const header = headerCell.value;
            rowData[header] = cell.value;
          });
          data.push(rowData);
        }
      });

      // Store the data from the uploaded Excel file
      uploadedData = data;

      // Send a response
      res.json(data);
    })
    .catch((error) => {
      console.error("Error parsing Excel file:", error);
      res.status(500).send("Error parsing Excel file.");
    });
});

// !!!!!!!!!!!!!!!!!!!!!!

// app.post("/api/submit", (req, res) => {
//   const selectedNames = req.body.selectedNames;
//   const selectedData = [];

//   if (!selectedNames) {
//     return res.status(400).send("Select at least one name to download.");
//   }

//   // Find the selected data based on the names
//   selectedNames.forEach((name) => {
//     const foundData = data.find((item) => item["Name"] === name);
//     if (foundData) {
//       selectedData.push(foundData);
//     }
//   });

//   if (selectedData.length === 0) {
//     return res.status(400).send("No data found for selected names.");
//   }

//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Selected Names");

//   // Use the same column titles as in your Excel file
//   const columnTitles = [
//     "Select",
//     "ID",
//     "Name",
//     "Enrollment No.",
//     "Roll no.",
//     "College",
//     "Branch",
//     "Year",
//     "Contact No.",
//     "E Mail ID",
//   ];

//   // Add the column titles as the first row
//   worksheet.addRow(columnTitles);

//   // Add the selected data to the worksheet
//   selectedData.forEach((dataItem) => {
//     const row = [];
//     columnTitles.forEach((title) => {
//       row.push(dataItem[title]);
//     });
//     worksheet.addRow(row);
//   });

//   const filename = `selected_names_${Date.now()}.xlsx`;

//   res.setHeader(
//     "Content-Type",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//   );
//   res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

//   workbook.xlsx
//     .write(res)
//     .then(() => {
//       res.end();
//     })
//     .catch((error) => {
//       console.error("Error creating Excel file:", error);
//       res.status(500).send("Error creating Excel file.");
//     });
// });


// !!!!!!!!!!!!!!!!

app.get("/", (req, res) => {
  res.render("index", {
    data: uploadedData, // Use the uploaded data
  });
});

app.post("/api/submit", (req, res) => {
  const selectedNames = req.body.selectedNames;
  console.log(selectedNames)
  let modifiedSelectedNames = selectedNames;

  // If only one name is selected, convert it to an array
  if (typeof selectedNames === "string") {
    modifiedSelectedNames = [selectedNames];
  }

  // Check if no names are selected
  if (!modifiedSelectedNames || modifiedSelectedNames.length === 0) {
    return res.status(400).send("Select at least one name to download.");
  }

  // Create a new Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Selected Names");

  // Add the selected names to the worksheet
  modifiedSelectedNames.forEach((name) => {
    worksheet.addRow([name]);
  });

  // Generate a unique filename for the Excel file
  const filename = `selected_names_${Date.now()}.xlsx`;

  // Set response headers to make it a downloadable file
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  // Send the Excel file to the client
  workbook.xlsx
    .write(res)
    .then(() => {
      res.end();
    })
    .catch((error) => {
      console.error("Error creating Excel file:", error);
      res.status(500).send("Error creating Excel file.");
    });
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.get("/api/getData", (req, res) => {
  res.type("application/json").json(uploadedData); // Provide the uploaded data to other routes
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Listening on port 3000....");
});
 