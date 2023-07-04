/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
    "preset": "ts-jest",
    "setupFilesAfterEnv": ["./jest.setup.js"],
    "transformIgnorePatterns": [
        "/node_modules/(?!(next2d|@next2d))"
    ],
    "transform": {
        "\\.jsx?$": "babel-jest",
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "testEnvironment": "node"
};
