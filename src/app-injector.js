(() => {
    const originalCodeUrl = document.currentScript.src;
    const patchCode = async (originalCode) => {
        console.debug('Start app code patching');

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
