const fs = require("fs");
const csv = require("csv-parser");

const directoryPath = "./input/";

const expectedHeaders = [
  "event_id",
  "order_id",
  "autorenewal",
  "msisdn",
  "request_date",
  "processing_date",
  "partner_id_1",
  "partner_product_id_1",
  "validity",
];

const partnerIds = [
  "hoichoi",
  "chorki",
  "bioscope",
  "lionsgate",
  "t-sports",
  "i-screen",
  "rabbithole",
  "sonyliv",
];

const seenOrderIds = new Set();

let totalRowCount = 0;
let totalInvalidRowCount = 0;
let totalValidRowCount = 0;

function validateHeader(header) {
  console.log("Validating header...");
  for (let i = 0; i < expectedHeaders.length; i++) {
    if (header[i] !== expectedHeaders[i]) {
      console.error(
        `Header validation failed. Expected '${
          expectedHeaders[i]
        }' but found '${header[i]}' at position ${i + 1}`
      );
      return false;
    }
  }
  console.log("Header validation successful.");
  return true;
}

function validateCSVRow(row) {
  totalRowCount++;
  console.log(`Validating row ${totalRowCount}...`);

  if (seenOrderIds.has(row.order_id)) {
    console.error(
      `Validation failed for 'order_id' column in row ${totalRowCount}. Duplicate order_id '${row.order_id}'.`
    );
    totalInvalidRowCount++;
    return false;
  } else {
    seenOrderIds.add(row.order_id);
  }

  if (!row.event_id.match(/^\w{11,30}$/)) {
    console.error(
      `Validation failed for 'event_id' column in row ${totalRowCount}. Value must be between 11 and 30 characters.`
    );
    return false;
  }

  if (!row.order_id.match(/^\w{11,30}$/)) {
    console.error(
      `Validation failed for 'order_id' column in row ${totalRowCount}. Value must be between 11 and 30 characters.`
    );
    return false;
  }

  if (row.autorenewal !== "N") {
    console.error(
      `Validation failed for 'autorenewal' column in row ${totalRowCount}. Value must be 'N'.`
    );
    return false;
  }

  if (!row.msisdn.match(/^8801\d{9}$/)) {
    console.error(
      `Validation failed for 'msisdn' column in row ${totalRowCount}. Value must be a 13-digit Bangladeshi phone number.`
    );
    return false;
  }

  if (!row.request_date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
    console.error(
      `Validation failed for 'request_date' column in row ${totalRowCount}. Invalid date format.`
    );
    return false;
  }

  if (!row.processing_date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
    console.error(
      `Validation failed for 'processing_date' column in row ${totalRowCount}. Invalid date format.`
    );
    return false;
  }

  if (!partnerIds.includes(row.partner_id_1)) {
    console.error(
      `Validation failed for 'partner_id_1' column in row ${totalRowCount}. Value must be one of: ${partnerIds.join(
        ", "
      )}.`
    );
    return false;
  }

  if (typeof row.partner_product_id_1 !== "string") {
    console.error(
      `Validation failed for 'partner_product_id_1' column in row ${totalRowCount}. Value must be a string.`
    );
    return false;
  }

  totalValidRowCount++;
  console.log(`Validation successful for row ${totalRowCount}.`);
  return true;
}

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  files.forEach((file) => {
    fs.createReadStream(`${directoryPath}/${file}`)
      .pipe(csv())
      .on("headers", (headers) => {
        if (validateHeader(headers)) {
          fs.createReadStream(`${directoryPath}/${file}`)
            .pipe(csv())
            .on("data", (row) => {
              if (!validateCSVRow(row)) {
                console.error(`Validation failed for file '${file}'.`);
              }
            })
            .on("end", () => {
              console.log(`Validation completed for file '${file}'.`);
              console.table({
                "Total Rows": totalRowCount,
                "Total Valid Rows": totalValidRowCount,
                "Total Invalid Rows": totalRowCount - totalValidRowCount,
              });
            });
        } else {
          console.error(
            `Validation failed for file '${file}': Header validation failed.`
          );
        }
      })
      .on("error", (error) => {
        console.error(`An error occurred while reading file '${file}':`, error);
      });
  });
});
