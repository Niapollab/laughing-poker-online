(() => {
    const originalCodeUrl = document.currentScript.src;

    const identifyModule = (code) => {
        const MODULE_PATTERN = /\((.*?)=.*?\).push\(\[\[(\d+)]/
        const match = MODULE_PATTERN.exec(code);

        return {
            var_name: match[1],
            chunk_id: match[2],
        }
    };

    const findFreeFunctionId = (webpack) => {
        let unavailable_identifiers = new Set();

        let max = 0;
        for (const module of webpack) {
            for (const id in module[1]) {
                max = id > max ? id : max;
                unavailable_identifiers.add(id);
            }
        }
        max += 1;

        while (true) {
            const freeId = Math.floor(Math.random() * max);
            if (unavailable_identifiers.has(freeId)) {
                continue;
            }

            return freeId;
        }
    };

    const patchCode = async (originalCode) => {
        console.debug('Start app code patching');

        const module = identifyModule(originalCode);
        console.debug(`Webpack found in variable "${module.var_name}". Current module ID: ${module.chunk_id}`);

        webpack = eval(module.var_name);

        const freeFunctionId = findFreeFunctionId(webpack);
        console.debug(`New function with ID ${freeFunctionId} will be created`)

        let patchedCode = originalCode;

        console.debug('App code patching is finished');
        return patchedCode;
    };

    fetch(originalCodeUrl)
        .then(response => response.text())
        .then(code =>
            patchCode(code)
                .then(code => eval(code))
                .catch(error => console.error(`Unable to patch original app code. ${error.message}`)))
        .catch(error => console.error(`Unable to fetch original app code. ${error.message}`));
})();
