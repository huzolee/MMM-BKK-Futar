Module.register('MMM-BKK-Futar', {

    defaults: {
        line: 'járat',
        stop: 'megálló',
        terminal: 'végállomás',
        come: 'perc'
    },
    getTemplate: function () {
        return 'courierTemplate.njk'
    },
    getTemplateData: function () {
        return this.config
    },
    start: function () {
        this.registerSocketNotificationSender();
    },
    registerSocketNotificationSender: function () {
        this.sendSocketNotification("BKKFutarSocketNotificationSenderRegistered", {
            config: this.config
        });
    }
});
