const getAliases = () => {
  const paths = [
    "assets",
    "components",
    "constants",
    "hooks",
    "services",
    "types_",
    "utils",
    "contexts",
  ];

  const aliases = paths.reduce((acc, path) => {
    return {
      ...acc,
      [`@${path}/(.*)`]: `<rootDir>/src/${path}/$1`,
    };
  }, {});

  return aliases;
};

module.exports = {
  setupFilesAfterEnv: ["./src/utils/test/mocks/index.ts"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "identity-obj-proxy",
    "@pages/(.*)": "<rootDir>/src/views/$1",
    ...getAliases(),
  },
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
};

