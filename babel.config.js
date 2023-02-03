module.exports = function (api) {
    api.cache(true)
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            "react-native-reanimated/plugin",
            [
                "module-resolver",
                {
                    alias: {
                        assets: "./assets",
                        components: "./src/components",
                        navigation: "./src/navigation",
                        pages: "./src/pages",
                        utils: "./src/utils",
                        contexts: "./src/contexts",
                        api: "./src/api",
                    },
                },
            ],
        ],
    }
}
