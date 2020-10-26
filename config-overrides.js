module.exports = function override(config, env) {
    config.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
            if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
                // make file-loader ignore WASM files
                oneOf.exclude.push(/physx\.release\.wasm$/);
            }
        });
    });
    config.module.rules.push({
        test: /physx\.release\.wasm$/,
        type: "javascript/auto",
        loader: "file-loader",
    });
    return config;
};
