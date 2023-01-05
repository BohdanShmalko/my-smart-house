module.exports = {
    base: [
        {
            value: {
                type: String,
                required: true,
            }
        },
        { timestamps: true },
    ],
    withPins: [
        {
            value: {
                type: String,
                required: true
            },
            pin: {
                type: Number,
                required: true,
                index: true,
            }
        },
        { timestamps: true },
    ]
};