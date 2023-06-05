function uploadCsv(uriFile) {
  let stream = fs.createReadStream(`./data/${uriFile}`);
  let csvDataColl = [];
  console.log("uploading csv");
  let fileStream = csv
    .parse()
    .on("data", function (data) {
      csvDataColl.push({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    })
    .on("end", async function () {
      try {
        const res = await Carpark.bulkCreate(csvDataColl);
        fs.rename(`./data/${uriFile}`, `./archives/${uriFile}`, (err) => {
          if (err) {
            console.log("error shifting file to archive");
          }
        });
      } catch (e) {
        // Error in job
        console.log("error occured", e);
      }
    });

  stream.pipe(fileStream);
}

module.export = uploadCsv;
