/**
 * --- WARNING ---
 * Questa è una soluzione temporanea dovuta alla mancanza di integrazione di
 * qualcosa da parte di react-native-skia.
 *
 * La soluzione vera è già stata mergiata in main nella repo di react-native-skia
 * ma la versione di react-native-skia che utilizziamo non ha ancora questa patch.
 * Dobbiamo aspettare un aggiornamento a Expo SDK che supporti una qualsiasi
 * versione con questo fix.
 *
 * Questa soluzione è stata presa da questo commento:
 * https://github.com/Shopify/react-native-skia/issues/652#issuecomment-1353372623
 * La PR che ha patchato il problema è questa:
 * https://github.com/Shopify/react-native-skia/pull/1400
 *
 * Una volta aggiornato Expo SDK a una versione che supporta react-native-skia
 * questo file deve essere rimosso, e con esso il suo link dentro a app.json
 */

const plugins = require("expo/config-plugins")
const {
  mergeContents,
} = require("@expo/config-plugins/build/utils/generateCode")
const path = require("path")
const fs = require("fs")

module.exports = function withSkia(config) {
  return plugins.withDangerousMod(config, [
    "ios",
    async config => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      )
      const contents = fs.readFileSync(filePath, "utf-8")

      const preinstallSkia = mergeContents({
        tag: "skia",
        src: contents,
        newSrc: [
          `pre_install do |installer|`,
          `Pod::Installer::Xcode::TargetValidator.send(:define_method, :verify_no_static_framework_transitive_dependencies) {}`,
          `installer.pod_targets.each do |pod|`,
          `bt = pod.send(:build_type)`,
          `if ['React','react-native-skia/Api','react-native-skia/Jsi','react-native-skia/RNSkia','react-native-skia/SkiaHeaders','react-native-skia/Utils','react-native-skia'].include?(pod.name)`,
          `puts "Overriding the build_type to static_library from static_framework for #{pod.name}"`,
          `def pod.build_type;`,
          `Pod::BuildType.static_library`,
          `end`,
          `end`,
          `end`,
          `installer.pod_targets.each do |pod|`,
          `bt = pod.send(:build_type)`,
          `puts "#{pod.name} (#{bt})"`,
          `puts "  linkage: #{bt.send(:linkage)} packaging: #{bt.send(:packaging)}"`,
          `end`,
          `end`,
        ].join("\n"),
        anchor: "flags = get_default_flags()",
        offset: 0,
        comment: "#",
      })

      fs.writeFileSync(filePath, preinstallSkia.contents)

      return config
    },
  ])
}
