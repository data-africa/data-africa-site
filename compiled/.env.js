function defaultExport() {}

defaultExport.NODE_ENV = process.env.NODE_ENV || "development";
defaultExport.API = process.env.API || "https://api.dataafrica.io/";
// defaultExport.API = process.env.API || defaultExport.NODE_ENV === "development"
//                   ? "http://localhost:5000/" : "https://api.dataafrica.io/";
defaultExport.PORT = process.env.PORT || 3300;

module.exports = defaultExport;
