(function (w) {
    const trEndpoint = "{{ENDPOINT}}"
    const theConsole = {}
    const fNs = ['log', 'dir', 'count', 'debug', 'info', 'warn', 'error', 'table']

    w.CLT = {
        hostname: w.location.hostname,
        url: w.location.href,
        userAgent: window.navigator.userAgent,
        ip: `{{IP}}`,
    }

    console.log(`Starting CLT: "${trEndpoint}": `, w.CLT)

    fNs.forEach(fnName => {
        theConsole[fnName] = w.console[fnName]
    })

    const proxyFn = (fnName) => {
        return function (...params) {
            fetch(trEndpoint,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({
                        CLT,
                        fnName,
                        params
                    })
                })
                .then(res => {
                    console.log(`CLT sending to: "${trEndpoint}"`)
                    theConsole[fnName](...params)
                })
                .catch(error => {
                    theConsole.error(...params)
                })
        })
    }

    fNs.forEach(fnName => {
        w.console[fnName] = proxyFn(fnName)
    })
})(window)