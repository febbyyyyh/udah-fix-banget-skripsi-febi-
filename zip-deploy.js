const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream(path.join(__dirname, '..', 'deploy_titikjeda.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('Archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Folders to include: backend, titik-jeda/dist, database.sql, README.md, dsb.
// Paling aman: zip seluruh isi backend (kecuali node_modules) dan titik-jeda/dist

archive.glob('backend/**', {
  ignore: ['backend/node_modules/**', 'backend/.env', 'backend/uploads/**']
});

archive.glob('titik-jeda/dist/**');
archive.file('database.sql', { name: 'database.sql' });

archive.finalize();
