import { FlowgladServer } from '@flowglad/nextjs/server';

export const flowgladServer = new FlowgladServer({
  customAuth: {
    getUserId: async () => 'wagamama_demo_user',
    getCustomerEmail: async () => 'demo@wagamama.co.uk'
  }
});
