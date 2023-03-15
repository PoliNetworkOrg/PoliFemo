const crawler = require("npm-license-crawler")
const fs = require("fs/promises")

const exclude = ["<!DOCTYPE html>", "<!--"]
regex = new RegExp(exclude.join("|"), "g")

crawler.dumpLicenses(
  {
    start: ".",
    omitVersion: true,
    noColor: true,
  },
  async (err, res) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    let final = []
    const licenses = Object.entries(res)
    for (let i = 0; i < licenses.length; i++) {
      const [package, license] = licenses[i]
      console.log(
        `Retrieving license for package ${i + 1} of ${
          licenses.length
        }: ${package}`
      )
      let text
      if (license.licenseUrl) {
        try {
          const res = await fetch(license.licenseUrl)
          if (res.status !== 200) console.error("wrong http status!")
          else {
            const txt = await res.text()
            if (regex.test(txt)) console.error("html response!")
            else text = txt
          }
        } catch (e) {
          console.error(
            `failed to fetch license for ${package} from ${license.licenseUrl}!`
          )
          console.error(e)
        }
      } else {
        logger("skip")
      }
      final.push({
        package,
        license: license.licenses,
        licenseText: text,
        licenseURL: license.licenseUrl,
      })
    }
    await fs.writeFile("assets/settings/licenses.json", JSON.stringify(final))
  }
)
