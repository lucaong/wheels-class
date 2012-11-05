var config = module.exports;

config["Node tests"] = {
	rootPath: "../",
	tests: ["spec/*.spec.js"],
	environment: "node"
};

config["Tests with Require JS"] = {
	rootPath: "../",
	environment: "browser",
	libs:  ["spec/lib/*.js"],
	sources: ["wheels-class.js"],
	tests: ["spec/**/*.spec.js"],
	extensions: [require("buster-amd")]
};