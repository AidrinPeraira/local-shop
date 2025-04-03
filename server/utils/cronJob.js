import cron from 'node-cron';
import Coupon from '../models/couponModel.js';

export const initializeCronJobs = () => {
    // date format is as Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), Day of Week (0-6)
    cron.schedule('0 0 * * *', async () => {
      try {
        const result = await Coupon.invalidateExpiredCoupons();
        console.log(`Invalidated ${result.modifiedCount} expired coupons`);
      } catch (error) {
        console.error('Error in coupon invalidation cron job:', error);
      }
    });
  };