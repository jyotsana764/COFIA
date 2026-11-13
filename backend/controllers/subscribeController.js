import subscriberModel from '../models/subscriberModel.js';

const subscribe = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address',
            });
        }

        const existingSubscriber = await subscriberModel.findOne({ email });

        if (existingSubscriber) {
            return res.status(409).json({
                success: false,
                message: 'This email is already subscribed',
            });
        }

        await subscriberModel.create({ email });

        return res.status(201).json({
            success: true,
            message: 'Successfully subscribed to the COFIA newsletter',
        });
    } catch (error) {
        console.error('Newsletter subscription error:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'This email is already subscribed',
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to subscribe right now',
        });
    }
};

export { subscribe };