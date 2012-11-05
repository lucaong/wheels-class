var config = module.exports;

/* Test in browser with no AMD */
config["Browser tests"] = {
	rootPath: "../",
	sources: ["wheels-class.js"],
	tests: ["spec/*.spec.js"]
};