import test from "node:test";
import assert from "node:assert/strict";
import { imageCandidate, verifyImage } from "./recover-chinese-images.mjs";
const page = { imageinfo: [{ mime: "image/jpeg", url: "https://upload.wikimedia.org/test.jpg", descriptionurl: "https://commons.wikimedia.org/wiki/File:Fixture.jpg", extmetadata: { Artist: { value: "Fixture author" }, LicenseShortName: { value: "CC BY-SA 4.0" } } }] };

test("only attributed allowlisted raster files on exact Wikimedia hosts are accepted", () => {
  assert.equal(imageCandidate(page).licence, "CC BY-SA 4.0");
  const wrongLicence = structuredClone(page);
  wrongLicence.imageinfo[0].extmetadata.LicenseShortName.value = "NO RESTRICTIONS";
  assert.throws(() => imageCandidate(wrongLicence), /licence-rejected/);
  const wrongHost = structuredClone(page);
  wrongHost.imageinfo[0].url = "https://upload.wikimedia.org.attacker.invalid/test.jpg";
  assert.throws(() => imageCandidate(wrongHost), /unapproved/);
  const wrongMime = structuredClone(page);
  wrongMime.imageinfo[0].mime = "image/svg+xml";
  assert.throws(() => imageCandidate(wrongMime), /mime-rejected/);
  const noAuthor = structuredClone(page);
  noAuthor.imageinfo[0].extmetadata.Artist.value = "";
  assert.throws(() => imageCandidate(noAuthor), /attribution/);
});

test("saved image must match supported magic bytes and 8 MiB limit", () => {
  assert.doesNotThrow(() => verifyImage(Buffer.from([255, 216, 255]), "image/jpeg"));
  assert.doesNotThrow(() => verifyImage(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), "image/png"));
  assert.throws(() => verifyImage(Buffer.from("<html>"), "image/jpeg"), /signature/);
  assert.throws(() => verifyImage(Buffer.alloc(8 * 1024 * 1024 + 1), "image/png"), /size/);
});
