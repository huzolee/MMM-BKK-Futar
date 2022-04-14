import Config from './types/Config';

Module.register<Config>('MMM-budapest-go', {
  defaults: {
    comingRoutes: [],
  },

  getStyles(): string[] {
    return ['budapest-go.css'];
  },

  getTemplate(): string {
    return 'budapest-go.njk';
  },

  getTemplateData(): any {
    return this.config;
  },

  start(): void {
    this.registerSocketNotificationSender();
  },

  registerSocketNotificationSender(): void {
    this.sendSocketNotification('BudapestGoSocNotRegistered', {
      config: this.config,
    });
  },

  socketNotificationReceived(notification: string, payload: any): void {
    if (notification === 'BKKFutarNotificationSent') {
      this.config.comingRoutes = payload;
      this.updateDom();
    }
  },
});
