class PubSubManager {
    public channels: any;
    public brokerId: any;
    constructor() {
        this.channels = {
            worker: {
                message: '',
                subscribers: []
            },
            erpBackend: {
                message: '',
                subscribers: []
            },
            erpFrontEnd: {
                message: '',
                subscribers: []
            },
            server: {
                message: '',
                subscribers: []
            }
        }
        this.brokerId = setInterval(() => { this.broker() }, 1000);
    }
    subscribe(subscriber: any, channel: any) {
        console.log(`subscribing to ${channel}`);
        this.channels[channel].subscribers.push(subscriber);
    }

    removeBroker() {
        clearInterval(this.brokerId);
    }

    publish(publisher: any, channel: any, message: any) {
        this.channels[channel].message = message;
    }

    broker() {
        for (const channel in this.channels) {
            if (this.channels.hasOwnProperty(channel)) {
                const channelObj = this.channels[channel];
                if (channelObj.message) {
                    console.log(`found message: ${channelObj.message} in ${channel}`);
                    channelObj.subscribers.forEach((subscriber: any) => {
                        subscriber.send(JSON.stringify({
                            message: channelObj.message
                        }));
                    });

                    channelObj.message = '';
                }
            }
        }
    }
}
export const pubSubManager = new PubSubManager();