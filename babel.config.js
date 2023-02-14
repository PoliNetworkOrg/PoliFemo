module.exports = function (api) {
    api.cache(true)
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module-resolver",
                {
                    alias: {
                        assets: "./assets",
                        components: "./src/components",
                        navigation: "./src/navigation",
                        pages: "./src/pages",
                        utils: "./src/utils",
                        api: "./src/api",
                    },
                },
            ],
            "react-native-reanimated/plugin",
        ],
    }
}
