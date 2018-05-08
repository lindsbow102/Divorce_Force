const pdfFiller = require('pdffiller-stream');
const fs = require('fs');
const sourcePDF = "form-test.pdf";
 
const data = {
    "test" : "Fer",
};
 
pdfFiller.fillForm( sourcePDF, data)
    .then((outputStream) => {
        // use the outputStream here;
        console.log(outputStream);
        // will be instance of stream.Readable
    }).catch((err) => {
        console.log(err);
    });
 