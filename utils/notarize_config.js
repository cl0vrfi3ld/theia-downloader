// yoinked from https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
const { notarize } = require("@electron/notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }

  console.log("darwin detected, beginning notarization...");

  const appName = context.packager.appInfo.productFilename;

  if (
    !process.env.APPLE_ID ||
    !process.env.APPLE_ID_PASSWORD ||
    !process.env.APPLE_TEAM_ID
  ) {
    return new Error(
      "one or more required environment variables couldn't be found, aborting..."
    );
  }
  console.log("please stand by");
  return await notarize({
    appBundleId: "rocks.theia.client",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
    tool: "notarytool",
  });
};
