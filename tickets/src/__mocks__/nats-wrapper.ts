// nats-wrapper.ts (or relevant file)
export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          console.log("Mock function is called");
          callback();
        }
      ),
  },
};
