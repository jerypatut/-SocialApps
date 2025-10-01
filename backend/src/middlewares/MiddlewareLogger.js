export  const logger =   ((req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const time = diff[0] * 1e3 + diff[1] / 1e6; // dalam ms
    console.log(`${req.method} ${req.originalUrl} - ${time.toFixed(2)} ms`);
  });

  next();
});
