class NotificationProvider {

    /**
     * Notification Provider Name
     * @type {string}
     */
    name = undefined;

    /**
     * Send a notification
     * @param {BeanModel} notification Notification to send
     * @param {string} msg General Message
     * @param {?object} monitorJSON Monitor details (For Up/Down only)
     * @param {?object} heartbeatJSON Heartbeat details (For Up/Down only)
     * @returns {Promise<string>} Return Successful Message
     * @throws Error with fail msg
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        throw new Error("Have to override Notification.send(...)");
    }

    /**
     * Throws an error
     * @param {any} error The error to throw
     * @returns {void}
     * @throws {any} The error specified
     */
    throwGeneralAxiosError(error) {
        let msg = "Error: " + error + " ";

        if (error.response && error.response.data) {
            if (typeof error.response.data === "string") {
                msg += error.response.data;
            } else {
                msg += JSON.stringify(error.response.data);
            }
        }

        throw new Error(msg);
    }

    /**
     * Extract
     * @param {object|null} monitorJSON Monitor details (For Up/Down/Cert-Expiry only)
     * @returns {string|undefined} the address/url/hostname of the monitor
     */
    extractURL(monitorJSON) {
        if (monitorJSON === null) {
            return undefined;
        }
        switch (monitorJSON["type"]) {
            case "ping":
                return monitorJSON["hostname"];
            case "docker":
                return monitorJSON["docker_host"];
            case "port":
            case "dns":
            case "gamedig":
            case "steam":
                if (monitorJSON["port"]) {
                    return monitorJSON["hostname"] + ":" + monitorJSON["port"];
                }
                return monitorJSON["hostname"];
            default:
                if (monitorJSON["url"] !== "https://") {
                    return monitorJSON["url"];
                }
                return undefined;
        }
    }
}

module.exports = NotificationProvider;
