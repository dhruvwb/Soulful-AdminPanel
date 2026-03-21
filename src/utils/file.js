const readFilesAsDataUrls = files => {
  const readers = files.map(
    file =>
      new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, url: reader.result });
        reader.readAsDataURL(file);
      })
  );

  return Promise.all(readers);
};

export { readFilesAsDataUrls };
